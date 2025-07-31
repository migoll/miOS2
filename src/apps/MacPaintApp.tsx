import React, { useRef, useState, useEffect } from 'react';
import { useSound } from '../utils/hooks';

const MacPaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const { playSound } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
    playSound('click');
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (isDrawing) {
      playSound('drop');
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playSound('click');
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'macpaint-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
    playSound('open');
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF',
    '#808080', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#C0C0C0'
  ];

  return (
    <div className="flex flex-col h-full bg-aqua-background">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-3 border-b border-aqua-border bg-white/30">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded transition-colors ${
              tool === 'brush' ? 'bg-aqua-blue text-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => {
              setTool('brush');
              playSound('click');
            }}
          >
            🖌️
          </button>
          <button
            className={`p-2 rounded transition-colors ${
              tool === 'eraser' ? 'bg-aqua-blue text-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => {
              setTool('eraser');
              playSound('click');
            }}
          >
            🧹
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-aqua-text">Size:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-aqua-text w-8">{brushSize}</span>
        </div>

        {/* Color palette */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded border-2 ${
                color === c ? 'border-aqua-blue' : 'border-aqua-border'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                playSound('click');
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="px-3 py-1 bg-aqua-warning text-white rounded text-sm hover:bg-orange-600 transition-colors"
            onClick={clearCanvas}
          >
            🗑️ Clear
          </button>
          <button
            className="px-3 py-1 bg-aqua-accent text-white rounded text-sm hover:bg-green-600 transition-colors"
            onClick={saveImage}
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-4 bg-white/10">
        <div className="w-full h-full bg-white rounded-lg shadow-aqua overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};

export default MacPaintApp;