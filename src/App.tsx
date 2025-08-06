import { Suspense } from "react";
import { Desktop } from "./components/Desktop";
import { CursorManager } from "./components/CursorManager";

function App() {
  return (
    <div className="w-full h-full font-mono">
      <CursorManager />
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-vercel-dark-bg">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🖥️</div>
              <div className="text-vercel-dark-text text-xl font-bold">
                Loading miOS...
              </div>
              <div className="text-vercel-dark-text-secondary text-sm mt-2">
                Initializing system components
              </div>
            </div>
          </div>
        }
      >
        <Desktop />
      </Suspense>
    </div>
  );
}

export default App;
