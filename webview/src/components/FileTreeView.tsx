import { useState } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileText,
  FileJson,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeViewProps {
  tree: FileNode[];
  selectedFiles: Set<string>;
  onSelectFile: (path: string) => void;
  onToggleFile: (path: string) => void;
}

function FileTreeView({ tree, selectedFiles, onSelectFile, onToggleFile }: FileTreeViewProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
      case 'py':
      case 'java':
      case 'go':
      case 'rs':
        return <FileCode size={14} />;
      case 'json':
        return <FileJson size={14} />;
      case 'md':
      case 'txt':
        return <FileText size={14} />;
      default:
        return <File size={14} />;
    }
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedDirs.has(node.path);
    const isSelected = selectedFiles.has(node.path);

    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          <div
            className={clsx(
              'flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-vscode-list-hover',
              isSelected && 'bg-vscode-list-active'
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => toggleDir(node.path)}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />}
            <span className="text-sm truncate">{node.name}</span>
          </div>
          {isExpanded &&
            node.children?.map((child) => renderNode(child, level + 1))}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={clsx(
          'flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-vscode-list-hover group',
          isSelected && 'bg-vscode-list-active'
        )}
        style={{ paddingLeft: `${level * 12 + 24}px` }}
        onClick={() => onSelectFile(node.path)}
      >
        {getFileIcon(node.name)}
        <span className="text-sm truncate flex-1">{node.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFile(node.path);
          }}
          className={clsx(
            'p-1 rounded opacity-0 group-hover:opacity-100',
            isSelected ? 'bg-green-600' : 'bg-vscode-button-bg hover:bg-vscode-button-hover'
          )}
          title={isSelected ? 'Remove from context' : 'Add to context'}
        >
          <Plus size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-vscode-input-border">
        <h3 className="text-sm font-semibold">Workspace Files</h3>
        <p className="text-xs opacity-70 mt-1">
          Click files to view, + to add to context
        </p>
      </div>
      <div className="flex-1 overflow-y-auto vscode-scrollable">
        {tree.map((node) => renderNode(node))}
      </div>
      <div className="p-3 border-t border-vscode-input-border text-xs opacity-70">
        {selectedFiles.size} file(s) in context
      </div>
    </div>
  );
}

export default FileTreeView;
