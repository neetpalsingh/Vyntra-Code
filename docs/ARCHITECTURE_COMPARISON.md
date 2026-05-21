# Architecture Comparison: Vyntra vs Proxy Responsibilities

## Component Breakdown

### free-claude-code Proxy

**What it does:**
- ✅ Provider routing (OpenAI, Anthropic, Gemini, Groq, OpenRouter, Ollama)
- ✅ Request translation between API formats
- ✅ API key management & authentication
- ✅ Streaming response handling (SSE)
- ✅ Admin UI for configuration
- ✅ Model management
- ✅ Rate limiting & quotas
- ✅ OpenAI API compatibility (`/v1/chat/completions`)
- ✅ Anthropic API compatibility (`/v1/messages`)

**Tech Stack:**
- Node.js/Express or similar
- Provider SDKs (OpenAI, Anthropic, etc.)
- Admin dashboard

**What it does NOT do:**
- ❌ Understand your workspace
- ❌ Read/write files
- ❌ Execute terminal commands
- ❌ Git operations
- ❌ Code indexing
- ❌ RAG/semantic search
- ❌ Agent orchestration
- ❌ MCP integration
- ❌ VS Code integration

---

### Vyntra Backend

**What it does:**
- ✅ Workspace intelligence & context building
- ✅ File operations (read, write, search)
- ✅ Terminal command execution
- ✅ Git integration (diff, commit, status)
- ✅ Agent runtime (LangGraph orchestration)
- ✅ Agent tools (file, terminal, git)
- ✅ RAG service with Qdrant
- ✅ Code indexing & semantic search
- ✅ MCP integration (GitHub, Slack, etc.)
- ✅ Smart context assembly
- ✅ Project analysis

**Tech Stack:**
- FastAPI (Python)
- LangChain/LangGraph
- Qdrant vector database
- Sentence transformers

**What it does NOT do:**
- ❌ Direct provider API calls
- ❌ Request translation
- ❌ Provider authentication
- ❌ Streaming implementation
- ❌ Provider routing

---

### Vyntra Extension

**What it does:**
- ✅ VS Code UI (chat sidebar, commands)
- ✅ Workspace context collection
- ✅ User interaction
- ✅ File system access via VS Code API
- ✅ Terminal integration
- ✅ Settings management

**Tech Stack:**
- TypeScript
- VS Code Extension API
- React (future webview)

**What it does NOT do:**
- ❌ AI inference
- ❌ Provider management
- ❌ Heavy business logic

---

## Data Flow Examples

### Simple Chat

```
1. User: "Explain this function"
   ↓
2. Extension collects context:
   - Current file
   - Selected code
   - Workspace root
   ↓
3. Sends to Vyntra Backend
   POST /api/chat
   {
     messages: [...],
     workspaceContext: {...}
   }
   ↓
4. Vyntra Backend:
   - Builds intelligent context
   - Adds file contents
   - Creates system prompt
   ↓
5. Sends to free-claude-code
   POST http://localhost:8338/v1/chat/completions
   {
     model: "gpt-4",
     messages: [...]
   }
   ↓
6. Proxy:
   - Routes to OpenAI
   - Translates request
   - Handles auth
   ↓
7. OpenAI responds
   ↓
8. Proxy streams back
   ↓
9. Vyntra formats & returns
   ↓
10. Extension displays
```

### Agent Task with RAG

```
1. User: "Add error handling to all API endpoints"
   ↓
2. Vyntra Agent Service:
   - Queries RAG for existing endpoints
   - Plans multi-step task
   - Uses LangGraph for orchestration
   ↓
3. Agent Step 1: Search files
   - Calls tool locally
   - Gets list of API files
   ↓
4. Agent Step 2: Analyze pattern
   - Sends to proxy for AI analysis
   - Proxy routes to Claude/GPT
   ↓
5. Agent Step 3-N: Apply changes
   - For each file:
     - Read (local tool)
     - Generate fix (via proxy)
     - Write (local tool)
   ↓
6. Agent Step N+1: Commit
   - git_diff (local tool)
   - git_commit (local tool)
   ↓
7. Return results to user
```

---

## Why This Separation Works

### 1. **Concerns are Separated**
- Proxy = Provider complexity
- Vyntra = IDE intelligence

### 2. **Independent Scaling**
- Deploy proxy once, use with multiple tools
- Vyntra focuses on coding features

### 3. **Easy Provider Changes**
- Switch from OpenAI to Anthropic? Just configure proxy
- No code changes in Vyntra

### 4. **Reusability**
- Other tools can use same proxy
- Vyntra can use any OpenAI-compatible API

### 5. **Maintainability**
- Provider API changes? Update proxy
- IDE features? Update Vyntra
- No tangled dependencies

---

## Feature Matrix

| Feature | Proxy | Vyntra Backend | Vyntra Extension |
|---------|-------|----------------|------------------|
| Provider Routing | ✅ | ❌ | ❌ |
| Request Translation | ✅ | ❌ | ❌ |
| API Key Management | ✅ | ❌ | ❌ |
| Streaming | ✅ | ❌ | ❌ |
| Admin UI | ✅ | ❌ | ❌ |
| File Operations | ❌ | ✅ | ✅ |
| Terminal Execution | ❌ | ✅ | ✅ |
| Git Operations | ❌ | ✅ | ✅ |
| RAG/Vector Search | ❌ | ✅ | ❌ |
| Agent Orchestration | ❌ | ✅ | ❌ |
| MCP Integration | ❌ | ✅ | ❌ |
| Workspace Context | ❌ | ✅ | ✅ |
| VS Code UI | ❌ | ❌ | ✅ |
| Chat Interface | ❌ | ❌ | ✅ |

---

## Benefits Over Monolithic Approach

### Before (Direct Provider Calls)
```python
# In Vyntra Backend
from openai import OpenAI
from anthropic import Anthropic

# Need to handle each provider separately
if provider == "openai":
    client = OpenAI(api_key=key)
    response = client.chat.completions.create(...)
elif provider == "anthropic":
    client = Anthropic(api_key=key)
    response = client.messages.create(...)
# ... repeat for each provider
```

### After (Using Proxy)
```python
# In Vyntra Backend
response = await proxy_client.chat(
    model="gpt-4",  # or "claude-3-opus"
    messages=[...],
)
# Proxy handles the rest!
```

---

## Deployment Scenarios

### Development
```
Vyntra Extension (VS Code)
    ↓
Vyntra Backend (localhost:8000)
    ↓
free-claude-code Proxy (localhost:8338)
    ↓
AI Providers
```

### Production (Single User)
```
Vyntra Extension (VS Code)
    ↓
Vyntra Backend (localhost:8000)
    ↓
free-claude-code Proxy (cloud or local)
    ↓
AI Providers
```

### Production (Team)
```
Multiple Vyntra Extensions
    ↓
Multiple Vyntra Backends (per user)
    ↓
Shared free-claude-code Proxy (cloud)
    ↓
AI Providers
```
