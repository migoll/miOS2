import React, { useState } from 'react';
import { useSound } from '../utils/hooks';

const VideosApp: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState('');
  const [playlist] = useState([
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley' },
    { id: 'oVK0qlm8wpw', title: 'RetroWave Mix', artist: 'Various Artists' },
    { id: 'HgzGwKwLmgM', title: 'Synthwave Goose', artist: 'NewRetroWave' },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSound } = useSound();

  const playVideo = (videoId: string) => {
    setCurrentVideo(videoId);
    setIsPlaying(true);
    playSound('open');
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    playSound('click');
  };

  const stopVideo = () => {
    setCurrentVideo('');
    setIsPlaying(false);
    playSound('close');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900">
      {/* VCR-style header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 border-b-2 border-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono text-sm">REC</span>
            <span className="text-white font-bold text-lg">📺 miOS Videos</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
              onClick={() => playSound('click')}
            >
              ⏮️
            </button>
            <button
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
              onClick={isPlaying ? pauseVideo : () => {}}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
              onClick={stopVideo}
            >
              ⏹️
            </button>
            <button
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
              onClick={() => playSound('click')}
            >
              ⏭️
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Video player */}
        <div className="flex-1 p-4">
          <div className="w-full h-full bg-black rounded-lg overflow-hidden shadow-lg border-4 border-gray-600">
            {currentVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&modestbranding=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📺</div>
                  <h3 className="text-2xl font-bold mb-2">Select a video to play</h3>
                  <p className="text-blue-200">Choose from the playlist on the right</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="w-80 p-4 bg-gray-800 border-l border-gray-600">
          <h3 className="text-white font-bold mb-4 text-lg">📋 Playlist</h3>
          
          <div className="space-y-2">
            {playlist.map((video) => (
              <div
                key={video.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-150
                  ${currentVideo === video.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }
                `}
                onClick={() => playVideo(video.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {currentVideo === video.id && isPlaying ? '🔊' : '📹'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{video.title}</div>
                    <div className="text-sm opacity-75 truncate">{video.artist}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Add Video</h4>
            <input
              type="text"
              placeholder="YouTube URL or Video ID"
              className="w-full p-2 bg-gray-600 text-white rounded text-sm placeholder-gray-400"
            />
            <button className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              Add to Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosApp;