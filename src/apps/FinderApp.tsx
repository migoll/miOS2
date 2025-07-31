import React, { useState } from 'react';
import { useFileSystemStore } from '../stores/fileSystemStore';
import { useSound } from '../utils/hooks';

const FinderApp: React.FC = () => {
  const entities = useFileSystemStore((state) => state.entities);
  const getChildren = useFileSystemStore((state) => state.getChildren);
  const createEntity = useFileSystemStore((state) => state.createEntity);
  const { playSound } = useSound();
  
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const currentFolder = entities[currentFolderId];
  const children = getChildren(currentFolderId);
  const breadcrumbs = [];
  
  // Build breadcrumb path
  let pathFolder = currentFolder;
  while (pathFolder) {
    breadcrumbs.unshift(pathFolder);
    pathFolder = pathFolder.parentId ? entities[pathFolder.parentId] : null;
  }

  const handleItemDoubleClick = (itemId: string) => {
    const item = entities[itemId];
    if (item.type === 'folder') {
      setCurrentFolderId(itemId);
      playSound('open');
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    playSound('click');
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      createEntity({
        name,
        type: 'folder',
        parentId: currentFolderId,
        path: currentFolder.path === '/' ? `/${name}` : `${currentFolder.path}/${name}`,
      });
      playSound('open');
    }
  };

  const handleNewFile = () => {
    const name = prompt('Enter file name:');
    if (name) {
      createEntity({
        name,
        type: 'file',
        content: '',
        parentId: currentFolderId,
        path: currentFolder.path === '/' ? `/${name}` : `${currentFolder.path}/${name}`,
      });
      playSound('open');
    }
  };

  return (
    <div className="flex flex-col h-full bg-aqua-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-aqua-border bg-white/30">
        <button 
          className="px-3 py-1 bg-aqua-blue text-white rounded text-sm hover:bg-aqua-dark transition-colors"
          onClick={() => setCurrentFolderId(currentFolder.parentId || 'root')}
          disabled={currentFolderId === 'root'}
        >
          ← Back
        </button>
        <button 
          className="px-3 py-1 bg-aqua-accent text-white rounded text-sm hover:bg-green-600 transition-colors"
          onClick={handleNewFolder}
        >
          New Folder
        </button>
        <button 
          className="px-3 py-1 bg-aqua-accent text-white rounded text-sm hover:bg-green-600 transition-colors"
          onClick={handleNewFile}
        >
          New File
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="p-3 border-b border-aqua-border bg-white/20">
        <div className="flex items-center gap-2 text-sm text-aqua-text">
          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <button
                className="hover:text-aqua-blue transition-colors"
                onClick={() => {
                  setCurrentFolderId(folder.id);
                  playSound('click');
                }}
              >
                {folder.name}
              </button>
              {index < breadcrumbs.length - 1 && <span>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 p-3">
        {children.length === 0 ? (
          <div className="flex items-center justify-center h-full text-aqua-secondary">
            <div className="text-center">
              <div className="text-4xl mb-2">📁</div>
              <p>This folder is empty</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {children.map((item) => (
              <div
                key={item.id}
                className={`
                  flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-150
                  ${selectedItemId === item.id ? 'bg-aqua-blue/20 ring-2 ring-aqua-blue' : 'hover:bg-white/20'}
                `}
                onClick={() => handleItemClick(item.id)}
                onDoubleClick={() => handleItemDoubleClick(item.id)}
              >
                <div className="text-3xl mb-2">
                  {item.type === 'folder' ? '📁' : '📄'}
                </div>
                <span className="text-sm text-center text-aqua-text font-medium break-words">
                  {item.name}
                </span>
                <span className="text-xs text-aqua-secondary mt-1">
                  {item.updatedAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinderApp;