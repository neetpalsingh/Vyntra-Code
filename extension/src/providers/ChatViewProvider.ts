import * as vscode from 'vscode';
import * as path from 'path';
import { BackendService } from '../services/BackendService';
import { WorkspaceService } from '../services/WorkspaceService';
import { Message, MessageRole } from '@vyntra/shared';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'vyntra.chatView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _backendService: BackendService,
    private readonly _workspaceService: WorkspaceService
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'dist'),
        vscode.Uri.joinPath(this._extensionUri, '../webview/dist'),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage':
          await this._handleSendMessage(data.message);
          break;
        case 'runAgent':
          await this._handleRunAgent(data.task);
          break;
        case 'getSettings':
          await this._handleGetSettings();
          break;
        case 'updateSettings':
          await this._handleUpdateSettings(data.settings);
          break;
      }
    });
  }

  public async sendMessage(content: string) {
    await this._handleSendMessage(content);
  }

  public async sendAgentTask(task: string) {
    await this._handleRunAgent(task);
  }

  private async _handleSendMessage(content: string) {
    try {
      const workspaceContext = await this._workspaceService.getWorkspaceContext();

      const message: Message = {
        id: Date.now().toString(),
        role: MessageRole.USER,
        content,
        timestamp: Date.now(),
      };

      this._view?.webview.postMessage({
        type: 'message',
        message,
      });

      await this._backendService.sendChatMessage(
        [message],
        workspaceContext,
        (chunk: string) => {
          this._view?.webview.postMessage({
            type: 'streamChunk',
            chunk,
          });
        }
      );

      this._view?.webview.postMessage({
        type: 'streamEnd',
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error}`);
    }
  }

  private async _handleRunAgent(task: string) {
    try {
      const workspaceContext = await this._workspaceService.getWorkspaceContext();

      this._view?.webview.postMessage({
        type: 'agentStart',
        task,
      });

      const response = await this._backendService.runAgent(task, workspaceContext);

      this._view?.webview.postMessage({
        type: 'agentComplete',
        response,
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Agent error: ${error}`);
    }
  }

  private async _handleGetSettings() {
    const config = vscode.workspace.getConfiguration('vyntra');
    const settings = {
      defaultProvider: config.get('defaultProvider', 'openai'),
      defaultModel: config.get('defaultModel', 'gpt-4-turbo-preview'),
      ragEnabled: config.get('ragEnabled', false),
      temperature: config.get('temperature', 0.7),
      maxTokens: config.get('maxTokens', 2000),
    };

    this._view?.webview.postMessage({ type: 'settings', settings });
  }

  private async _handleUpdateSettings(settings: any) {
    const config = vscode.workspace.getConfiguration('vyntra');
    await config.update('defaultProvider', settings.defaultProvider, true);
    await config.update('defaultModel', settings.defaultModel, true);
    await config.update('ragEnabled', settings.ragEnabled, true);
    await config.update('temperature', settings.temperature, true);
    await config.update('maxTokens', settings.maxTokens, true);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const webviewDistPath = vscode.Uri.joinPath(this._extensionUri, '../webview/dist');
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(webviewDistPath, 'assets/main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(webviewDistPath, 'assets/main.css')
    );

    const nonce = this._getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
      <link href="${styleUri}" rel="stylesheet">
      <title>Vyntra Chat</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  private _getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
