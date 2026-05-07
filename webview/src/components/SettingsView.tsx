import { useState, useEffect } from 'react';
import { vscode } from '../vscode';
import { Save } from 'lucide-react';

interface Settings {
  defaultProvider: string;
  defaultModel: string;
  ragEnabled: boolean;
  temperature: number;
  maxTokens: number;
}

function SettingsView() {
  const [settings, setSettings] = useState<Settings>({
    defaultProvider: 'openai',
    defaultModel: 'gpt-4-turbo-preview',
    ragEnabled: false,
    temperature: 0.7,
    maxTokens: 2000,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    vscode.send('getSettings');
    vscode.on('settings', (data: { settings: Settings }) => {
      setSettings(data.settings);
    });
  }, []);

  const handleSave = () => {
    vscode.send('updateSettings', { settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto vscode-scrollable p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-sm opacity-70">
            Configure Vyntra to work the way you want
          </p>
        </div>

        <div className="space-y-4 border-t border-vscode-input-border pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Provider</label>
            <select
              value={settings.defaultProvider}
              onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value })}
              className="w-full px-3 py-2 rounded bg-vscode-input-bg text-vscode-input-fg border border-vscode-input-border focus:outline-none focus:ring-1 focus:ring-vscode-button-bg"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Google Gemini</option>
              <option value="groq">Groq</option>
              <option value="openrouter">OpenRouter</option>
              <option value="ollama">Ollama</option>
            </select>
            <p className="text-xs opacity-50 mt-1">
              Managed by free-claude-code proxy
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Model</label>
            <input
              type="text"
              value={settings.defaultModel}
              onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
              placeholder="gpt-4-turbo-preview"
              className="w-full px-3 py-2 rounded bg-vscode-input-bg text-vscode-input-fg border border-vscode-input-border focus:outline-none focus:ring-1 focus:ring-vscode-button-bg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ragEnabled}
                onChange={(e) => setSettings({ ...settings, ragEnabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Enable RAG (Semantic Search)</span>
            </label>
            <p className="text-xs opacity-50 mt-1 ml-6">
              Requires Qdrant running on localhost:6333
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                setSettings({ ...settings, temperature: parseFloat(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-50 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Tokens</label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) =>
                setSettings({ ...settings, maxTokens: parseInt(e.target.value) })
              }
              min="100"
              max="8000"
              className="w-full px-3 py-2 rounded bg-vscode-input-bg text-vscode-input-fg border border-vscode-input-border focus:outline-none focus:ring-1 focus:ring-vscode-button-bg"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-vscode-input-border pt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-vscode-button-bg hover:bg-vscode-button-hover text-vscode-button-fg flex items-center gap-2"
          >
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-500">Settings saved successfully</span>
          )}
        </div>

        <div className="border-t border-vscode-input-border pt-4 text-sm opacity-70">
          <h3 className="font-semibold mb-2">About</h3>
          <p>Vyntra Code v0.2.0</p>
          <p className="mt-1">
            AI-powered coding assistant with multi-provider support
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
