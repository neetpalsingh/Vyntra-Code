import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-vscode-input-border p-4">
      <div className="flex items-end gap-2">
        <button
          className="p-2 rounded hover:bg-vscode-list-hover"
          title="Attach context"
          disabled={disabled}
        >
          <Paperclip size={18} />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Vyntra... (Shift+Enter for new line)"
            disabled={disabled}
            className="w-full px-3 py-2 rounded resize-none bg-vscode-input-bg text-vscode-input-fg border border-vscode-input-border focus:outline-none focus:ring-1 focus:ring-vscode-button-bg"
            rows={1}
            style={{ maxHeight: '200px' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="p-2 rounded bg-vscode-button-bg hover:bg-vscode-button-hover text-vscode-button-fg disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="mt-2 text-xs opacity-50">
        Tip: Select code in the editor for context-aware responses
      </div>
    </div>
  );
}

export default ChatInput;
