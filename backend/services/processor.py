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

# Store the last processed result in memory
last_processed = {"title": "", "description": "", "prompt": ""}

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
    - prompt: A detailed prompt for an image that balances artistic quality with informational content
    
    For the image prompt, follow these guidelines:
    1. Begin with a balanced direction (e.g., "A visual scene that equally blends artistry and information about...", "A conceptual illustration that tells the story of...")
    2. Balance visual appeal with 2-3 key concepts from the webpage
    3. Create an exact 50/50 blend of artistic elements and informational components
    4. Use minimal text - only 1-2 essential words/labels if absolutely necessary
    5. Rely primarily on visual metaphors, symbols, and composition to convey information
    6. Suggest a rich color palette that naturally guides the viewer through the information
    7. The image should be exactly 50% artistic/visual and 50% informational
    
    The prompt should be 2-3 sentences long and focus on creating a visually engaging image that subtly incorporates key information.
    IMPORTANT: Avoid any controversial, violent, or sensitive content in the prompt.
    """
    
    user_message = f"""
    URL: {url}
    
    Content: {text[:1500]}...
    
    Please analyze this content and return a JSON object with the following fields:
    - title: A short, catchy title
    - description: A brief summary (2-3 sentences)
    - prompt: A prompt for an image that balances artistic quality with subtle informational elements
    
    For the prompt, create an image that perfectly balances visual appeal (50%) with informational clarity (50%).
    The image should use minimal text while effectively communicating key concepts through visual storytelling and symbolism.
    
    Example format:
    {{
        "title": "The Digital Revolution in Music",
        "description": "Streaming platforms have transformed how music is distributed and consumed globally. Artists now reach wider audiences directly while listeners enjoy unprecedented access to diverse musical catalogs.",
        "prompt": "A balanced scene depicting digital music distribution. Create a flowing landscape where musical notes transform into digital particles connecting devices and human figures. On one side, show artists creating music; on the other, show listeners experiencing it, with streaming platforms visualized as a bridge between them. Use rich blues and purples with golden accents for data points. Include visual symbols for key concepts: a globe for global reach, connecting pathways for distribution, and diverse music genres represented by distinct instruments. Use at most 1-2 essential labels if needed. The composition should guide the viewer's eye through the music distribution process while maintaining visual beauty."
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
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        result = json.loads(response.choices[0].message.content)
        
        # Update last processed
        global last_processed
        last_processed = result
        
        # Log processing completion
        print(f"Processed content for {url[:50]}...")
        
        return result
        
    except Exception as e:
        print(f"Error processing content with OpenAI: {str(e)}")
        return {
            "title": f"Error processing content from {url}",
            "description": f"An error occurred while processing the content",
            "prompt": "Error generating image prompt"
        }