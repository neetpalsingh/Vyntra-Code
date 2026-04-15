from typing import List, Dict, Any, Optional, AsyncIterator
from datetime import datetime
from services.provider_gateway import ProxyClient
import json


class ChatService:
    def __init__(self, proxy_client: ProxyClient):
        self.proxy_client = proxy_client

    async def chat(
        self,
        messages: List[Any],
        model_config: Any,
        workspace_context: Optional[Any] = None,
    ) -> Dict[str, Any]:
        formatted_messages = self._format_messages(messages, workspace_context)

        response = await self.proxy_client.chat(
            model=model_config.model,
            messages=formatted_messages,
            temperature=model_config.temperature or 0.7,
            max_tokens=model_config.maxTokens or 2000,
        )

        return {
            "message": {
                "id": str(datetime.now().timestamp()),
                "role": "assistant",
                "content": response["content"],
                "timestamp": int(datetime.now().timestamp() * 1000),
                "model": model_config.model,
                "provider": model_config.provider,
            },
            "usage": response.get("usage"),
        }

    async def chat_stream(
        self,
        messages: List[Any],
        model_config: Any,
        workspace_context: Optional[Any] = None,
    ) -> AsyncIterator[str]:
        """Stream chat responses."""
        formatted_messages = self._format_messages(messages, workspace_context)

        async for chunk in self.proxy_client.chat_stream(
            model=model_config.model,
            messages=formatted_messages,
            temperature=model_config.temperature or 0.7,
            max_tokens=model_config.maxTokens or 2000,
        ):
            chunk_data = json.dumps({
                "content": chunk,
                "model": model_config.model,
                "provider": model_config.provider,
            })
            yield chunk_data

    def _format_messages(
        self, messages: List[Any], workspace_context: Optional[Any]
    ) -> List[Dict[str, str]]:
        formatted = []

        if workspace_context:
            context_prompt = self._build_context_prompt(workspace_context)
            if context_prompt:
                formatted.append({"role": "system", "content": context_prompt})

        for msg in messages:
            formatted.append({"role": msg.role, "content": msg.content})

        return formatted

    def _build_context_prompt(self, workspace_context: Any) -> str:
        parts = ["You are Vyntra, an AI coding assistant with access to the user's workspace."]

        if workspace_context.workspaceRoot:
            parts.append(f"\nWorkspace root: {workspace_context.workspaceRoot}")

        if workspace_context.currentFile:
            current = workspace_context.currentFile
            parts.append(f"\nCurrent file: {current.get('path', 'Unknown')}")
            parts.append(f"Language: {current.get('language', 'Unknown')}")
            if current.get('content'):
                parts.append(f"\nFile content:\n```\n{current['content']}\n```")

        if workspace_context.selectedCode:
            parts.append(f"\nSelected code:\n```\n{workspace_context.selectedCode}\n```")

        if workspace_context.relatedFiles:
            parts.append(f"\n{len(workspace_context.relatedFiles)} related files available.")

        return "\n".join(parts)
