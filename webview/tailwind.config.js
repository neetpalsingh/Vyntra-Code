/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vscode: {
          foreground: 'var(--vscode-foreground)',
          background: 'var(--vscode-editor-background)',
          input: {
            bg: 'var(--vscode-input-background)',
            fg: 'var(--vscode-input-foreground)',
            border: 'var(--vscode-input-border)',
          },
          button: {
            bg: 'var(--vscode-button-background)',
            fg: 'var(--vscode-button-foreground)',
            hover: 'var(--vscode-button-hoverBackground)',
          },
          list: {
            hover: 'var(--vscode-list-hoverBackground)',
            active: 'var(--vscode-list-activeSelectionBackground)',
          },
        },
      },
    },
  },
  plugins: [],
};
