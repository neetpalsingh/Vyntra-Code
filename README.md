# Vyntra Code

AI-powered VS Code extension with multi-provider support, autonomous agents, and RAG capabilities.

## Architecture

```
Vyntra Code Extension
        ↓
Vyntra Backend (FastAPI)
        ├─ Workspace Intelligence
        ├─ Agent Runtime (LangGraph)
        ├─ RAG Service (Qdrant)
        ├─ MCP Integration
        └─ Tools Layer
        ↓
free-claude-code Proxy
        ├─ Provider Routing
        ├─ Request Translation
        ├─ Authentication
        └─ Streaming
        ↓
AI Providers
   ├─ OpenAI
   ├─ Anthropic
   ├─ Gemini
   ├─ Groq
   ├─ OpenRouter
   └─ Ollama
```

### Why This Architecture?

**free-claude-code** handles the complex provider management:
- ✅ Request translation between provider APIs
- ✅ Provider switching and routing
- ✅ Authentication & API key management
- ✅ Streaming response handling
- ✅ Admin UI for model configuration
- ✅ Anthropic & OpenAI API compatibility

**Vyntra Backend** focuses on IDE-specific features:
- ✅ Workspace intelligence & context
- ✅ Agent workflows with tools
- ✅ RAG semantic search
- ✅ MCP integration
- ✅ File/terminal/git operations
- ✅ Project indexing

## Features

### ✅ Intelligent Architecture
- **Proxy-based design** using free-claude-code for provider management
- **Smart context building** with intelligent truncation
- **Workspace intelligence** that understands your codebase

### ✅ Multi-Provider Support
Via free-claude-code proxy:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3)
- Google Gemini
- Groq (Mixtral, Llama2)
- OpenRouter
- Ollama (local models)

### ✅ VS Code Integration
- Chat sidebar interface
- Code explanation & refactoring
- Test generation
- Context-aware commands

### ✅ Autonomous Agents
- LangGraph-powered orchestration
- 6 built-in tools (file, terminal, git)
- Step-by-step reasoning
- Multi-file operations

### ✅ RAG Semantic Search
- Qdrant vector database
- Workspace indexing
- Semantic code search
- Context-aware retrieval

### ✅ MCP Integration
- GitHub integration
- File system MCP
- Extensible architecture

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- VS Code 1.85+
- (Optional) Qdrant for RAG

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/vyntra-code.git
cd vyntra-code
```

2. **Install dependencies:**
```bash
npm install
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

3. **Set up free-claude-code proxy:**

See [docs/PROXY_SETUP.md](docs/PROXY_SETUP.md) for detailed instructions.

Quick start with Docker:
```bash
# In a separate directory
git clone https://github.com/your-repo/free-claude-code.git
cd free-claude-code
docker-compose up -d
```

Or use an existing instance by setting `PROXY_URL` in step 4.

4. **Configure Vyntra Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env - only need to set PROXY_URL
```

Example `.env`:
```env
PROXY_URL=http://localhost:8338
QDRANT_URL=http://localhost:6333
```

5. **Start Vyntra Backend:**
```bash
cd backend
uvicorn main:app --reload
```

6. **Launch Extension:**
Open VS Code, press F5 to launch the extension in debug mode.

## Configuration

Add to your VS Code `settings.json`:

```json
{
  "vyntra.backendUrl": "http://localhost:8000",
  "vyntra.defaultProvider": "openai",
  "vyntra.ragEnabled": false
}
```

## Usage

### Chat Commands

- `Vyntra: Open Chat` - Open the chat sidebar
- `Vyntra: Explain Selected Code` - Explain highlighted code
- `Vyntra: Refactor Selected Code` - Suggest refactorings
- `Vyntra: Generate Tests` - Generate unit tests
- `Vyntra: Run Agent Task` - Run autonomous agent

### Agent Tools

The agent can:
- Read and write files
- Search the workspace
- Run terminal commands
- Show git diffs
- Create git commits

## Development

### Project Structure

```
vyntra-code/
├── extension/          # VS Code extension (TypeScript)
├── webview/           # React UI (coming soon)
├── shared/            # Shared types
├── backend/           # FastAPI backend
│   └── services/      # Core services
└── package.json       # Monorepo root
```

### Building

```bash
npm run build:all
```

### Packaging

```bash
npm run package
```

## Roadmap

- [x] Project setup
- [x] VS Code extension core
- [x] FastAPI backend
- [x] Multi-provider gateway
- [x] Agent runtime
- [x] RAG service
- [ ] React webview UI
- [ ] Streaming responses
- [ ] Multi-file editing
- [ ] MCP integration
- [ ] Enhanced code review

## License

MIT © 2026 NEETPAL SINGH
