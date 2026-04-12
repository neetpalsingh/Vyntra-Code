from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.chat_service import ChatService
from services.provider_gateway import ProxyClient
from services.agent_service import AgentService
from services.workspace_service import WorkspaceService
from services.rag_service import RAGService

load_dotenv()

app = FastAPI(title="Vyntra Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

proxy_client = ProxyClient()
chat_service = ChatService(proxy_client)
workspace_service = WorkspaceService()
rag_service = RAGService()
agent_service = AgentService(proxy_client, workspace_service)


class Message(BaseModel):
    id: str
    role: str
    content: str
    timestamp: int
    model: Optional[str] = None
    provider: Optional[str] = None


class ModelConfig(BaseModel):
    provider: str
    model: str
    apiKey: Optional[str] = None
    baseUrl: Optional[str] = None
    temperature: Optional[float] = 0.7
    maxTokens: Optional[int] = 2000


class WorkspaceContext(BaseModel):
    currentFile: Optional[dict] = None
    selectedCode: Optional[str] = None
    relatedFiles: Optional[List[dict]] = None
    workspaceRoot: Optional[str] = None


class ChatRequest(BaseModel):
    messages: List[Message]
    modelConfig: ModelConfig
    workspaceContext: Optional[WorkspaceContext] = None
    stream: bool = False


class AgentRequest(BaseModel):
    task: str
    workspaceContext: WorkspaceContext
    modelConfig: ModelConfig


class VectorSearchRequest(BaseModel):
    query: str
    workspaceRoot: str
    limit: int = 10


@app.get("/")
async def root():
    return {"status": "ok", "service": "Vyntra Backend"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if request.stream:
            async def generate():
                async for chunk in chat_service.chat_stream(
                    messages=request.messages,
                    model_config=request.modelConfig,
                    workspace_context=request.workspaceContext,
                ):
                    yield f"data: {chunk}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(generate(), media_type="text/event-stream")
        else:
            response = await chat_service.chat(
                messages=request.messages,
                model_config=request.modelConfig,
                workspace_context=request.workspaceContext,
            )
            return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/run")
async def run_agent(request: AgentRequest):
    try:
        response = await agent_service.run(
            task=request.task,
            workspace_context=request.workspaceContext,
            model_config=request.modelConfig,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/workspace/search")
async def search_workspace(request: VectorSearchRequest):
    try:
        results = await rag_service.search(
            query=request.query,
            workspace_root=request.workspaceRoot,
            limit=request.limit,
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/models")
async def get_models():
    try:
        models = await proxy_client.get_models()
        return {"models": models}
    except Exception as e:
        return {
            "models": [],
            "error": str(e),
            "fallback": {
                "openai": ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"],
                "anthropic": ["claude-3-opus-20240229", "claude-3-sonnet-20240229"],
            }
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
