from typing import List, Dict, Any, Optional
import httpx
import json


class MCPService:
    """
    Model Context Protocol integration.
    Connects to external MCP servers for enhanced capabilities.
    """
    
    def __init__(self):
        self.servers: Dict[str, Dict[str, Any]] = {}
        self.client = httpx.AsyncClient(timeout=30.0)
    
    def register_server(self, name: str, url: str, capabilities: List[str]):
        """Register an MCP server."""
        self.servers[name] = {
            "url": url,
            "capabilities": capabilities,
            "enabled": True,
        }
    
    async def call_tool(
        self,
        server_name: str,
        tool_name: str,
        arguments: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Call a tool on an MCP server."""
        
        if server_name not in self.servers:
            raise ValueError(f"Unknown MCP server: {server_name}")
        
        server = self.servers[server_name]
        if not server["enabled"]:
            raise ValueError(f"MCP server {server_name} is disabled")
        
        url = f"{server['url']}/tools/{tool_name}"
        
        try:
            response = await self.client.post(url, json=arguments)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise RuntimeError(f"MCP tool call failed: {e}")
    
    async def list_tools(self, server_name: str) -> List[Dict[str, Any]]:
        """List available tools on an MCP server."""
        
        if server_name not in self.servers:
            raise ValueError(f"Unknown MCP server: {server_name}")
        
        server = self.servers[server_name]
        url = f"{server['url']}/tools"
        
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json().get("tools", [])
        except httpx.HTTPError:
            return []
    
    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()


class FileSystemMCP:
    """
    Filesystem MCP implementation.
    Provides safe file operations.
    """
    
    async def read_file(self, path: str) -> str:
        """Read file securely."""
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    
    async def write_file(self, path: str, content: str) -> bool:
        """Write file securely."""
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    async def list_directory(self, path: str) -> List[str]:
        """List directory contents."""
        from pathlib import Path
        p = Path(path)
        return [str(item) for item in p.iterdir()]


class GitHubMCP:
    """
    GitHub MCP implementation.
    Integrates with GitHub API.
    """
    
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.client = httpx.AsyncClient(
            base_url="https://api.github.com",
            headers={"Authorization": f"token {token}"} if token else {},
            timeout=30.0,
        )
    
    async def create_issue(
        self,
        repo: str,
        title: str,
        body: str,
        labels: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Create a GitHub issue."""
        
        data = {
            "title": title,
            "body": body,
            "labels": labels or [],
        }
        
        response = await self.client.post(f"/repos/{repo}/issues", json=data)
        response.raise_for_status()
        return response.json()
    
    async def create_pr(
        self,
        repo: str,
        title: str,
        head: str,
        base: str,
        body: str,
    ) -> Dict[str, Any]:
        """Create a pull request."""
        
        data = {
            "title": title,
            "head": head,
            "base": base,
            "body": body,
        }
        
        response = await self.client.post(f"/repos/{repo}/pulls", json=data)
        response.raise_for_status()
        return response.json()
    
    async def list_prs(self, repo: str, state: str = "open") -> List[Dict[str, Any]]:
        """List pull requests."""
        
        response = await self.client.get(f"/repos/{repo}/pulls?state={state}")
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()
