import React, { useState } from 'react';
import { useSound } from '../utils/hooks';

const TextEditApp: React.FC = () => {
  const [content, setContent] = useState('# Welcome to TextEdit\n\nThis is a simple markdown editor with live preview.\n\n## Features\n- Real-time markdown rendering\n- Clean, minimal interface\n- Auto-save functionality (coming soon)\n\n**Start typing to see your markdown rendered on the right!**');
  const [showPreview, setShowPreview] = useState(true);
  const { playSound } = useSound();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    playSound('click');
  };

  // Simple markdown to HTML converter for demo purposes
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-aqua-text">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 text-aqua-text">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 text-aqua-text">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col h-full bg-aqua-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-aqua-border bg-white/30">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-aqua-blue text-white rounded text-sm hover:bg-aqua-dark transition-colors">
            📁 Open
          </button>
          <button className="px-3 py-1 bg-aqua-accent text-white rounded text-sm hover:bg-green-600 transition-colors">
            💾 Save
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded text-sm transition-colors ${
              showPreview 
                ? 'bg-aqua-blue text-white' 
                : 'bg-white/50 text-aqua-text hover:bg-white/70'
            }`}
            onClick={togglePreview}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex">
        {/* Text editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-aqua-border`}>
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full p-4 bg-white/20 text-aqua-text resize-none border-none outline-none font-mono text-sm leading-relaxed"
            placeholder="Start writing your markdown here..."
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          />
        </div>

        {/* Preview pane */}
        {showPreview && (
          <div className="w-1/2 p-4 bg-white/10 overflow-y-auto">
            <div
              className="prose prose-sm max-w-none text-aqua-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="p-2 border-t border-aqua-border bg-white/20 text-xs text-aqua-secondary flex justify-between">
        <span>Lines: {content.split('\n').length}</span>
        <span>Characters: {content.length}</span>
      </div>
    </div>
  );
};

export default TextEditApp;