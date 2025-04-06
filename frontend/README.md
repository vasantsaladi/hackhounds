# Page2Pixel Frontend

The frontend of Page2Pixel is a Chrome extension built with WXT (Web Extension Tools) and React that provides a seamless interface for transforming webpage content into AI-generated images.

## Architecture

### Core Components

- **Popup**: The initial entry point that appears when clicking the extension icon
- **Sidepanel**: The main interface that displays processed content and generated images
- **Content Script**: Extracts text from the active webpage
- **Background Service**: Manages communication between components

## Features

- **Content Extraction**: Automatically extracts text from the current webpage
- **Streamlined Processing**: Sends content directly to the backend for processing
- **Interactive UI**: 
  - Loading animations and progress indicators
  - Visual hierarchy with clear content and image sections
  - Fullscreen image viewer
  - Error handling with visual feedback

## Tech Stack

- **Framework**: WXT (Web Extension Tools)
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **API Communication**: Fetch API for backend requests
- **Browser Integration**: Chrome Extension API
  - `chrome.tabs` for tab management
  - `chrome.sidePanel` for sidepanel functionality

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Key Files

- `entrypoints/popup/App.tsx`: Popup interface component
- `entrypoints/sidepanel/App.tsx`: Main sidepanel interface
- `entrypoints/background.ts`: Background service worker
- `entrypoints/content-scripts/content.ts`: Webpage content extraction
- `wxt.config.ts`: Extension configuration

## UI Design

The interface features a clean, modern design with:

- Blue and green color theme for a professional look
- Clear visual hierarchy separating content and generated images
- Loading animations and progress indicators
- Responsive layout that adapts to the sidepanel dimensions
- "AI Generated" badge on images for clear attribution
