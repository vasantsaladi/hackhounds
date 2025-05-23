import os
import json
from openai import AsyncOpenAI
from typing import Dict, Any
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_image(prompt: str) -> str:
    """
    Generate an image based on the provided prompt using OpenAI DALL-E 3.
    
    Args:
        prompt: The text prompt to generate an image from
        
    Returns:
        URL to the generated image
    """
    try:
        # Call OpenAI API to generate image
        # Add a prefix to guide the balance between artistic and informational content
        balanced_prompt = f"Create an image with equal parts artistic beauty and informational clarity (50/50). Use minimal text (1-2 words maximum) and rely on visual storytelling: {prompt}"
        
        response = await client.images.generate(
            model="dall-e-3",
            prompt=balanced_prompt,
            n=1,
            size="1024x1024",  # Standard square format
            quality="hd"       # Higher quality for better visual appeal
        )
        
        # Return the URL of the generated image
        return response.data[0].url
        
    except Exception as e:
        print(f"Error generating image with DALL-E: {str(e)}")
        
        # Fallback to placeholder if there's an error
        safe_prompt = prompt.replace(" ", "+")[:50]
        return f"https://placehold.co/600x400?text={safe_prompt}"