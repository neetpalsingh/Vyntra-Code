import { Message } from '@vyntra/shared';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

function MessageList({ messages, isStreaming }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2">Welcome to Vyntra</h2>
          <p className="text-sm opacity-70">
            Your AI coding assistant with workspace intelligence, autonomous agents, and RAG
            search.
          </p>
          <div className="mt-6 text-left space-y-2 text-sm">
            <p className="font-semibold">Try asking:</p>
            <ul className="list-disc list-inside opacity-70 space-y-1">
              <li>Explain this codebase</li>
              <li>How does authentication work?</li>
              <li>Refactor this function to use async/await</li>
              <li>Generate tests for this component</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto vscode-scrollable p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isStreaming && (
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Loader2 size={16} className="animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  );
}

export default MessageList;
