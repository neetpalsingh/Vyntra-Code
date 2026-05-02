import { useState, useEffect, useRef } from 'react';
import { Message, MessageRole } from '@vyntra/shared';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ConversationList from './ConversationList';
import { vscode } from '../vscode';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

function ChatView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = vscode.getState();
    if (state?.conversations) {
      setConversations(state.conversations);
      setCurrentConversationId(state.currentConversationId);
    } else {
      createNewConversation();
    }

    vscode.on('message', handleMessage);
    vscode.on('streamChunk', handleStreamChunk);
    vscode.on('streamEnd', handleStreamEnd);

    return () => {
      vscode.off('message', handleMessage);
      vscode.off('streamChunk', handleStreamChunk);
      vscode.off('streamEnd', handleStreamEnd);
    };
  }, []);

  useEffect(() => {
    vscode.setState({ conversations, currentConversationId });
  }, [conversations, currentConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, currentConversationId]);

  const handleMessage = (data: { message: Message }) => {
    addMessage(data.message);
  };

  const handleStreamChunk = (data: { chunk: string }) => {
    updateStreamingMessage(data.chunk);
  };

  const handleStreamEnd = () => {
    setIsStreaming(false);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const addMessage = (message: Message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              title: conv.messages.length === 0 ? message.content.slice(0, 50) : conv.title,
            }
          : conv
      )
    );
  };

  const updateStreamingMessage = (chunk: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== currentConversationId) return conv;

        const messages = [...conv.messages];
        const lastMessage = messages[messages.length - 1];

        if (lastMessage?.role === MessageRole.ASSISTANT) {
          lastMessage.content += chunk;
        } else {
          messages.push({
            id: Date.now().toString(),
            role: MessageRole.ASSISTANT,
            content: chunk,
            timestamp: Date.now(),
          });
        }

        return { ...conv, messages };
      })
    );
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setIsStreaming(true);
    vscode.send('sendMessage', { message: content });
  };

  return (
    <div className="flex h-full">
      {showSidebar && (
        <ConversationList
          conversations={conversations}
          currentId={currentConversationId}
          onSelect={setCurrentConversationId}
          onNew={createNewConversation}
          onClose={() => setShowSidebar(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center px-4 py-2 border-b border-vscode-input-border">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1 rounded hover:bg-vscode-list-hover"
            title="Toggle conversations"
          >
            {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <span className="ml-2 text-sm opacity-70">{currentConversation?.title}</span>
        </div>

        <MessageList messages={currentConversation?.messages || []} isStreaming={isStreaming} />
        
        <div ref={messagesEndRef} />

        <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}

export default ChatView;
