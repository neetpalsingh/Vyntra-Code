# Quick Start Guide

## 🚀 Option 1: Run Everything (Recommended)

This will set up Python 3.11 venv, install dependencies, and start the backend:

```powershell
.\scripts\run-all.ps1
```

What it does:
1. ✅ Creates Python 3.11 virtual environment in `backend/venv`
2. ✅ Installs all Python dependencies
3. ✅ Installs Node.js dependencies
4. ✅ Builds webview
5. ✅ Starts backend on http://localhost:8000

---

## 🛠️ Option 2: Development Mode (All Watchers)

For active development with hot reload:

```powershell
.\scripts\dev-all.ps1
```

Starts:
- 🐍 Backend with auto-reload
- 📦 Extension TypeScript watcher
- ⚛️ Webview Vite watcher

---

## 📋 Manual Steps

### 1. Backend Only

```powershell
cd backend
.\start.ps1
```

Or using the batch file:
```cmd
cd backend
start.bat
```

### 2. Frontend Only

```powershell
npm run build:webview
npm run build:extension
```

---

## 📝 Prerequisites

### Required:
- ✅ Python 3.11+ (or Python 3.13 works too)
- ✅ Node.js 18+
- ✅ VS Code 1.85+

### Optional:
- Docker (for Qdrant RAG)
- free-claude-code proxy running on http://localhost:8338

---

## 🔧 Configuration

### 1. Backend Configuration

Edit `backend/.env`:

```env
PROXY_URL=http://localhost:8338
QDRANT_URL=http://localhost:6333
BACKEND_PORT=8000
```

### 2. VS Code Extension

Press **F5** in VS Code to launch the extension in debug mode.

---

## ✅ Verification

After running `.\scripts\run-all.ps1`:

1. Check backend: http://localhost:8000
   - Should see: `{"status":"ok","service":"Vyntra Backend"}`

2. Check logs for errors

3. Press **F5** in VS Code

4. In the new VS Code window, click Vyntra icon in sidebar

---

## 🐛 Troubleshooting

### Python version issues

If you need Python 3.11 specifically:

```powershell
# Install Python 3.11 from python.org
# Then:
python3.11 -m venv backend/venv
```

### Virtual environment activation fails

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port already in use

```powershell
# Change port in backend/.env
BACKEND_PORT=8001
```

Then update VS Code settings:
```json
{
  "vyntra.backendUrl": "http://localhost:8001"
}
```

### Dependencies fail to install

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📚 Next Steps

After backend is running:

1. **Set up free-claude-code proxy** (see `docs/PROXY_SETUP.md`)
2. **Configure providers** in proxy admin UI
3. **Press F5** in VS Code to launch extension
4. **Click Vyntra icon** and start chatting!

---

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `.\scripts\run-all.ps1` | Full setup + start backend |
| `.\scripts\dev-all.ps1` | Development mode (all watchers) |
| `cd backend && .\start.ps1` | Backend only |
| `npm run build:webview` | Build React webview |
| `npm run build:extension` | Build VS Code extension |
| `npm run package` | Create .vsix package |

---

## 🆘 Getting Help

- Check logs in terminal
- See `docs/` folder for detailed guides
- GitHub Issues: [Report a problem](https://github.com/yourusername/vyntra-code/issues)
