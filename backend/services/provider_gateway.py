import os
from typing import List, Dict, Any, AsyncIterator
import httpx


class ProxyClient:
    """
    Client for free-claude-code proxy.
    Routes all provider calls through the proxy instead of direct API calls.
    """
    def __init__(self):
        self.proxy_url = os.getenv("PROXY_URL", "http://localhost:8338")
        self.client = httpx.AsyncClient(timeout=60.0)

    async def chat(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        stream: bool = False,
    ) -> Dict[str, Any]:
        """
        Send chat request through free-claude-code proxy.
        Uses OpenAI-compatible API format.
        """
        url = f"{self.proxy_url}/v1/chat/completions"

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream,
        }

        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

            return {
                "content": data["choices"][0]["message"]["content"],
                "usage": data.get("usage", {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0,
                }),
            }
        except httpx.HTTPError as e:
            raise RuntimeError(f"Proxy request failed: {e}")

    async def chat_stream(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> AsyncIterator[str]:
        """
        Stream chat response through free-claude-code proxy.
        Yields content chunks as they arrive.
        """
        url = f"{self.proxy_url}/v1/chat/completions"

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }

        try:
            async with self.client.stream("POST", url, json=payload) as response:
                response.raise_for_status()

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]

                        if data_str == "[DONE]":
                            break

                        try:
                            import json
                            data = json.loads(data_str)

                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                content = delta.get("content", "")

                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            continue

        except httpx.HTTPError as e:
            raise RuntimeError(f"Proxy streaming failed: {e}")

    async def get_models(self) -> List[Dict[str, Any]]:
        """
        Get available models from proxy.
        """
        url = f"{self.proxy_url}/v1/models"

        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except httpx.HTTPError:
            return []

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
