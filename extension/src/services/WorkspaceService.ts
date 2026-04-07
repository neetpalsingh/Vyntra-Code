import * as vscode from 'vscode';
import { WorkspaceContext, FileContext } from '@vyntra/shared';

export class WorkspaceService {
  async getWorkspaceContext(): Promise<WorkspaceContext> {
    const context: WorkspaceContext = {
      workspaceRoot: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
    };

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      context.currentFile = await this._getFileContext(editor.document);

      const selection = editor.selection;
      if (!selection.isEmpty) {
        context.selectedCode = editor.document.getText(selection);
      }
    }

    return context;
  }

  async getFileContent(filePath: string): Promise<string> {
    const uri = vscode.Uri.file(filePath);
    const document = await vscode.workspace.openTextDocument(uri);
    return document.getText();
  }

  async writeFileContent(filePath: string, content: string): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    const edit = new vscode.WorkspaceEdit();
    
    const document = await vscode.workspace.openTextDocument(uri);
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    
    edit.replace(uri, fullRange, content);
    await vscode.workspace.applyEdit(edit);
  }

  async searchFiles(pattern: string): Promise<vscode.Uri[]> {
    return await vscode.workspace.findFiles(pattern);
  }

  private async _getFileContext(document: vscode.TextDocument): Promise<FileContext> {
    return {
      path: document.uri.fsPath,
      content: document.getText(),
      language: document.languageId,
    };
  }

  async getRelatedFiles(currentFile: string): Promise<FileContext[]> {
    const relatedFiles: FileContext[] = [];
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceRoot) {
      return relatedFiles;
    }

    const pattern = '**/*.{ts,js,py,java,go,rs,cpp,c,h}';
    const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 10);

    for (const file of files) {
      if (file.fsPath !== currentFile) {
        const document = await vscode.workspace.openTextDocument(file);
        relatedFiles.push({
          path: file.fsPath,
          content: document.getText(),
          language: document.languageId,
        });
      }
    }

    return relatedFiles;
  }
}
