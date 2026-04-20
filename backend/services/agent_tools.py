import subprocess
from typing import Any
from langchain.tools import Tool
from services.workspace_service import WorkspaceService


class ReadFileTool:
    def __init__(self, workspace_service: WorkspaceService):
        self.workspace_service = workspace_service

    async def execute(self, file_path: str) -> str:
        try:
            content = await self.workspace_service.read_file(file_path)
            return f"File content of {file_path}:\n{content}"
        except Exception as e:
            return f"Error reading file: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="read_file",
            func=lambda path: self.execute(path),
            description="Read the contents of a file. Input should be the file path.",
        )


class WriteFileTool:
    def __init__(self, workspace_service: WorkspaceService):
        self.workspace_service = workspace_service

    async def execute(self, file_path: str, content: str) -> str:
        try:
            await self.workspace_service.write_file(file_path, content)
            return f"Successfully wrote to {file_path}"
        except Exception as e:
            return f"Error writing file: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="write_file",
            func=lambda args: self.execute(args["path"], args["content"]),
            description="Write content to a file. Input should be JSON with 'path' and 'content'.",
        )


class SearchFilesTool:
    def __init__(self, workspace_service: WorkspaceService):
        self.workspace_service = workspace_service

    async def execute(self, workspace_root: str, pattern: str = "*") -> str:
        try:
            files = await self.workspace_service.search_files(workspace_root, pattern)
            return f"Found {len(files)} files:\n" + "\n".join(files[:20])
        except Exception as e:
            return f"Error searching files: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="search_files",
            func=lambda args: self.execute(args["workspace_root"], args.get("pattern", "*")),
            description="Search for files in workspace. Input: JSON with 'workspace_root' and 'pattern'.",
        )


class RunTerminalTool:
    def execute(self, command: str) -> str:
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
            )
            return f"Output:\n{result.stdout}\nError:\n{result.stderr}"
        except Exception as e:
            return f"Error running command: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="run_terminal",
            func=self.execute,
            description="Execute a terminal command. Input should be the command string.",
        )


class GitDiffTool:
    def execute(self, workspace_root: str = ".") -> str:
        try:
            result = subprocess.run(
                ["git", "diff"],
                cwd=workspace_root,
                capture_output=True,
                text=True,
                timeout=10,
            )
            return f"Git diff:\n{result.stdout}" if result.stdout else "No changes"
        except Exception as e:
            return f"Error getting git diff: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="git_diff",
            func=self.execute,
            description="Show git diff of current changes. Input: workspace root path.",
        )


class GitCommitTool:
    def execute(self, message: str, workspace_root: str = ".") -> str:
        try:
            subprocess.run(["git", "add", "."], cwd=workspace_root, check=True)
            
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=workspace_root,
                capture_output=True,
                text=True,
            )
            return f"Commit result:\n{result.stdout}"
        except Exception as e:
            return f"Error committing: {str(e)}"

    def as_tool(self) -> Tool:
        return Tool(
            name="git_commit",
            func=lambda args: self.execute(args["message"], args.get("workspace_root", ".")),
            description="Create a git commit. Input: JSON with 'message' and optional 'workspace_root'.",
        )
