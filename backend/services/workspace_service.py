import os
import aiofiles
from typing import List, Dict, Any
from pathlib import Path


class WorkspaceService:
    async def read_file(self, file_path: str) -> str:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            return await f.read()

    async def write_file(self, file_path: str, content: str) -> None:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(content)

    async def search_files(
        self, workspace_root: str, pattern: str = "*", extensions: List[str] = None
    ) -> List[str]:
        if extensions is None:
            extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.go', '.rs']

        results = []
        workspace_path = Path(workspace_root)

        for ext in extensions:
            for file_path in workspace_path.rglob(f"*{ext}"):
                if self._should_include(file_path):
                    results.append(str(file_path))

        return results

    def _should_include(self, file_path: Path) -> bool:
        exclude_dirs = {
            'node_modules', '.git', '__pycache__', 'venv', '.venv',
            'dist', 'build', 'target', '.pytest_cache', 'coverage'
        }
        
        for part in file_path.parts:
            if part in exclude_dirs or part.startswith('.'):
                return False
        
        return True

    async def get_file_tree(self, workspace_root: str, max_depth: int = 3) -> Dict[str, Any]:
        workspace_path = Path(workspace_root)
        
        def build_tree(path: Path, current_depth: int = 0) -> Dict[str, Any]:
            if current_depth >= max_depth:
                return {}

            tree = {"name": path.name, "path": str(path), "children": []}

            if path.is_dir() and self._should_include(path):
                for child in sorted(path.iterdir()):
                    if self._should_include(child):
                        tree["children"].append(build_tree(child, current_depth + 1))
            
            return tree

        return build_tree(workspace_path)
