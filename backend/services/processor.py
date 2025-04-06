import os
import json
from openai import AsyncOpenAI
from typing import Dict, Any
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure OpenAI API
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Store the last processed result
last_processed = {"title": "", "description": "", "prompt": ""}

# Create a directory for storing processed content
os.makedirs("processed_content", exist_ok=True)

def save_processed_content(content, url):
    """Save processed content to a JSON file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"processed_content/{timestamp}_{url.replace('://', '_').replace('/', '_')[:50]}.json"
    
    with open(filename, "w") as f:
        json.dump(content, f, indent=2)
    
    return filename

async def process_webpage_content(text: str, url: str) -> Dict[str, str]:
    """
    Process webpage content using OpenAI API to generate a title, description, and image prompt.
    
    Args:
        text: The extracted text content from the webpage
        url: The URL of the webpage
        
    Returns:
        Dictionary containing the processed results (title, description, and image prompt)
    """
    global last_processed
    
    # Select model based on content length
    if len(text) < 100000:
        model_name = "gpt-4o-mini"
    # For very long content, truncate to avoid token limits
    else:
        text = text[:200000]
        model_name = "o3-mini"
    
    # Create system and user messages
    system_message = """
    You are an expert at analyzing webpage content and generating concise, descriptive summaries.
    Your response must be a valid JSON object with the following fields:
    - title: A short, catchy title that captures the essence of the content
    - description: A brief description (2-3 sentences) summarizing the key points
    - prompt: A detailed prompt for an image generation model that visualizes the content
    
    The image prompt should be detailed, descriptive, and capture the main theme of the content.
    """
    
    user_message = f"""
    URL: {url}
    
    Content: {text[:1000]}...
    
    Please analyze this content and return a JSON object with the following fields:
    - title: A short, catchy title
    - description: A brief summary (2-3 sentences)
    - prompt: A detailed image generation prompt
    
    Example format:
    {{
        "title": "Sample Title",
        "description": "This is a sample description.",
        "prompt": "A detailed image prompt."
    }}
    """
    
    try:
        # Call OpenAI API directly
        response = await client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        result = json.loads(response.choices[0].message.content)
        
        # Update last processed
        global last_processed
        last_processed = result
        
        # Save processed content to a JSON file
        filename = save_processed_content(result, url)
        print(f"Processed content saved to {filename}")
        
        return result
        
    except Exception as e:
        print(f"Error processing content with OpenAI: {str(e)}")
        return {
            "title": f"Error processing content from {url}",
            "description": f"An error occurred while processing the content",
            "prompt": "Error generating image prompt"
        }