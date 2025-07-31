import React from 'react';

const PlaceholderApp: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-aqua-background to-white p-8">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🖥️</div>
        <h2 className="text-2xl font-bold text-aqua-text mb-2">
          Not yet...
        </h2>
        <p className="text-aqua-secondary text-sm max-w-md">
          This is a placeholder app to demonstrate the miOS window system. 
          Future apps will provide rich functionality within this same framework.
        </p>
        <div className="mt-6 flex justify-center">
          <div className="animate-bounce">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderApp;