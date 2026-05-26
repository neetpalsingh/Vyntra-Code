# Contributing to Vyntra Code

## Development Setup

1. Fork and clone the repository
2. Run setup script: `.\scripts\setup.ps1`
3. Configure your `.env` file with API keys
4. Start Qdrant (optional): `docker-compose up -d`
5. Start backend: `cd backend && uvicorn main:app --reload`
6. Press F5 in VS Code to launch extension

## Project Structure

```
vyntra-code/
├── extension/              # VS Code Extension
│   ├── src/
│   │   ├── extension.ts   # Entry point
│   │   ├── providers/     # Webview providers
│   │   └── services/      # Backend & workspace services
│   └── package.json
│
├── shared/                 # Shared TypeScript types
│   └── src/types.ts
│
├── backend/                # FastAPI Backend
│   ├── main.py            # FastAPI app
│   └── services/
│       ├── provider_gateway.py   # Multi-provider routing
│       ├── chat_service.py       # Chat logic
│       ├── agent_service.py      # LangGraph agent
│       ├── agent_tools.py        # Agent tools
│       ├── workspace_service.py  # File operations
│       └── rag_service.py        # Vector search
│
└── webview/                # React UI (future)
```

## Code Style

- TypeScript: Use Prettier & ESLint
- Python: Follow PEP 8
- Commits: Conventional commits format

## Testing

```bash
npm run lint
cd backend && pytest
```

## Pull Requests

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Submit PR with clear description
