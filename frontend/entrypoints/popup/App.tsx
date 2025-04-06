import { useState } from "react";

function App() {
  const openSidepanel = () => {
    // Open the sidepanel
    browser.sidePanel.open();
    // Close the popup
    window.close();
  };

  return (
    <div className="p-4 w-64 bg-white">
      <div className="flex items-center justify-center mb-3">
        <img src="/origami.svg" alt="Icon" className="h-5 w-5 mr-2" />
        <h1 className="text-base font-bold text-gray-800">Page2Pixel</h1>
      </div>

      <p className="text-xs text-gray-600 mb-4 text-center">
        Transform webpage content into AI-generated images
      </p>

      <div className="flex justify-center">
        <button
          onClick={openSidepanel}
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:from-green-500 hover:to-blue-500 text-xs font-medium shadow-sm transition-all flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Open Sidepanel
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
            1
          </div>
          <p>Open the sidepanel</p>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
            2
          </div>
          <p>Click "Generate Image"</p>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
            3
          </div>
          <p>View your AI-generated image</p>
        </div>
      </div>
    </div>
  );
}

export default App;
