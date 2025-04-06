# Page2Pixel Backend

The backend of Page2Pixel is a FastAPI server that processes webpage content and generates informative, visually appealing images using AI models.

## Architecture

### Core Components

- **API Router**: Handles HTTP requests from the Chrome extension
- **Processor Service**: Analyzes webpage content using GPT-4o
- **Generator Service**: Creates images based on generated prompts using DALL-E 3

## Features

- **Streamlined Chain Processing**: Process webpage content and generate images in a single API call
- **AI Content Analysis**: Extract key concepts and generate concise summaries
- **Balanced Image Generation**: Create images with a perfect 50/50 blend of artistic quality and informational clarity
- **Error Handling**: Robust error handling with fallbacks for API failures

## Tech Stack

- **Framework**: FastAPI for high-performance async API
- **AI Integration**:
  - OpenAI API for GPT-4o and DALL-E 3 models
  - Custom prompt engineering for optimal results
- **Data Processing**: JSON handling for request/response formatting
- **Environment**: Python 3.9+ with async/await support

## API Endpoints

- **`/api/chain`**: Main endpoint that processes content and generates images in one call
  - Accepts webpage text, URL, and title
  - Returns processed title, description, and generated image URL
- **`/api/store-content`**: Stores extracted webpage content for processing
- **`/api/process-content`**: Processes stored content with GPT-4o
- **`/api/generate-image`**: Generates an image based on the last processed content
- **`/api/last-processed`**: Returns the most recently processed content

## Development

### Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload
```

### Key Files

- `main.py`: Application entry point and server configuration
- `routers/api.py`: API endpoint definitions
- `services/processor.py`: Content processing with GPT-4o
- `services/generator.py`: Image generation with DALL-E 3

## Image Generation Strategy

The backend implements a carefully balanced approach to image generation:

- **Visual Storytelling (50%)**: Artistic scenes with rich visual storytelling
- **Information Integration (50%)**: Clear informational components through visual elements
- **Minimal Text**: Only 1-2 essential words when absolutely necessary
- **Visual Metaphors**: Information conveyed primarily through symbols and composition
- **HD Quality**: High-definition images for better visual appeal

## Environment Variables

The backend requires the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4o and DALL-E 3 access
