# Vyntra Code Quick Start Guide

## 🎯 30-Second Overview

Vyntra Code = VS Code Extension + Backend + Proxy

- **Extension**: Chat UI, commands, workspace integration
- **Backend**: Smart context, agents, RAG, MCP, tools
- **Proxy**: Provider routing, auth, streaming (uses free-claude-code)

## ⚡ 5-Minute Setup

### Step 1: Get free-claude-code Proxy Running

**Option A - Docker (Easiest):**
```bash
git clone https://github.com/your-repo/free-claude-code.git
cd free-claude-code
docker-compose up -d
```

**Option B - Use existing instance:**
If you already have free-claude-code running, just note the URL.

Verify it's running:
```bash
curl http://localhost:8338/health
```

### Step 2: Configure Providers

Access admin UI: `http://localhost:8338/admin`

Add at least ONE API key:
- OpenAI: `sk-...`
- Anthropic: `sk-ant-...`
- Groq: `gsk_...`
- etc.

### Step 3: Set Up Vyntra

```bash
git clone https://github.com/yourusername/vyntra-code.git
cd vyntra-code

# Install dependencies
.\scripts\setup.ps1

# Configure backend
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PROXY_URL=http://localhost:8338
QDRANT_URL=http://localhost:6333  # Optional for RAG
```

### Step 4: Start Everything

Terminal 1 - Vyntra Backend:
```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Terminal 2 - VS Code Extension:
```
1. Open vyntra-code folder in VS Code
2. Press F5
3. New VS Code window opens with extension loaded
```

### Step 5: Test It

In the new VS Code window:
1. Click Vyntra icon in sidebar
2. Type: "Hello, test the connection"
3. You should get a response!

## 🎨 Usage Examples

### Basic Chat
1. Open any project in VS Code
2. Click Vyntra icon
3. Ask: "What does this project do?"

### Explain Code
1. Select any code
2. Right-click → "Vyntra: Explain Selected Code"
3. See explanation in chat

### Agent Task
1. Cmd+Shift+P → "Vyntra: Run Agent Task"
2. Enter: "Add JSDoc comments to all functions in this file"
3. Watch agent work autonomously

### With RAG (Optional)
1. Start Qdrant: `docker-compose up -d` (in vyntra-code root)
2. Enable in VS Code settings: `"vyntra.ragEnabled": true`
3. Ask: "How does authentication work?" - Gets semantic search results

## 🔧 Configuration

### Minimal (Required)
```env
# backend/.env
PROXY_URL=http://localhost:8338
```

### Full (All Features)
```env
# backend/.env
PROXY_URL=http://localhost:8338
QDRANT_URL=http://localhost:6333
BACKEND_PORT=8000
LOG_LEVEL=info
```

### VS Code Settings
```json
{
  "vyntra.backendUrl": "http://localhost:8000",
  "vyntra.ragEnabled": false
}
```

## 🐛 Troubleshooting

### Extension not appearing
```bash
# Check backend is running
curl http://localhost:8000/

# Check proxy is running
curl http://localhost:8338/health

# Reload VS Code: Cmd+R
```

### No response from chat
```bash
# Test proxy has provider configured
curl http://localhost:8338/v1/models

# Check backend logs
cd backend
uvicorn main:app --reload --log-level debug
```

### Agent tools failing
Make sure you're in a git repository and have write permissions.

## 📚 Next Steps

- Read [Architecture](../ARCHITECTURE.md) to understand the system
- See [Proxy Setup](PROXY_SETUP.md) for advanced proxy configuration
- Check [Architecture Comparison](ARCHITECTURE_COMPARISON.md) for design decisions

## 🚀 Advanced: Production Setup

For production use:

1. Deploy free-claude-code proxy separately (cloud/server)
2. Point Vyntra to proxy URL
3. Use Qdrant Cloud for RAG
4. Configure MCP for GitHub/Slack integration

See full deployment guide in docs (coming soon).

## 💡 Tips

1. **Start simple**: Just chat first, then try agents
2. **Use RAG for large codebases**: Semantic search is powerful
3. **Review agent changes**: Always check what the agent did
4. **Leverage context**: Select relevant code for better answers
5. **Use git**: Agent can commit but you control pushes

## 🆘 Getting Help

- GitHub Issues: [Report bugs](https://github.com/yourusername/vyntra-code/issues)
- Architecture questions: See [docs/](.)
- Proxy issues: Check [free-claude-code docs](https://github.com/your-repo/free-claude-code)
