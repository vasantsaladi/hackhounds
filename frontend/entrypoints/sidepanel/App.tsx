import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [textLength, setTextLength] = useState(0);

  const handleExtractAndSend = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

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

      // Check if we can access the tab
      if (
        !tab.url ||
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://")
      ) {
        setError(
          "Cannot extract content from this page. Try a regular website like wikipedia.org"
        );
        setLoading(false);
        return;
      }

      try {
        // Extract content from the page
        console.log("Sending GET_CONTENT message to tab:", tab.id);
        const content = await browser.tabs.sendMessage(tab.id, {
          action: "GET_CONTENT",
        });

        if (content?.error) {
          setError(content.error);
          setLoading(false);
          return;
        }

        // Send to backend
        const response = await fetch(
          "http://localhost:8000/api/store-content",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: content.text,
              url: content.url,
              title: content.title,
            }),
          }
        );

        if (response.ok) {
          setSuccess(true);
          setTextLength(content.text.length);
        } else {
          setError("Failed to send to backend");
        }
      } catch (err) {
        console.error("Content script error:", err);
        setError(
          "Could not communicate with the page. Make sure you're on a regular website and reload the extension."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to extract and send text");
    } finally {
      setLoading(false);
    }
  };

  // For direct testing without content script
  const handleDirectTest = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Send sample data directly to backend
      const response = await fetch("http://localhost:8000/api/store-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "This is a test message sent directly from the extension without using content script.",
          url: "https://test.example.com",
          title: "Test Page",
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTextLength(76); // Length of the test message
      } else {
        setError("Failed to send test data to backend");
      }
    } catch (err) {
      setError(err.message || "Failed to send test data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">HackHounds Content Extractor</h1>

      <div className="space-y-4">
        <button
          onClick={handleExtractAndSend}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Extract & Store Content"}
        </button>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">
            Having trouble? Try the direct test button:
          </p>
          <button
            onClick={handleDirectTest}
            disabled={loading}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Send Test Data Directly
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mt-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mt-4">
          <p>Successfully stored {textLength} characters for processing!</p>
          <p className="text-sm mt-2">
            View the stored content at{" "}
            <a
              href="http://localhost:8000/docs#/default/get_last_content_api_last_content_get"
              target="_blank"
              className="underline"
            >
              FastAPI docs
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
