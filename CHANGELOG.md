# Changelog

All notable changes to Vyntra Code will be documented in this file.

## [0.3.0] - 2026-06-24

### 🎉 Advanced Features Release

#### Added

**Multi-File Editing with Diff Preview**
- DiffView component with split/unified modes
- Accept/reject individual files or batch operations
- Syntax highlighting in diffs
- Status indicators (pending/accepted/rejected)
- Expandable file views with line numbers

**File Tree Integration**
- FileTreeView component for workspace exploration
- Hierarchical file tree with expand/collapse
- File type icons (code, json, text)
- Add files to context with visual selection
- Selected file counter

**Agent Task Progress UI**
- AgentProgressView component for real-time tracking
- Step-by-step progress display
- Tool call visualization with arguments/results
- Execution timing and status indicators
- Expandable step details with observations

**RAG Search Results Visualization**
- RAGResultsView component with relevance scores
- Color-coded score visualization (0-100%)
- Progress bars for relevance
- Syntax-highlighted code previews
- Line numbers and file paths
- Add to context / Open file actions

**Conversation Search**
- Real-time search bar in conversation list
- Search by title or message content
- Highlighted search matches
- Filtered conversation list

**Export to Markdown**
- Export conversations as formatted .md files
- Timestamps and model information
- User/Assistant labels
- Code blocks preserved
- Auto-download to filesystem

**Inline Suggestions**
- InlineSuggestion component for code suggestions
- Ghost text overlay with syntax highlighting
- Accept with Tab, reject with Esc
- Position-aware rendering

#### Improved

**Navigation**
- Unified MainLayout component
- 6 view modes: Chat, Files, Diff, Agent, RAG, Settings
- Icon-based navigation with active states
- Smooth view transitions

**UI Components**
- Enhanced ConversationList with search and export
- Updated App.tsx to use MainLayout
- Consistent header across all views

#### Technical

**New Files**
- `webview/src/components/DiffView.tsx`
- `webview/src/components/FileTreeView.tsx`
- `webview/src/components/AgentProgressView.tsx`
- `webview/src/components/RAGResultsView.tsx`
- `webview/src/components/InlineSuggestion.tsx`
- `webview/src/components/MainLayout.tsx`
- `webview/src/utils/exportConversation.ts`

**Dependencies**
- No new dependencies (uses existing Prism, Lucide, etc.)

### 📝 Documentation

- Added `docs/V0.3.0_RELEASE.md` - Feature guide
- Updated CHANGELOG.md

---

## [0.2.0] - 2026-06-24

### 🎉 Major UI Overhaul

#### Added

**React Webview UI**
- Complete rewrite with React 18 + TypeScript
- Vite for fast builds and hot reload
- Tailwind CSS with VS Code theme integration
- Modern component architecture

**Streaming Support**
- Real-time SSE streaming for chat responses
- Chunk-by-chunk rendering
- Improved perceived performance
- Graceful fallback to non-streaming

**Multi-Conversation Management**
- Create and manage multiple chat threads
- Conversation sidebar with list view
- Persistent conversation history (VS Code state)
- Conversation titles auto-generated from first message
- Delete conversations

**Enhanced UI Components**
- `MessageList`: Markdown rendering with syntax highlighting
- `MessageItem`: Code blocks with copy button, timestamps
- `ChatInput`: Auto-resizing textarea, keyboard shortcuts
- `ConversationList`: Sidebar with search and management
- `SettingsView`: Visual configuration panel

**Syntax Highlighting**
- Prism React Renderer integration
- 100+ languages supported
- VS Code Dark theme
- Copy code button on hover

#### Improved

**VS Code Integration**
- Native VS Code CSS variables
- Custom scrollbars matching editor
- Theme-aware colors (dark/light auto-detection)
- Better webview security (CSP headers)

**Settings Management**
- Visual settings panel in webview
- Temperature slider (0-2)
- Max tokens input
- Provider and model dropdowns
- Save confirmation feedback

**Developer Experience**
- Parallel build scripts (`npm run dev`)
- Hot reload for webview development
- Better error messages
- Type-safe messaging between extension and webview

#### Technical Changes

**Architecture**
```
Extension ←→ React Webview
     ↓           ↓
  Backend ←→ Proxy ←→ Providers
```

**Dependencies**
- Added: `react`, `react-dom`, `react-markdown`, `prism-react-renderer`, `lucide-react`
- Added: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `autoprefixer`
- Removed: Inline HTML webview

**Build System**
- Vite bundler for webview
- Proper asset handling
- Source maps for debugging
- Production optimizations

### 📝 Documentation

- Added `docs/V0.2.0_RELEASE.md` - Release notes and guide
- Updated README with new features
- Updated ARCHITECTURE.md

---

## [0.1.0] - 2026-06-24

### 🎉 Initial Release

#### Added

**VS Code Extension**
- Chat sidebar with basic UI
- Commands: Open Chat, Explain Code, Refactor Code, Generate Tests, Run Agent
- Workspace context integration
- Settings configuration for backend URL and default provider

**FastAPI Backend**
- RESTful API with endpoints: `/api/chat`, `/api/agent/run`, `/api/workspace/search`, `/api/models`
- **Proxy-based architecture** using free-claude-code for provider routing
- Intelligent context builder with smart truncation
- MCP service for external integrations (GitHub, etc.)

**Agent Runtime**
- LangGraph-based autonomous agent
- Tool suite:
  - `read_file`: Read file contents
  - `write_file`: Write to files
  - `search_files`: Search workspace
  - `run_terminal`: Execute commands
  - `git_diff`: Show git changes
  - `git_commit`: Create commits

**RAG Service**
- Qdrant vector database integration
- Sentence-transformers embeddings (all-MiniLM-L6-v2)
- Semantic code search with chunking
- Automatic workspace indexing

**Developer Experience**
- Monorepo structure with npm workspaces
- TypeScript shared types package
- PowerShell setup scripts
- VS Code debugging configuration
- Docker Compose for Qdrant
- Comprehensive documentation

#### Architecture

```
Extension (TypeScript) ←→ Vyntra Backend (FastAPI) ←→ free-claude-code Proxy ←→ Providers
                                    ↓
                    Context Builder + Agent (LangGraph) + RAG (Qdrant) + MCP
```

**Key Architectural Decisions:**
- Uses free-claude-code as proxy layer (handles provider routing, auth, streaming)
- Vyntra focuses on IDE-specific features (workspace intelligence, agents, RAG)
- Clean separation of concerns between provider management and coding features

### 📝 Known Limitations

- Webview UI is basic HTML (React UI planned for v0.2.0)
- No streaming support yet
- Single conversation thread only
- No conversation history persistence
- MCP integration not yet implemented

### 🔮 Coming in v0.2.0

- React + Vite webview with Tailwind CSS
- Streaming responses
- Multiple conversation threads
- Conversation history
- Enhanced UI/UX
- Settings panel in webview

---

## Unreleased

### Planned Features

**v0.2.0 - Enhanced UI**
- React webview with modern design
- Streaming chat responses
- Code syntax highlighting
- Multi-conversation management
- Settings panel

**v0.3.0 - Multi-File Editing**
- Diff view for changes
- Batch file operations
- Undo/redo for agent actions
- File tree integration

**v0.4.0 - MCP Integration**
- Filesystem MCP
- GitHub MCP
- Postgres MCP
- Slack MCP
- Custom MCP support

**v0.5.0 - Enterprise Features**
- Team workspaces
- Usage tracking
- Audit logs
- RBAC support
- API rate limiting

---

### Version History

- **0.1.0** (2026-06-24) - Initial release with core features
