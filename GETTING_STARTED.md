# Getting Started with Vyntra Code

## 🎯 What is Vyntra Code?

Vyntra Code is an AI-powered VS Code extension that brings Augment-like capabilities to your development workflow:

- **Multi-Provider Support**: Use OpenAI, Anthropic, Gemini, Groq, OpenRouter, or Ollama
- **Workspace Intelligence**: AI understands your entire codebase context
- **Autonomous Agents**: LangGraph-powered agents that can read/write files, run commands, and use git
- **RAG Search**: Semantic code search using Qdrant vector database
- **Professional Architecture**: Production-ready monorepo with TypeScript + FastAPI

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **Python 3.10+** ([Download](https://www.python.org/downloads/))
- ✅ **VS Code 1.85+** ([Download](https://code.visualstudio.com/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ⚠️ **Docker** (Optional, for Qdrant) ([Download](https://www.docker.com/))

## 🚀 Quick Start (5 minutes)

### Step 1: Clone & Install

```powershell
git clone https://github.com/yourusername/vyntra-code.git
cd vyntra-code
.\scripts\setup.ps1
```

### Step 2: Configure API Keys

Edit `backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=your-key-here
GROQ_API_KEY=gsk-your-key-here
```

You need at least ONE provider configured.

### Step 3: Start Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 4: Launch Extension

1. Open this project in VS Code
2. Press **F5** to launch Extension Development Host
3. In the new VS Code window, open any project
4. Click the Vyntra icon in the Activity Bar

## 🎨 Usage Examples

### Basic Chat

1. Click Vyntra icon in sidebar
2. Type: "Explain how authentication works in this codebase"
3. Get AI-powered analysis with full workspace context

### Explain Code

1. Select code in editor
2. Right-click → "Vyntra: Explain Selected Code"
3. Get detailed explanation in chat

### Run Agent Task

1. Cmd+Shift+P → "Vyntra: Run Agent Task"
2. Enter: "Add error handling to all API endpoints"
3. Watch the agent autonomously make changes

### Generate Tests

1. Select a function
2. Cmd+Shift+P → "Vyntra: Generate Tests"
3. Review generated test code

## 🔧 Configuration

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "vyntra.backendUrl": "http://localhost:8000",
  "vyntra.defaultProvider": "openai",
  "vyntra.ragEnabled": false
}
```

### Enable RAG (Optional)

1. Start Qdrant:
```powershell
docker-compose up -d
```

2. Enable in settings:
```json
{
  "vyntra.ragEnabled": true
}
```

3. Index your workspace (automatic on first use)

## 🐛 Troubleshooting

### Backend won't start

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: 
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Extension not appearing

**Problem**: Vyntra icon not in Activity Bar

**Solution**: 
1. Ensure backend is running
2. Check Output → Vyntra Code for errors
3. Reload VS Code window (Cmd+R)

### API key errors

**Problem**: `Error: OpenAI API key not found`

**Solution**: 
1. Check `backend/.env` exists
2. Verify key format (starts with `sk-`)
3. Restart backend after changing `.env`

## 📚 Next Steps

- Read [Architecture Overview](README.md#architecture)
- Explore [Agent Tools](CONTRIBUTING.md#agent-tools)
- Join our [Discord](https://discord.gg/vyntra) (coming soon)

## 💡 Tips

1. **Start Small**: Try basic chat before using agents
2. **Context Matters**: Select relevant code for better results
3. **Review Changes**: Always review agent-generated code
4. **Use Git**: Agent can commit, but you control when to push

## 🆘 Need Help?

- [GitHub Issues](https://github.com/yourusername/vyntra-code/issues)
- [Documentation](https://docs.vyntra.dev) (coming soon)
- Email: support@vyntra.dev
