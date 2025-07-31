import React, { Suspense } from 'react';
import { Desktop } from './components/Desktop';

function App() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-aqua-background">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🖥️</div>
            <div className="text-aqua-text text-xl font-bold">Loading miOS...</div>
            <div className="text-aqua-secondary text-sm mt-2">Initializing system components</div>
          </div>
        </div>
      }>
        <Desktop />
      </Suspense>
    </div>
  );
}

export default App;