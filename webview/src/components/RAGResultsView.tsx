import { useState } from 'react';
import { Search, FileCode, TrendingUp, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';

interface RAGResult {
  path: string;
  content: string;
  score: number;
  lineNumber?: number;
  language?: string;
}

interface RAGResultsViewProps {
  query: string;
  results: RAGResult[];
  onSelectResult: (result: RAGResult) => void;
}

function RAGResultsView({ query, results, onSelectResult }: RAGResultsViewProps) {
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set([0]));

  const toggleResult = (index: number) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreWidth = (score: number) => `${score * 100}%`;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-vscode-input-border">
        <div className="flex items-center gap-2 mb-2">
          <Search size={18} />
          <h3 className="text-sm font-semibold">Semantic Search Results</h3>
        </div>
        <div className="text-xs opacity-70 bg-vscode-input-bg p-2 rounded">
          Query: <span className="font-semibold">{query}</span>
        </div>
        <div className="text-xs opacity-70 mt-2">
          Found {results.length} relevant code snippet(s)
        </div>
      </div>

      <div className="flex-1 overflow-y-auto vscode-scrollable">
        {results.map((result, index) => {
          const isExpanded = expandedResults.has(index);

          return (
            <div
              key={index}
              className="border-b border-vscode-input-border hover:bg-vscode-list-hover"
            >
              <div
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => toggleResult(index)}
              >
                <div className="flex-shrink-0 mt-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode size={14} />
                    <span className="text-sm font-mono truncate">{result.path}</span>
                    {result.lineNumber && (
                      <span className="text-xs opacity-50">:{result.lineNumber}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className={getScoreColor(result.score)} />
                      <span className={clsx('text-xs font-semibold', getScoreColor(result.score))}>
                        {(result.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex-1 h-1.5 bg-vscode-input-bg rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full', {
                          'bg-green-500': result.score >= 0.8,
                          'bg-yellow-500': result.score >= 0.6 && result.score < 0.8,
                          'bg-orange-500': result.score < 0.6,
                        })}
                        style={{ width: getScoreWidth(result.score) }}
                      />
                    </div>
                  </div>

                  {!isExpanded && (
                    <div className="text-xs opacity-70 line-clamp-2 font-mono">
                      {result.content.substring(0, 150)}...
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectResult(result);
                  }}
                  className="flex-shrink-0 p-2 rounded hover:bg-vscode-button-bg"
                  title="Add to context"
                >
                  <Copy size={14} />
                </button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pl-12">
                  <Highlight
                    theme={themes.vsDark}
                    code={result.content}
                    language={result.language || 'typescript'}
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={clsx(className, 'text-xs p-3 rounded')} style={style}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            <span className="inline-block w-8 text-right mr-3 opacity-50">
                              {(result.lineNumber || 1) + i}
                            </span>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onSelectResult(result)}
                      className="px-3 py-1.5 text-xs rounded bg-vscode-button-bg hover:bg-vscode-button-hover text-vscode-button-fg"
                    >
                      Add to Context
                    </button>
                    <button
                      onClick={() => {
                        /* Open file in editor */
                      }}
                      className="px-3 py-1.5 text-xs rounded bg-vscode-input-bg hover:bg-vscode-list-hover"
                    >
                      Open File
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Search size={48} className="mx-auto opacity-50 mb-4" />
            <p className="text-sm opacity-70">No results found</p>
            <p className="text-xs opacity-50 mt-2">Try a different search query</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RAGResultsView;
