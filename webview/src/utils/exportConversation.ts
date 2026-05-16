import { Message, MessageRole } from '@vyntra/shared';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export function exportConversationToMarkdown(conversation: Conversation): string {
  const lines: string[] = [];

  lines.push(`# ${conversation.title}`);
  lines.push('');
  lines.push(`*Exported from Vyntra Code on ${new Date(conversation.createdAt).toLocaleString()}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const message of conversation.messages) {
    const role = message.role === MessageRole.USER ? '👤 User' : '🤖 Assistant';
    const timestamp = new Date(message.timestamp).toLocaleTimeString();

    lines.push(`## ${role} (${timestamp})`);
    lines.push('');
    lines.push(message.content);
    lines.push('');

    if (message.model) {
      lines.push(`*Model: ${message.model}*`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  lines.push('*End of conversation*');

  return lines.join('\n');
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportConversation(conversation: Conversation) {
  const markdown = exportConversationToMarkdown(conversation);
  const filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.md`;
  downloadMarkdown(filename, markdown);
}
