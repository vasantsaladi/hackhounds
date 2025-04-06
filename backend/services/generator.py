import os 
import requests


async def generate_image(prompt: str) -> str:
    """Generate an image based on the provided prompt."""
    # For hackathon - return a placeholder image
    safe_prompt = prompt.replace(" ", "+")[:50]
    return f"https://placehold.co/600x400?text={safe_prompt}"