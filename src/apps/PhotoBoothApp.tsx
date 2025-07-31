import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../utils/hooks';

const PhotoBoothApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [countdown, setCountdown] = useState(0);
  const { playSound } = useSound();

  const filters = [
    { id: 'none', name: 'Normal', css: '' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
    { id: 'grayscale', name: 'B&W', css: 'grayscale(100%)' },
    { id: 'invert', name: 'Invert', css: 'invert(100%)' },
    { id: 'blur', name: 'Blur', css: 'blur(3px)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(1.2) brightness(1.1)' },
  ];

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      playSound('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply filter
    ctx.filter = filters.find(f => f.id === selectedFilter)?.css || 'none';
    ctx.drawImage(video, 0, 0);

    // Convert to data URL and save
    const dataURL = canvas.toDataURL('image/png');
    setPhotos(prev => [dataURL, ...prev.slice(0, 8)]); // Keep last 9 photos
    
    playSound('open');
  };

  const startCountdown = () => {
    setCountdown(3);
    playSound('click');
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(capturePhoto, 100);
          return 0;
        }
        playSound('hover');
        return prev - 1;
      });
    }, 1000);
  };

  const downloadPhoto = (dataURL: string, index: number) => {
    const link = document.createElement('a');
    link.download = `photo-booth-${Date.now()}-${index}.png`;
    link.href = dataURL;
    link.click();
    playSound('open');
  };

  const deletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    playSound('close');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-100 to-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">📸 Photo Booth</h1>
      </div>

      <div className="flex flex-1">
        {/* Camera view */}
        <div className="flex-1 p-4">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg h-full">
            {isStreaming ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: filters.find(f => f.id === selectedFilter)?.css || 'none',
                    transform: 'scaleX(-1)' // Mirror effect
                  }}
                />
                
                {/* Countdown overlay */}
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-9xl font-bold animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}
                
                {/* Controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                  <button
                    className="w-16 h-16 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-2xl"
                    onClick={startCountdown}
                    disabled={countdown > 0}
                  >
                    📷
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    onClick={capturePhoto}
                  >
                    Instant
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-lg mb-4">Camera not available</p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={startCamera}
                  >
                    Enable Camera
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 bg-white/30 border-l border-pink-200">
          {/* Filters */}
          <div className="mb-6">
            <h3 className="font-bold text-pink-800 mb-3">Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`p-2 rounded text-sm transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/50 text-pink-800 hover:bg-white/70'
                  }`}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    playSound('click');
                  }}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Photo gallery */}
          <div>
            <h3 className="font-bold text-pink-800 mb-3">Recent Photos ({photos.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {photos.length === 0 ? (
                <div className="text-center text-pink-600 py-8">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">No photos yet</p>
                </div>
              ) : (
                photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border-2 border-white shadow"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        onClick={() => downloadPhoto(photo, index)}
                      >
                        💾
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        onClick={() => deletePhoto(index)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBoothApp;