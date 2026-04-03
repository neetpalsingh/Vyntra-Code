export enum Provider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  GROQ = 'groq',
  OPENROUTER = 'openrouter',
  OLLAMA = 'ollama',
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool',
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  model?: string;
  provider?: Provider;
}

export interface ModelConfig {
  provider: Provider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatRequest {
  messages: Message[];
  modelConfig: ModelConfig;
  workspaceContext?: WorkspaceContext;
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface WorkspaceContext {
  currentFile?: FileContext;
  selectedCode?: string;
  relatedFiles?: FileContext[];
  workspaceRoot?: string;
}

export interface FileContext {
  path: string;
  content: string;
  language?: string;
  startLine?: number;
  endLine?: number;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  result: string;
  error?: string;
}

export enum ToolName {
  READ_FILE = 'read_file',
  WRITE_FILE = 'write_file',
  SEARCH_FILES = 'search_files',
  RUN_TERMINAL = 'run_terminal',
  GIT_DIFF = 'git_diff',
  GIT_COMMIT = 'git_commit',
}

export interface AgentRequest {
  task: string;
  workspaceContext: WorkspaceContext;
  modelConfig: ModelConfig;
}

export interface AgentResponse {
  result: string;
  steps: AgentStep[];
  toolCalls: ToolCall[];
}

export interface AgentStep {
  thought: string;
  action?: ToolCall;
  observation?: string;
}

export interface Settings {
  providers: Record<Provider, ProviderSettings>;
  defaultProvider: Provider;
  defaultModel: string;
  ragEnabled: boolean;
  qdrantUrl?: string;
}

export interface ProviderSettings {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  models: string[];
}

export interface SearchResult {
  path: string;
  content: string;
  score: number;
  lineNumber?: number;
}

export interface VectorSearchRequest {
  query: string;
  limit?: number;
  workspaceRoot: string;
}

export interface VectorSearchResponse {
  results: SearchResult[];
}
