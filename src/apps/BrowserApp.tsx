import React, { useState } from "react";
import { useSound } from "../utils/hooks";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

const BrowserApp: React.FC = () => {
  const { playSound } = useSound();
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual portfolio project bookmarks
  const bookmarks: Bookmark[] = [
    {
      id: "1",
      title: "Project 1 - Web App",
      url: "https://your-project-1.com",
      description: "A full-stack web application built with React and Node.js",
      category: "Web Development",
    },
    {
      id: "2",
      title: "Project 2 - Mobile App",
      url: "https://your-project-2.com",
      description: "Cross-platform mobile app using React Native",
      category: "Mobile Development",
    },
    {
      id: "3",
      title: "Project 3 - Design System",
      url: "https://your-project-3.com",
      description: "Comprehensive design system and component library",
      category: "Design",
    },
    {
      id: "4",
      title: "GitHub Portfolio",
      url: "https://github.com/yourusername",
      description: "My open source projects and contributions",
      category: "Code",
    },
  ];

  const categories = [...new Set(bookmarks.map((b) => b.category))];

  const navigateToUrl = (url: string) => {
    playSound("click");
    setIsLoading(true);
    setCurrentUrl(url);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).url as HTMLInputElement;
    if (input.value) {
      navigateToUrl(input.value);
    }
  };

  const openInNewWindow = (url: string) => {
    playSound("open");
    window.open(url, "_blank");
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Browser Header */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <input
              type="text"
              name="url"
              placeholder="Enter URL or search..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                       rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={currentUrl}
            />
          </form>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex flex-wrap gap-2">
          {bookmarks.slice(0, 4).map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => navigateToUrl(bookmark.url)}
              onDoubleClick={() => openInNewWindow(bookmark.url)}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                       rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title={`Single click to preview, double click to open in new tab`}
            >
              {bookmark.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-850 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Portfolio Projects
          </h2>

          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {bookmarks
                  .filter((b) => b.category === category)
                  .map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                               hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                      onClick={() => navigateToUrl(bookmark.url)}
                    >
                      <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                        {bookmark.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {bookmark.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 dark:text-blue-400 truncate">
                          {bookmark.url}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInNewWindow(bookmark.url);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                   dark:hover:text-gray-200 ml-2"
                          title="Open in new tab"
                        >
                          ↗
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 dark:text-gray-400">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
                Loading...
              </div>
            </div>
          ) : currentUrl ? (
            <iframe
              src={currentUrl}
              className="w-full h-full border-0"
              title="Browser Content"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🌐</div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  Portfolio Browser
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Browse my portfolio projects and work. Click on any bookmark
                  to preview, or double-click to open in a new tab.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Quick Start:</strong>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Single click bookmarks to preview
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Double click to open in new tab
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Use the address bar to navigate anywhere
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
