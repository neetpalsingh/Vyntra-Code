import { useState } from 'react';
import {
  MessageSquare,
  Settings,
  FolderTree,
  FileDiff,
  Bot,
  Search as SearchIcon,
} from 'lucide-react';
import ChatView from './ChatView';
import SettingsView from './SettingsView';
import FileTreeView from './FileTreeView';
import DiffView from './DiffView';
import AgentProgressView from './AgentProgressView';
import RAGResultsView from './RAGResultsView';
import clsx from 'clsx';

type View = 'chat' | 'settings' | 'files' | 'diff' | 'agent' | 'rag';

function MainLayout() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col h-screen bg-vscode-background text-vscode-foreground">
      <header className="flex items-center justify-between px-4 py-2 border-b border-vscode-input-border">
        <h1 className="text-lg font-semibold">Vyntra Code v0.3.0</h1>
        <div className="flex gap-1">
          <NavButton
            icon={<MessageSquare size={18} />}
            active={currentView === 'chat'}
            onClick={() => setCurrentView('chat')}
            title="Chat"
          />
          <NavButton
            icon={<FolderTree size={18} />}
            active={currentView === 'files'}
            onClick={() => setCurrentView('files')}
            title="File Explorer"
          />
          <NavButton
            icon={<FileDiff size={18} />}
            active={currentView === 'diff'}
            onClick={() => setCurrentView('diff')}
            title="Diffs"
          />
          <NavButton
            icon={<Bot size={18} />}
            active={currentView === 'agent'}
            onClick={() => setCurrentView('agent')}
            title="Agent"
          />
          <NavButton
            icon={<SearchIcon size={18} />}
            active={currentView === 'rag'}
            onClick={() => setCurrentView('rag')}
            title="RAG Search"
          />
          <NavButton
            icon={<Settings size={18} />}
            active={currentView === 'settings'}
            onClick={() => setCurrentView('settings')}
            title="Settings"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {currentView === 'chat' && <ChatView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'files' && (
          <FileTreeView
            tree={[]}
            selectedFiles={selectedFiles}
            onSelectFile={(path) => console.log('Select:', path)}
            onToggleFile={(path) => {
              const newSelected = new Set(selectedFiles);
              if (newSelected.has(path)) {
                newSelected.delete(path);
              } else {
                newSelected.add(path);
              }
              setSelectedFiles(newSelected);
            }}
          />
        )}
        {currentView === 'diff' && (
          <DiffView
            diffs={[]}
            onAccept={(path) => console.log('Accept:', path)}
            onReject={(path) => console.log('Reject:', path)}
            onAcceptAll={() => console.log('Accept all')}
            onRejectAll={() => console.log('Reject all')}
          />
        )}
        {currentView === 'agent' && (
          <AgentProgressView task="" steps={[]} isRunning={false} />
        )}
        {currentView === 'rag' && (
          <RAGResultsView
            query=""
            results={[]}
            onSelectResult={(result) => console.log('Select:', result)}
          />
        )}
      </main>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}

function NavButton({ icon, active, onClick, title }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-2 rounded transition-colors',
        active
          ? 'bg-vscode-list-active'
          : 'hover:bg-vscode-list-hover'
      )}
      title={title}
    >
      {icon}
    </button>
  );
}

export default MainLayout;
