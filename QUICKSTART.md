# ⚡ Vyntra Code - Quick Start

## 🎯 Fastest Way to Run

### Single Command Setup:

```powershell
.\scripts\run-all.ps1
```

This will:
1. Create Python virtual environment
2. Install all dependencies  
3. Build the webview
4. Start the backend server

**Then press F5 in VS Code to launch the extension!**

---

## 📋 What's Running

After the script finishes, you'll see:

```
✅ Backend: http://localhost:8000
```

The backend is now waiting for connections from the VS Code extension.

---

## 🔌 Connect the Extension

1. Open this project in VS Code
2. Press **F5** (or Run → Start Debugging)
3. A new VS Code window opens with Vyntra loaded
4. Click the **Vyntra icon** in the Activity Bar (sidebar)
5. Start chatting!

---

## ⚙️ First-Time Configuration

### 1. Set up free-claude-code proxy (Required)

The backend needs a proxy to route AI provider calls.

**Quick setup:**
```powershell
# In a separate terminal
git clone https://github.com/your-repo/free-claude-code.git
cd free-claude-code
docker-compose up -d
```

Or see `docs/PROXY_SETUP.md` for detailed instructions.

### 2. Configure providers

Open http://localhost:8338/admin and add your API keys:
- OpenAI: `sk-...`
- Anthropic: `sk-ant-...`
- Or any other supported provider

---

## ✅ Verify Everything Works

1. **Check backend**: Open http://localhost:8000
   - Should see: `{"status":"ok","service":"Vyntra Backend"}`

2. **Check extension**: In the debug VS Code window
   - Click Vyntra icon
   - Type "Hello"
   - You should get a response!

---

## 🛑 Stop the Backend

Press `Ctrl+C` in the PowerShell terminal running the backend.

---

## 🔄 Development Mode

For active development with hot-reload:

```powershell
.\scripts\dev-all.ps1
```

This starts:
- Backend with auto-reload
- Extension watcher  
- Webview watcher

All three will automatically rebuild when you make changes!

---

## 🐛 Common Issues

### "Python not found"
Install Python 3.11 or higher from https://python.org

### "Cannot activate virtual environment"
Run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Port 8000 already in use"
Change the port in `backend/.env`:
```env
BACKEND_PORT=8001
```

### "Proxy connection failed"
Make sure free-claude-code is running on http://localhost:8338

---

## 📚 Next Steps

- Read `START.md` for detailed instructions
- See `docs/PROXY_SETUP.md` for proxy configuration
- Check `docs/V0.3.0_RELEASE.md` for new features
- Explore `ARCHITECTURE.md` to understand the system

---

## 🆘 Need Help?

Check the logs in the terminal for error messages, or see the troubleshooting guides in the `docs/` folder.
