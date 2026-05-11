import { useState } from 'react';
import { Bot, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, Play } from 'lucide-react';
import clsx from 'clsx';

interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: string;
  error?: string;
  status: 'pending' | 'running' | 'success' | 'error';
  startTime?: number;
  endTime?: number;
}

interface AgentStep {
  id: string;
  thought: string;
  toolCalls: ToolCall[];
  observation?: string;
  status: 'pending' | 'running' | 'complete' | 'error';
}

interface AgentProgressViewProps {
  task: string;
  steps: AgentStep[];
  currentStep?: number;
  isRunning: boolean;
}

function AgentProgressView({ task, steps, currentStep, isRunning }: AgentProgressViewProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'complete':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <Play size={16} className="text-blue-500 animate-pulse" />;
      default:
        return <Clock size={16} className="opacity-50" />;
    }
  };

  const formatDuration = (start?: number, end?: number) => {
    if (!start) return '';
    const duration = (end || Date.now()) - start;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex flex-col h-full bg-vscode-background">
      <div className="flex items-center gap-2 p-4 border-b border-vscode-input-border">
        <Bot size={20} className={isRunning ? 'animate-pulse' : ''} />
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Agent Task</h3>
          <p className="text-xs opacity-70 mt-1">{task}</p>
        </div>
        {isRunning && (
          <div className="px-2 py-1 text-xs rounded bg-blue-600 text-white">Running...</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto vscode-scrollable p-4 space-y-3">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className={clsx(
                'border rounded-lg overflow-hidden',
                isCurrent ? 'border-blue-500' : 'border-vscode-input-border'
              )}
            >
              <div
                className="flex items-start gap-2 p-3 cursor-pointer hover:bg-vscode-list-hover"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div className="flex-shrink-0 mt-0.5">{getStatusIcon(step.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Step {index + 1}</div>
                  <div className="text-sm opacity-80 mt-1">{step.thought}</div>
                  {step.toolCalls.length > 0 && (
                    <div className="text-xs opacity-60 mt-2">
                      {step.toolCalls.length} tool call(s)
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-vscode-input-border bg-vscode-editor-background">
                  {step.toolCalls.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-3 border-b border-vscode-input-border last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tool.status)}
                          <span className="text-sm font-mono font-semibold">{tool.name}</span>
                        </div>
                        {tool.startTime && (
                          <span className="text-xs opacity-50">
                            {formatDuration(tool.startTime, tool.endTime)}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono bg-vscode-input-bg p-2 rounded mb-2">
                        <div className="opacity-70 mb-1">Arguments:</div>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(tool.arguments, null, 2)}
                        </pre>
                      </div>

                      {tool.result && (
                        <div className="text-xs font-mono bg-green-900 bg-opacity-20 p-2 rounded">
                          <div className="opacity-70 mb-1 text-green-400">Result:</div>
                          <pre className="whitespace-pre-wrap">{tool.result}</pre>
                        </div>
                      )}

                      {tool.error && (
                        <div className="text-xs font-mono bg-red-900 bg-opacity-20 p-2 rounded">
                          <div className="opacity-70 mb-1 text-red-400">Error:</div>
                          <pre className="whitespace-pre-wrap">{tool.error}</pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {step.observation && (
                    <div className="p-3 bg-vscode-input-bg">
                      <div className="text-xs opacity-70 mb-1">Observation:</div>
                      <div className="text-sm">{step.observation}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {steps.length === 0 && !isRunning && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Bot size={48} className="mx-auto opacity-50 mb-4" />
            <p className="text-sm opacity-70">No agent activity yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentProgressView;
