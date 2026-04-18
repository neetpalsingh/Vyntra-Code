from typing import List, Dict, Any, Optional
from pathlib import Path
import re


class ContextBuilder:
    """
    Intelligent context assembly for AI requests.
    Builds smart, relevant context from workspace instead of dumping everything.
    """
    
    def __init__(self, workspace_service, rag_service=None):
        self.workspace_service = workspace_service
        self.rag_service = rag_service
    
    async def build_context(
        self,
        user_query: str,
        current_file: Optional[Dict[str, Any]] = None,
        selected_code: Optional[str] = None,
        workspace_root: Optional[str] = None,
        max_tokens: int = 4000,
    ) -> str:
        """Build intelligent context based on query and workspace state."""
        
        context_parts = []
        token_budget = max_tokens
        
        context_parts.append("You are Vyntra, an AI coding assistant with workspace access.")
        context_parts.append("")
        
        if workspace_root:
            context_parts.append(f"Workspace: {workspace_root}")
            token_budget -= 100
        
        if current_file:
            file_context = await self._build_file_context(
                current_file, selected_code, token_budget // 2
            )
            context_parts.append(file_context)
            token_budget -= len(file_context) // 4
        
        if self.rag_service and workspace_root and token_budget > 500:
            rag_context = await self._build_rag_context(
                user_query, workspace_root, token_budget // 2
            )
            if rag_context:
                context_parts.append(rag_context)
        
        return "\n".join(context_parts)
    
    async def _build_file_context(
        self,
        file_info: Dict[str, Any],
        selected_code: Optional[str],
        max_tokens: int,
    ) -> str:
        """Build context from current file."""
        
        parts = [f"\n## Current File: {file_info.get('path', 'Unknown')}"]
        
        if file_info.get('language'):
            parts.append(f"Language: {file_info['language']}")
        
        if selected_code:
            parts.append("\n### Selected Code:")
            parts.append(f"```{file_info.get('language', '')}")
            parts.append(selected_code[:max_tokens * 4])
            parts.append("```")
        elif file_info.get('content'):
            content = file_info['content']
            parts.append("\n### File Content:")
            parts.append(f"```{file_info.get('language', '')}")
            parts.append(self._truncate_content(content, max_tokens * 4))
            parts.append("```")
        
        return "\n".join(parts)
    
    async def _build_rag_context(
        self,
        query: str,
        workspace_root: str,
        max_tokens: int,
    ) -> Optional[str]:
        """Build context from RAG search results."""
        
        try:
            results = await self.rag_service.search(
                query=query,
                workspace_root=workspace_root,
                limit=5,
            )
            
            if not results:
                return None
            
            parts = ["\n## Relevant Code (from workspace):\n"]
            
            for i, result in enumerate(results[:3], 1):
                parts.append(f"### {i}. {result['path']}")
                parts.append(f"```")
                parts.append(self._truncate_content(result['content'], 500))
                parts.append("```\n")
            
            return "\n".join(parts)
        except Exception:
            return None
    
    def _truncate_content(self, content: str, max_chars: int) -> str:
        """Intelligently truncate content."""
        
        if len(content) <= max_chars:
            return content
        
        lines = content.split('\n')
        
        if len(lines) > 100:
            important_lines = self._extract_important_lines(lines)
            content = '\n'.join(important_lines[:100])
        
        if len(content) > max_chars:
            content = content[:max_chars] + "\n... (truncated)"
        
        return content
    
    def _extract_important_lines(self, lines: List[str]) -> List[str]:
        """Extract important lines (definitions, exports, etc.)."""
        
        important = []
        
        patterns = [
            r'^(class|function|def|async def|export|import|interface|type)\s',
            r'^\s*(public|private|protected)\s',
            r'^const\s+\w+\s*=',
            r'@\w+',
        ]
        
        for line in lines:
            if any(re.search(pattern, line) for pattern in patterns):
                important.append(line)
            elif line.strip() and not line.strip().startswith('#'):
                important.append(line)
        
        return important if important else lines
    
    def estimate_tokens(self, text: str) -> int:
        """Rough token estimation."""
        return len(text) // 4
    
    async def build_agent_context(
        self,
        task: str,
        workspace_root: str,
    ) -> str:
        """Build context specifically for agent tasks."""
        
        parts = [
            "You are an autonomous coding agent with the following capabilities:",
            "",
            "## Tools Available:",
            "- read_file(path): Read file contents",
            "- write_file(path, content): Write to files",
            "- search_files(pattern): Find files in workspace",
            "- run_terminal(command): Execute shell commands",
            "- git_diff(): Show current changes",
            "- git_commit(message): Commit changes",
            "",
            f"## Workspace: {workspace_root}",
            "",
            f"## Task: {task}",
            "",
            "Think step-by-step. Use tools to explore, then make changes.",
        ]
        
        return "\n".join(parts)
