interface VSCodeAPI {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

declare global {
  interface Window {
    acquireVsCodeApi(): VSCodeAPI;
  }
}

class VSCodeMessenger {
  private vscode: VSCodeAPI;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.vscode = window.acquireVsCodeApi();
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    const { type, ...data } = event.data;
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  on(type: string, handler: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
  }

  off(type: string, handler: (data: any) => void) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  send(type: string, data?: any) {
    this.vscode.postMessage({ type, ...data });
  }

  getState() {
    return this.vscode.getState();
  }

  setState(state: any) {
    this.vscode.setState(state);
  }
}

export const vscode = new VSCodeMessenger();
