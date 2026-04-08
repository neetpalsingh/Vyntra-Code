import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import {
  Message,
  MessageRole,
  ChatResponse,
  WorkspaceContext,
  AgentResponse,
  ModelConfig,
  Provider,
} from '@vyntra/shared';

export class BackendService {
  private client: AxiosInstance;

  constructor() {
    const config = vscode.workspace.getConfiguration('vyntra');
    const backendUrl = config.get<string>('backendUrl', 'http://localhost:8000');

    this.client = axios.create({
      baseURL: backendUrl,
      timeout: 60000,
    });
  }

  async sendChatMessage(
    messages: Message[],
    workspaceContext?: WorkspaceContext,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    const config = vscode.workspace.getConfiguration('vyntra');
    const defaultProvider = config.get<Provider>('defaultProvider', Provider.OPENAI);

    const modelConfig: ModelConfig = {
      provider: defaultProvider,
      model: this._getDefaultModel(defaultProvider),
      temperature: config.get('temperature', 0.7),
      maxTokens: config.get('maxTokens', 2000),
    };

    if (onChunk) {
      return await this._sendStreamingMessage(messages, modelConfig, workspaceContext, onChunk);
    }

    const response = await this.client.post<ChatResponse>('/api/chat', {
      messages,
      modelConfig,
      workspaceContext,
      stream: false,
    });

    return response.data;
  }

  private async _sendStreamingMessage(
    messages: Message[],
    modelConfig: ModelConfig,
    workspaceContext: WorkspaceContext | undefined,
    onChunk: (chunk: string) => void
  ): Promise<ChatResponse> {
    const response = await this.client.post('/api/chat', {
      messages,
      modelConfig,
      workspaceContext,
      stream: true,
    }, {
      responseType: 'stream',
    });

    let fullContent = '';

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              resolve({
                message: {
                  id: Date.now().toString(),
                  role: MessageRole.ASSISTANT,
                  content: fullContent,
                  timestamp: Date.now(),
                  model: modelConfig.model,
                  provider: modelConfig.provider,
                },
              });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                onChunk(parsed.content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      });

      response.data.on('error', reject);
    });
  }

  async runAgent(task: string, workspaceContext: WorkspaceContext): Promise<AgentResponse> {
    const config = vscode.workspace.getConfiguration('vyntra');
    const defaultProvider = config.get<Provider>('defaultProvider', Provider.OPENAI);

    const modelConfig: ModelConfig = {
      provider: defaultProvider,
      model: this._getDefaultModel(defaultProvider),
    };

    const response = await this.client.post<AgentResponse>('/api/agent/run', {
      task,
      workspaceContext,
      modelConfig,
    });

    return response.data;
  }

  async searchWorkspace(query: string, workspaceRoot: string) {
    const response = await this.client.post('/api/workspace/search', {
      query,
      workspaceRoot,
      limit: 10,
    });

    return response.data;
  }

  private _getDefaultModel(provider: Provider): string {
    const modelMap: Record<Provider, string> = {
      [Provider.OPENAI]: 'gpt-4-turbo-preview',
      [Provider.ANTHROPIC]: 'claude-3-opus-20240229',
      [Provider.GEMINI]: 'gemini-pro',
      [Provider.GROQ]: 'mixtral-8x7b-32768',
      [Provider.OPENROUTER]: 'openai/gpt-4-turbo-preview',
      [Provider.OLLAMA]: 'llama2',
    };

    return modelMap[provider];
  }
}
