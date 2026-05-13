import { useState } from 'react';
import { Plus, MessageSquare, X, Trash2, Search, Download } from 'lucide-react';
import clsx from 'clsx';

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages?: any[];
}

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onExport?: (id: string) => void;
}

function ConversationList({
  conversations,
  currentId,
  onSelect,
  onNew,
  onClose,
  onDelete,
  onExport,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.messages?.some((m) => m.content.toLowerCase().includes(lowerQuery))
    );
  });

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500 bg-opacity-30">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-64 border-r border-vscode-input-border flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-vscode-input-border">
        <h2 className="font-semibold text-sm">Conversations</h2>
        <div className="flex gap-1">
          <button
            onClick={onNew}
            className="p-1.5 rounded hover:bg-vscode-list-hover"
            title="New conversation"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-vscode-list-hover"
            title="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-2 border-b border-vscode-input-border">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-2 py-1.5 text-xs rounded bg-vscode-input-bg text-vscode-input-fg border border-vscode-input-border focus:outline-none focus:ring-1 focus:ring-vscode-button-bg"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto vscode-scrollable">
        {filteredConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={clsx(
              'w-full text-left p-3 hover:bg-vscode-list-hover border-b border-vscode-input-border transition-colors group',
              currentId === conv.id && 'bg-vscode-list-active'
            )}
          >
            <div className="flex items-start gap-2">
              <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{highlightText(conv.title, searchQuery)}</p>
                <p className="text-xs opacity-50">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport?.(conv.id);
                  }}
                  className="p-1 rounded hover:bg-vscode-list-hover"
                  title="Export to markdown"
                >
                  <Download size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(conv.id);
                  }}
                  className="p-1 rounded hover:bg-vscode-list-hover"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
