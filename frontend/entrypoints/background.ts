export default defineBackground(() => {
  console.log("Background script loaded", { id: browser.runtime.id });

  // We don't need the background script for direct text extraction
  // The sidepanel now communicates directly with the content script
  // and sends data directly to the FastAPI backend
});
