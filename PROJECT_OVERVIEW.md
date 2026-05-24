# Vyntra Code - Project Overview

## 📊 Project Summary

**Vyntra Code** is a production-ready, Augment-like VS Code extension that brings advanced AI coding capabilities with multi-provider support, autonomous agents, and RAG-powered semantic search.

### Key Statistics

- **Language**: TypeScript + Python
- **Architecture**: Monorepo (Extension + Backend + Shared)
- **License**: MIT
- **Version**: 0.1.0
- **Status**: MVP Complete ✅

## 🏗️ Architecture

### High-Level Flow

```
User ←→ VS Code Extension ←→ FastAPI Backend ←→ AI Providers
                                      ↓
                          LangGraph Agent + Qdrant RAG
```

### Component Breakdown

#### 1️⃣ **VS Code Extension** (`extension/`)
- **Language**: TypeScript
- **Framework**: VS Code Extension API
- **Key Files**:
  - `extension.ts` - Entry point, command registration
  - `providers/ChatViewProvider.ts` - Webview chat UI
  - `services/BackendService.ts` - HTTP client for backend
  - `services/WorkspaceService.ts` - File operations

#### 2️⃣ **FastAPI Backend** (`backend/`)
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Key Services**:
  - `provider_gateway.py` - Multi-provider routing
  - `chat_service.py` - Chat orchestration
  - `agent_service.py` - LangGraph agent runtime
  - `agent_tools.py` - Tool implementations
  - `workspace_service.py` - File system operations
  - `rag_service.py` - Vector search with Qdrant

#### 3️⃣ **Shared Types** (`shared/`)
- **Language**: TypeScript
- **Purpose**: Type definitions shared between extension and future webview
- **Key Types**: `Message`, `ModelConfig`, `WorkspaceContext`, `ToolCall`

## 🎯 Features

### ✅ Implemented (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| Multi-Provider Support | OpenAI, Anthropic, Gemini, Groq, OpenRouter, Ollama | ✅ |
| Chat Interface | Basic HTML webview in sidebar | ✅ |
| Workspace Context | Current file, selected code, workspace root | ✅ |
| Code Commands | Explain, Refactor, Generate Tests | ✅ |
| Autonomous Agent | LangGraph with 6 tools | ✅ |
| RAG Search | Qdrant vector database | ✅ |
| Git Integration | Diff and commit capabilities | ✅ |

### 🔮 Planned (Future Versions)

| Feature | Target Version | Priority |
|---------|----------------|----------|
| React Webview UI | v0.2.0 | High |
| Streaming Responses | v0.2.0 | High |
| Multi-Conversation | v0.2.0 | Medium |
| Multi-File Editing | v0.3.0 | High |
| Diff Preview | v0.3.0 | Medium |
| MCP Integration | v0.4.0 | Medium |
| Team Features | v0.5.0 | Low |

## 🛠️ Technology Stack

### Frontend (Extension)
- **TypeScript** 5.3+
- **VS Code Extension API** 1.85+
- **Axios** (HTTP client)

### Backend
- **FastAPI** 0.109+
- **LangChain** 0.1+
- **LangGraph** 0.0.20+
- **Qdrant Client** 1.7+
- **Sentence Transformers** 2.3+

### AI Providers
- **OpenAI** SDK
- **Anthropic** SDK
- **Google Generative AI** SDK
- **Groq** SDK

### Infrastructure
- **Docker** (for Qdrant)
- **Uvicorn** (ASGI server)
- **npm workspaces** (monorepo)

## 📁 Directory Structure

```
vyntra-code/
├── .vscode/              # VS Code config
├── extension/            # VS Code extension
│   ├── src/
│   │   ├── extension.ts
│   │   ├── providers/
│   │   └── services/
│   ├── resources/
│   └── package.json
├── backend/              # FastAPI backend
│   ├── services/
│   ├── main.py
│   └── requirements.txt
├── shared/               # Shared types
│   └── src/types.ts
├── scripts/              # Setup scripts
├── package.json          # Root package
├── README.md
├── GETTING_STARTED.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

## 🚦 Getting Started

### Quick Commands

```powershell
.\scripts\setup.ps1          # Install dependencies
cd backend && uvicorn main:app --reload  # Start backend
# Press F5 in VS Code        # Launch extension
```

## 🔐 Environment Variables

Required in `backend/.env`:

```env
OPENAI_API_KEY=sk-...        # At least one provider
ANTHROPIC_API_KEY=sk-ant-... # is required
GOOGLE_API_KEY=...
GROQ_API_KEY=gsk-...
QDRANT_URL=http://localhost:6333  # Optional
```

## 📈 Roadmap

### Phase 1: MVP ✅ (Current)
- Core chat functionality
- Multi-provider support
- Basic agent with tools
- RAG search

### Phase 2: Enhanced UI 🔄 (Next)
- React webview
- Streaming responses
- Better UX

### Phase 3: Advanced Features
- Multi-file editing
- Code review
- PR summaries

### Phase 4: Enterprise
- Team workspaces
- Usage analytics
- RBAC

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © 2026 NEETPAL SINGH

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/vyntra-code/issues)
- **Docs**: Coming soon
- **Email**: support@vyntra.dev
