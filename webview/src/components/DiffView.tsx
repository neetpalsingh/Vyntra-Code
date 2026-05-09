import { useState } from 'react';
import { FileEdit, FileDiff, Check, X, Eye } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';

interface FileDiff {
  path: string;
  language: string;
  oldContent: string;
  newContent: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface DiffViewProps {
  diffs: FileDiff[];
  onAccept: (path: string) => void;
  onReject: (path: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

function DiffView({ diffs, onAccept, onReject, onAcceptAll, onRejectAll }: DiffViewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const toggleFile = (path: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFiles(newExpanded);
  };

  const pendingCount = diffs.filter((d) => d.status === 'pending').length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-vscode-input-border">
        <div className="flex items-center gap-2">
          <FileDiff size={18} />
          <span className="font-semibold">
            File Changes ({pendingCount} pending)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
            className="px-2 py-1 text-xs rounded bg-vscode-input-bg hover:bg-vscode-list-hover"
          >
            {viewMode === 'split' ? 'Split' : 'Unified'}
          </button>
          <button
            onClick={onAcceptAll}
            disabled={pendingCount === 0}
            className="px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept All
          </button>
          <button
            onClick={onRejectAll}
            disabled={pendingCount === 0}
            className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto vscode-scrollable">
        {diffs.map((diff) => (
          <div key={diff.path} className="border-b border-vscode-input-border">
            <div
              className={clsx(
                'flex items-center justify-between p-3 cursor-pointer hover:bg-vscode-list-hover',
                diff.status === 'accepted' && 'bg-green-900 bg-opacity-20',
                diff.status === 'rejected' && 'bg-red-900 bg-opacity-20'
              )}
              onClick={() => toggleFile(diff.path)}
            >
              <div className="flex items-center gap-2">
                <FileEdit size={16} />
                <span className="text-sm font-mono">{diff.path}</span>
                {diff.status !== 'pending' && (
                  <span
                    className={clsx(
                      'text-xs px-2 py-0.5 rounded',
                      diff.status === 'accepted' && 'bg-green-600 text-white',
                      diff.status === 'rejected' && 'bg-red-600 text-white'
                    )}
                  >
                    {diff.status}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {diff.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept(diff.path);
                      }}
                      className="p-1.5 rounded bg-green-600 hover:bg-green-700 text-white"
                      title="Accept changes"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(diff.path);
                      }}
                      className="p-1.5 rounded bg-red-600 hover:bg-red-700 text-white"
                      title="Reject changes"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
                <Eye size={16} className="opacity-50" />
              </div>
            </div>

            {expandedFiles.has(diff.path) && (
              <div className="p-4 bg-vscode-editor-background">
                {viewMode === 'split' ? (
                  <SplitDiffView diff={diff} />
                ) : (
                  <UnifiedDiffView diff={diff} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitDiffView({ diff }: { diff: FileDiff }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-semibold mb-2 text-red-400">Before</div>
        <Highlight theme={themes.vsDark} code={diff.oldContent} language={diff.language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={clsx(className, 'text-xs p-3 rounded')} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-3 opacity-50">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      <div>
        <div className="text-xs font-semibold mb-2 text-green-400">After</div>
        <Highlight theme={themes.vsDark} code={diff.newContent} language={diff.language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={clsx(className, 'text-xs p-3 rounded')} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-3 opacity-50">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

function UnifiedDiffView({ diff }: { diff: FileDiff }) {
  const oldLines = diff.oldContent.split('\n');
  const newLines = diff.newContent.split('\n');

  return (
    <div className="text-xs font-mono">
      {oldLines.map((line, i) => (
        <div
          key={`old-${i}`}
          className="bg-red-900 bg-opacity-20 border-l-2 border-red-500 pl-2 py-0.5"
        >
          <span className="opacity-50 mr-3">-</span>
          {line}
        </div>
      ))}
      {newLines.map((line, i) => (
        <div
          key={`new-${i}`}
          className="bg-green-900 bg-opacity-20 border-l-2 border-green-500 pl-2 py-0.5"
        >
          <span className="opacity-50 mr-3">+</span>
          {line}
        </div>
      ))}
    </div>
  );
}

export default DiffView;
