import { Message, MessageRole } from '@vyntra/shared';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === MessageRole.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'flex gap-3 p-3 rounded-lg',
        isUser ? 'bg-vscode-input-bg ml-8' : 'bg-opacity-50 mr-8'
      )}
    >
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-blue-500' : 'bg-purple-500'
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                const inline = !match;

                if (!inline && match) {
                  return (
                    <div className="relative group">
                      <button
                        onClick={() => handleCopy(codeString)}
                        className="absolute top-2 right-2 p-1.5 rounded bg-vscode-input-bg hover:bg-vscode-list-hover opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy code"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <Highlight
                        theme={themes.vsDark}
                        code={codeString}
                        language={match[1]}
                      >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                          <pre className={className} style={style}>
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                  <span key={key} {...getTokenProps({ token })} />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    </div>
                  );
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className="mt-2 text-xs opacity-50">
          {new Date(message.timestamp).toLocaleTimeString()}
          {message.model && ` • ${message.model}`}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
