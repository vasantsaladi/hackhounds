import { useState, useEffect } from "react";

// Add animation keyframes
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [textLength, setTextLength] = useState(0);
  const [processedContent, setProcessedContent] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset success animation when needed
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        // Keep success state but remove animation after 2 seconds
        document.getElementById('success-message')?.classList.remove('animate-pulse');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Simulate progress during loading
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (success) {
      setProgress(100);
    }
  }, [loading, success]);

  const handleExtractAndProcess = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setProcessedContent(null);
    setImageUrl("");
    setProgress(0);
    setProcessingStep("Extracting text...");

    try {
      // Get the active tab
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        setError("No active tab found");
        setLoading(false);
        return;
      }

      // Extract content from the page
      console.log("Sending GET_CONTENT message to tab:", tab.id);
      try {
        const content = await browser.tabs.sendMessage(tab.id, {
          action: "GET_CONTENT",
        });

        if (content?.error) {
          setError(content.error);
          setLoading(false);
          return;
        }

        setTextLength(content.text.length);

        // Call the chain endpoint directly with the extracted content
        setProcessingStep("Processing and generating image...");
        const chainResponse = await fetch("http://localhost:8000/api/chain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: content.text,
            url: content.url,
            title: content.title,
          }),
        });

        if (!chainResponse.ok) {
          throw new Error("Failed to process content and generate image");
        }

        const chainResult = await chainResponse.json();

        if (chainResult.error) {
          throw new Error(chainResult.error);
        }

        console.log("Chain result:", chainResult);

        // Store the processed content
        setProcessedContent(chainResult.processed_content);
        // Store the image URL separately
        setImageUrl(chainResult.image.image_url);
        setSuccess(true);
        // Add a success message
        setProcessingStep("Image successfully generated!");
      } catch (err) {
        console.error("Content script error:", err);
        setError(
          err.message ||
            "Could not communicate with the page. Try reloading the extension."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to extract and process content");
    } finally {
      setLoading(false);
      setProcessingStep("");
    }
  };

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      <style>{keyframes}</style>
      <div className="flex justify-center items-center mb-4">
        <img src="/origami.svg" alt="Icon" className="h-5 w-5 mr-2" />
        <h1 className="text-base font-bold text-gray-800">Page2Pixel</h1>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleExtractAndProcess}
          disabled={loading}
          className={`px-6 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:from-green-500 hover:to-blue-500 text-sm font-medium shadow-sm transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {processingStep}
            </div>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Generate Image
            </div>
          )}
        </button>
      </div>
      
      {/* Progress bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      


      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mt-4 border border-red-200 flex items-center" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Display the processed content */}
      {processedContent && (
        <div className="mt-6 bg-white p-5 rounded-md shadow-sm border border-gray-200 transition-all duration-300" style={{ animation: 'slideUp 0.5s ease-out' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {processedContent.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {processedContent.description}
          </p>
        </div>
      )}

      {/* Divider between content and image */}
      {processedContent && imageUrl && (
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <div className="mx-4 text-xs text-gray-500 uppercase tracking-wider font-medium">Generated Image</div>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
      )}

      {/* Display the image loading skeleton */}
      {loading && !imageUrl && (
        <div className="mt-6 bg-white p-5 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Image Loading...</h3>
          <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50 aspect-video animate-pulse" style={{animation: 'pulse 1.5s infinite'}}>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Display the image in a separate box */}
      {imageUrl && (
        <div className="mt-6 bg-white p-5 rounded-md shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md" style={{ animation: 'slideUp 0.7s ease-out' }}>
          <div
            onClick={toggleFullScreen}
            className="cursor-pointer relative overflow-hidden rounded-md border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10 opacity-80">
              AI Generated
            </div>
            <img
              src={imageUrl}
              alt={processedContent?.title || "Generated image"}
              className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            />
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full flex items-center transition-opacity duration-200 hover:bg-opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              Click to expand
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image viewer */}
      {showFullScreen && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={toggleFullScreen}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <img
              src={imageUrl}
              alt={processedContent?.title || "Generated image"}
              className="max-w-full max-h-[90vh] object-contain"
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
              }}
            />
            <button
              className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
              onClick={toggleFullScreen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
