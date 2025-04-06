export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    console.log("Content script loaded");

    // Listen for content requests
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "GET_CONTENT") {
        console.log("Content extraction requested");

        // Get selected text or full page content
        const selectedText = window.getSelection()?.toString().trim();
        const fullText = document.body.innerText.trim();

        // Basic validation - check if there's any content to process
        if (!fullText && !selectedText) {
          console.log("No text found on page");
          sendResponse({ error: "No text found on this page" });
          return true;
        }

        // Log text length for debugging
        const textToSend = selectedText || fullText;
        console.log(`Sending text content (${textToSend.length} characters)`);

        // Send response to requesting script
        sendResponse({
          text: textToSend,
          url: window.location.href,
          title: document.title || null,
        });
      }
      return true; // Keep channel open for async response
    });
  },
});
