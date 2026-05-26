# Vyntra Code - Testing Guide

## ✅ Current Status

All builds are **successful**! The extension is ready for testing.

### Build Status
- ✅ **Shared Package**: Built successfully (ES modules)
- ✅ **Webview**: Built successfully (React + Vite, 428.53 kB)
- ✅ **Extension**: Built successfully (TypeScript compiled)
- ✅ **Backend**: Running on `http://localhost:8000`

### Recent Fixes Applied
1. **ES Module Conversion**: Converted `shared` package from CommonJS to ES modules for Vite compatibility
2. **MessageRole Import**: Fixed all imports of `MessageRole` enum across webview and extension
3. **Icon Names**: Corrected lucide-react icon imports
4. **Build Pipeline**: Resolved all TypeScript compilation errors

---

## 🧪 How to Test the Extension

### 1. Start the Backend (if not running)
```powershell
.\scripts\run-all.ps1
```

This will:
- Set up Python virtual environment
- Install all dependencies
- Build all packages
- Start the backend server on `http://localhost:8000`

### 2. Launch Extension Development Host

**Method 1: Using F5**
1. In VS Code, press **F5**
2. This will:
   - Run the default build task
   - Launch a new VS Code window (Extension Development Host)
   - Load the Vyntra Code extension

**Method 2: Using Command Palette**
1. Press `Ctrl+Shift+P`
2. Type: "Debug: Start Debugging"
3. Select "Run Extension"

### 3. Test the Extension

In the Extension Development Host window:

1. **Open the Chat Panel**
   - Press `Ctrl+Shift+P`
   - Type: "Vyntra: Open Chat"
   - Press Enter
   - The chat panel should appear in the sidebar

2. **Test Basic Chat**
   - Type a message in the chat input
   - Press Send
   - Check if the message appears in the chat

3. **Test Selection Context**
   - Open a code file
   - Select some code
   - Press `Ctrl+Shift+P`
   - Type: "Vyntra: Ask About Selection"
   - Enter your question

4. **Test Agent Tasks**
   - Press `Ctrl+Shift+P`
   - Type: "Vyntra: Run Agent Task"
   - Enter a task description

---

## 🔍 Debugging

### Check Debug Console
- In the main VS Code window, press `Ctrl+Shift+Y` to open Debug Console
- Look for any errors or warnings from the extension

### Check Developer Tools
- In the Extension Development Host window, press `Ctrl+Shift+I`
- Go to Console tab to see webview errors

### Common Issues

#### Backend Not Running
**Symptom**: Extension can't connect to backend
**Solution**:
```powershell
.\scripts\run-all.ps1
```

#### Webview Not Loading
**Symptom**: Chat panel is blank
**Solution**: 
1. Check browser console (Ctrl+Shift+I in Extension Host)
2. Rebuild webview: `npm run build:webview`

#### TypeScript Errors
**Symptom**: Extension doesn't compile
**Solution**:
```powershell
npm run build:all
```

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `Vyntra: Open Chat` | Opens the main chat interface |
| `Vyntra: Ask About Selection` | Ask about selected code |
| `Vyntra: Run Agent Task` | Execute an autonomous agent task |

---

## 🔄 Development Workflow

### Watch Mode (Recommended)
```powershell
# Terminal 1: Watch extension
npm run watch:extension

# Terminal 2: Watch webview
npm run watch:webview

# Terminal 3: Backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

Then press **F5** to start debugging. Changes will hot-reload automatically.

### Full Rebuild
```powershell
npm run build:all
```

---

## 🎯 Testing v0.3.0 Features

### Multi-file Editing
1. Make a code change request
2. Check for diff preview in the chat
3. Verify side-by-side or unified diff view

### File Tree Integration
1. Look for the file tree icon in chat sidebar
2. Click to explore workspace files
3. Add files to context using "Add to Context" button

### Agent Progress UI
1. Run an agent task
2. Watch the progress bar and step indicators
3. Verify tool calls are displayed

### RAG Search Results
1. Enable RAG in settings
2. Make a search query
3. Check scored results with code previews

### Inline Suggestions
1. Type in a code file
2. Look for ghost-text suggestions
3. Press Tab to accept

### Conversation Export
1. Click the export button in chat
2. Select format (Markdown)
3. Verify exported file

---

## 🐛 Known Issues

1. **Qdrant Not Running**: Warning about Qdrant connection (expected, RAG disabled)
2. **Proxy Not Configured**: Need to configure `free-claude-code` proxy at `http://localhost:8338`

---

## ✨ Next Steps

1. **Configure Proxy**: Set up `free-claude-code` for AI provider routing
2. **Test All Features**: Go through each v0.3.0 feature systematically
3. **Check Console**: Monitor for any runtime errors
4. **Performance**: Verify response times and streaming
