import os
from typing import List, Dict, Any
from pathlib import Path
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import hashlib


class RAGService:
    def __init__(self):
        self.qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self.collection_name = "vyntra_code"
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        try:
            self.client = QdrantClient(url=self.qdrant_url)
            self._ensure_collection_exists()
        except Exception as e:
            print(f"Warning: Could not connect to Qdrant: {e}")
            self.client = None

    def _ensure_collection_exists(self):
        if not self.client:
            return

        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.collection_name not in collection_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )

    async def index_workspace(self, workspace_root: str):
        if not self.client:
            raise ValueError("Qdrant client not initialized")

        workspace_path = Path(workspace_root)
        points = []
        point_id = 0

        for file_path in workspace_path.rglob("*"):
            if self._should_index(file_path):
                try:
                    content = file_path.read_text(encoding='utf-8')
                    chunks = self._chunk_content(content, str(file_path))
                    
                    for chunk in chunks:
                        embedding = self.embedding_model.encode(chunk["text"])
                        
                        points.append(PointStruct(
                            id=point_id,
                            vector=embedding.tolist(),
                            payload={
                                "file_path": str(file_path),
                                "content": chunk["text"],
                                "line_number": chunk.get("line_number", 0),
                            }
                        ))
                        point_id += 1
                        
                        if len(points) >= 100:
                            self.client.upsert(
                                collection_name=self.collection_name,
                                points=points
                            )
                            points = []
                
                except Exception as e:
                    print(f"Error indexing {file_path}: {e}")

        if points:
            self.client.upsert(collection_name=self.collection_name, points=points)

    async def search(self, query: str, workspace_root: str, limit: int = 10) -> List[Dict[str, Any]]:
        if not self.client:
            return []

        query_embedding = self.embedding_model.encode(query)
        
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding.tolist(),
            limit=limit,
        )

        return [
            {
                "path": hit.payload["file_path"],
                "content": hit.payload["content"],
                "score": hit.score,
                "line_number": hit.payload.get("line_number", 0),
            }
            for hit in results
        ]

    def _should_index(self, file_path: Path) -> bool:
        exclude_dirs = {
            'node_modules', '.git', '__pycache__', 'venv', '.venv',
            'dist', 'build', 'target', '.pytest_cache', 'coverage'
        }
        
        code_extensions = {
            '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.go', '.rs',
            '.cpp', '.c', '.h', '.hpp', '.cs', '.rb', '.php', '.swift'
        }

        if not file_path.is_file():
            return False

        if file_path.suffix not in code_extensions:
            return False

        for part in file_path.parts:
            if part in exclude_dirs or part.startswith('.'):
                return False

        return True

    def _chunk_content(self, content: str, file_path: str, chunk_size: int = 500) -> List[Dict[str, Any]]:
        lines = content.split('\n')
        chunks = []
        current_chunk = []
        current_size = 0
        line_number = 1

        for line in lines:
            current_chunk.append(line)
            current_size += len(line)

            if current_size >= chunk_size:
                chunks.append({
                    "text": '\n'.join(current_chunk),
                    "line_number": line_number,
                })
                current_chunk = []
                current_size = 0

            line_number += 1

        if current_chunk:
            chunks.append({
                "text": '\n'.join(current_chunk),
                "line_number": line_number - len(current_chunk),
            })

        return chunks
