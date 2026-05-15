import { Check, X, Lightbulb } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';

interface InlineSuggestionProps {
  suggestion: string;
  language: string;
  position: {
    line: number;
    character: number;
  };
  onAccept: () => void;
  onReject: () => void;
  visible: boolean;
}

function InlineSuggestion({
  suggestion,
  language,
  position,
  onAccept,
  onReject,
  visible,
}: InlineSuggestionProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-vscode-editor-background border border-blue-500 rounded-lg shadow-lg overflow-hidden"
      style={{
        top: `${position.line * 20}px`,
        left: `${position.character * 8}px`,
        maxWidth: '600px',
      }}
    >
      <div className="flex items-center gap-2 p-2 bg-blue-600 bg-opacity-20 border-b border-blue-500">
        <Lightbulb size={14} className="text-blue-400" />
        <span className="text-xs font-semibold text-blue-400">Vyntra Suggestion</span>
        <div className="flex-1" />
        <button
          onClick={onAccept}
          className="p-1 rounded bg-green-600 hover:bg-green-700 text-white"
          title="Accept suggestion (Tab)"
        >
          <Check size={12} />
        </button>
        <button
          onClick={onReject}
          className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
          title="Reject suggestion (Esc)"
        >
          <X size={12} />
        </button>
      </div>

      <div className="p-3 max-h-64 overflow-y-auto">
        <Highlight theme={themes.vsDark} code={suggestion} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={clsx(className, 'text-xs opacity-70')} style={style}>
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

      <div className="p-2 bg-vscode-input-bg text-xs opacity-70 border-t border-vscode-input-border">
        Press <kbd className="px-1 py-0.5 bg-vscode-button-bg rounded">Tab</kbd> to accept,{' '}
        <kbd className="px-1 py-0.5 bg-vscode-button-bg rounded">Esc</kbd> to reject
      </div>
    </div>
  );
}

export default InlineSuggestion;
