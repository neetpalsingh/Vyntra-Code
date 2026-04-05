import * as vscode from 'vscode';
import { ChatViewProvider } from './providers/ChatViewProvider';
import { WorkspaceService } from './services/WorkspaceService';
import { BackendService } from './services/BackendService';

export function activate(context: vscode.ExtensionContext) {
  console.log('Vyntra Code extension activated');

  const workspaceService = new WorkspaceService();
  const backendService = new BackendService();
  const chatViewProvider = new ChatViewProvider(context.extensionUri, backendService, workspaceService);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatViewProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vyntra.openChat', () => {
      vscode.commands.executeCommand('vyntra.chatView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vyntra.explainCode', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage('No code selected');
        return;
      }

      await chatViewProvider.sendMessage(`Explain this code:\n\n${selectedText}`);
      vscode.commands.executeCommand('vyntra.chatView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vyntra.refactorCode', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage('No code selected');
        return;
      }

      await chatViewProvider.sendMessage(`Refactor this code to improve quality:\n\n${selectedText}`);
      vscode.commands.executeCommand('vyntra.chatView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vyntra.generateTests', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage('No code selected');
        return;
      }

      await chatViewProvider.sendMessage(`Generate unit tests for:\n\n${selectedText}`);
      vscode.commands.executeCommand('vyntra.chatView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vyntra.runAgent', async () => {
      const task = await vscode.window.showInputBox({
        prompt: 'Enter task for the agent',
        placeHolder: 'e.g., Create a new API endpoint for user management',
      });

      if (task) {
        await chatViewProvider.sendAgentTask(task);
        vscode.commands.executeCommand('vyntra.chatView.focus');
      }
    })
  );
}

export function deactivate() {
  console.log('Vyntra Code extension deactivated');
}
