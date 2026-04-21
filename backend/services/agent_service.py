from typing import List, Dict, Any, Optional
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from services.provider_gateway import ProxyClient
from services.workspace_service import WorkspaceService
from services.agent_tools import (
    ReadFileTool,
    WriteFileTool,
    SearchFilesTool,
    RunTerminalTool,
    GitDiffTool,
    GitCommitTool,
)
import os


class AgentService:
    def __init__(self, proxy_client: ProxyClient, workspace_service: WorkspaceService):
        self.proxy_client = proxy_client
        self.workspace_service = workspace_service
        self.tools = self._initialize_tools()

    def _initialize_tools(self) -> List[Tool]:
        return [
            ReadFileTool(self.workspace_service).as_tool(),
            WriteFileTool(self.workspace_service).as_tool(),
            SearchFilesTool(self.workspace_service).as_tool(),
            RunTerminalTool().as_tool(),
            GitDiffTool().as_tool(),
            GitCommitTool().as_tool(),
        ]

    async def run(
        self, task: str, workspace_context: Any, model_config: Any
    ) -> Dict[str, Any]:
        proxy_url = os.getenv("PROXY_URL", "http://localhost:8338")
        llm = ChatOpenAI(
            model=model_config.model,
            temperature=0.7,
            openai_api_base=f"{proxy_url}/v1",
            openai_api_key="dummy-key"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", self._get_system_prompt(workspace_context)),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])

        agent = create_openai_functions_agent(llm, self.tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=self.tools, verbose=True)

        result = await agent_executor.ainvoke({"input": task})

        return {
            "result": result["output"],
            "steps": self._extract_steps(result),
            "toolCalls": self._extract_tool_calls(result),
        }

    def _get_system_prompt(self, workspace_context: Any) -> str:
        base = """You are Vyntra Agent, an autonomous AI coding assistant.

You have access to the following tools:
- read_file: Read the contents of a file
- write_file: Write content to a file
- search_files: Search for files in the workspace
- run_terminal: Execute terminal commands
- git_diff: Show git diff
- git_commit: Create a git commit

Use these tools to complete the user's task. Think step by step and explain your reasoning."""

        if workspace_context and workspace_context.workspaceRoot:
            base += f"\n\nWorkspace root: {workspace_context.workspaceRoot}"

        return base

    def _extract_steps(self, result: Dict[str, Any]) -> List[Dict[str, str]]:
        steps = []
        
        if "intermediate_steps" in result:
            for step in result["intermediate_steps"]:
                steps.append({
                    "thought": str(step[0]) if len(step) > 0 else "",
                    "observation": str(step[1]) if len(step) > 1 else "",
                })
        
        return steps

    def _extract_tool_calls(self, result: Dict[str, Any]) -> List[Dict[str, Any]]:
        tool_calls = []
        
        if "intermediate_steps" in result:
            for i, step in enumerate(result["intermediate_steps"]):
                if len(step) > 0:
                    tool_calls.append({
                        "id": f"call_{i}",
                        "name": getattr(step[0], "tool", "unknown"),
                        "arguments": getattr(step[0], "tool_input", {}),
                    })
        
        return tool_calls
