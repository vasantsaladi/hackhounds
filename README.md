# Page2Pixel

Page2Pixel is a Chrome extension that transforms webpage content into informative, visually appealing images using AI. It extracts text from any webpage, processes it with GPT-4o, and generates a custom image with DALL-E 3 that represents the key concepts from the page.

## Features

- **One-Click Content Transformation**: Extract and process webpage content with a single click
- **AI-Powered Summaries**: Generate concise titles and descriptions that capture the essence of any webpage
- **Visual Knowledge Representation**: Transform text into balanced visual/informational images
- **Chrome Sidepanel Integration**: View generated content in a convenient sidepanel
- **Optimized Image Generation**: Perfect 50/50 balance of artistic quality and informational clarity

## Tech Stack

### Frontend
- **Framework**: WXT (Web Extension Tools) with React and TypeScript
- **UI**: Tailwind CSS for styling
- **State Management**: React hooks and context
- **Browser API**: Chrome Extension API for tab communication and sidepanel

### Backend
- **Framework**: FastAPI (Python)
- **AI Models**: 
  - OpenAI GPT-4o for text processing and prompt generation
  - DALL-E 3 for image generation
- **API**: RESTful endpoints for content processing and image generation
- **Environment**: Python 3.9+ with async support

## Project Structure

```
hackhounds/
├── frontend/           # Chrome extension code
│   ├── entrypoints/    # Extension entry points (popup, sidepanel)
│   ├── assets/         # Static assets
│   └── wxt.config.ts   # WXT configuration
├── backend/            # FastAPI server
│   ├── routers/        # API endpoint definitions
│   ├── services/       # Business logic (processing, generation)
│   └── main.py         # Application entry point
```

## Getting Started

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload
   ```
3. Set up the frontend:
   ```
   cd frontend
   pnpm install
   pnpm dev
   ```
4. Load the extension in Chrome from the `.output/chrome-mv3` directory

## License

[MIT License](LICENSE)
