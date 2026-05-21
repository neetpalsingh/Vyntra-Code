# Vyntra Code Architecture

## Overview

Vyntra Code uses a layered architecture that leverages **free-claude-code** for provider orchestration while building IDE-specific intelligence on top.

## Architecture Layers

### Layer 1: VS Code Extension (TypeScript)

**Responsibilities:**
- User interface (chat sidebar, commands)
- Workspace context collection
- File system operations
- Terminal integration
- Git operations

**Key Components:**
- `ChatViewProvider` - Webview UI
- `WorkspaceService` - File/workspace operations
- `BackendService` - HTTP client to Vyntra backend

### Layer 2: Vyntra Backend (FastAPI)

**Responsibilities:**
- Workspace intelligence
- Agent orchestration
- RAG semantic search
- MCP integration
- Tool execution
- Context building

**Services:**
```
backend/
├── services/
│   ├── proxy_client.py        # Communicates with free-claude-code
│   ├── workspace_service.py   # File operations, project analysis
│   ├── agent_service.py       # LangGraph agent runtime
│   ├── agent_tools.py         # Tool implementations
│   ├── rag_service.py         # Qdrant vector search
│   ├── mcp_service.py         # MCP integration
│   └── context_builder.py     # Smart context assembly
```

**What Vyntra Backend Does NOT Do:**
- ❌ Direct provider API calls
- ❌ Request translation
- ❌ Authentication management
- ❌ Streaming implementation
- ❌ Model configuration UI

### Layer 3: free-claude-code Proxy

**Responsibilities:**
- Provider routing and switching
- Request translation (OpenAI ↔ Anthropic ↔ Gemini, etc.)
- API key management
- Streaming response handling
- Admin UI
- Model management
- Rate limiting

**Endpoints Used by Vyntra:**
```
POST /v1/chat/completions    # OpenAI-compatible chat
POST /v1/messages            # Anthropic-compatible
GET  /v1/models              # List available models
```

### Layer 4: AI Providers

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3)
- Google Gemini
- Groq (Mixtral, Llama2)
- OpenRouter
- Ollama (local)

## Data Flow

### Simple Chat Request

```
1. User types in VS Code chat sidebar
   ↓
2. Extension sends to Vyntra Backend
   POST /api/chat
   {
     messages: [...],
     workspaceContext: {...}
   }
   ↓
3. Vyntra Backend:
   - Builds context from workspace
   - Injects file contents
   - Prepares system prompt
   ↓
4. Sends to free-claude-code proxy
   POST http://localhost:8338/v1/chat/completions
   {
     model: "gpt-4",
     messages: [...]
   }
   ↓
5. Proxy routes to OpenAI
   ↓
6. Response flows back through layers
   ↓
7. Extension displays in UI
```

### Agent Task Request

```
1. User: "Add error handling to all API endpoints"
   ↓
2. Vyntra Agent Service:
   - Analyzes workspace
   - Plans steps
   - Executes tools (read_file, write_file, etc.)
   - Uses LangGraph for orchestration
   ↓
3. For each LLM call:
   → Routes through free-claude-code proxy
   ↓
4. Tools execute locally in Vyntra Backend:
   - Read/write files
   - Run terminal commands
   - Git operations
   ↓
5. Agent completes task
   ↓
6. Results sent to extension
```

### RAG Search Request

```
1. User asks: "How does authentication work?"
   ↓
2. Vyntra RAG Service:
   - Generates embedding
   - Queries Qdrant
   - Retrieves relevant code
   ↓
3. Context + original question → free-claude-code
   ↓
4. Provider generates answer with context
   ↓
5. Response to user
```

## Component Responsibilities

### Vyntra Extension

| Feature | Responsibility |
|---------|---------------|
| UI | Chat sidebar, commands, settings |
| Context | Collect current file, selection, workspace |
| Communication | HTTP to Vyntra backend |
| Integration | VS Code API, file system, terminals |

### Vyntra Backend

| Feature | Responsibility |
|---------|---------------|
| Context Building | Smart assembly of relevant code |
| Agent Runtime | LangGraph orchestration |
| Tools | File, terminal, git operations |
| RAG | Vector search, indexing |
| MCP | External system integration |
| Business Logic | Project analysis, code intelligence |

### free-claude-code Proxy

| Feature | Responsibility |
|---------|---------------|
| Provider Routing | Switch between OpenAI, Anthropic, etc. |
| Translation | Convert request formats |
| Auth | API key management |
| Streaming | SSE/streaming responses |
| Admin UI | Model configuration |
| Compatibility | OpenAI & Anthropic API standards |

## Configuration

### Vyntra Backend Config

```python
# .env
PROXY_URL=http://localhost:8338  # free-claude-code
QDRANT_URL=http://localhost:6333
```

### free-claude-code Config

```bash
# Managed by free-claude-code
# Handles provider keys, model selection, routing
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - Vyntra focuses on IDE features
   - Proxy handles provider complexity

2. **Maintainability**
   - Provider changes don't affect Vyntra
   - IDE features independent of providers

3. **Reusability**
   - free-claude-code can be used by other tools
   - Vyntra services can work with any OpenAI-compatible API

4. **Scalability**
   - Proxy can be deployed separately
   - Multiple Vyntra instances can share one proxy

5. **Official APIs Only**
   - No cookie/token scraping
   - No ToS violations
   - Sustainable long-term

## Future Enhancements

- **Multi-tenant**: Multiple users sharing proxy
- **Caching**: Smart response caching in proxy
- **Analytics**: Usage tracking at proxy level
- **Fallbacks**: Auto-retry with different providers
