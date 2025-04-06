from fastapi import APIRouter, Body
from models.schemas import ContentRequest
from services.generator import generate_image
from datetime import datetime

router = APIRouter()

# Store the last received text for testing purposes
last_received_text = {"text": "", "url": "", "timestamp": None}

@router.post("/store-content")
async def store_content(content: ContentRequest):
    """
    Store webpage content for later processing with OpenAI and image generation.
    This endpoint receives text from the Chrome extension and saves it for
    future processing with our image generation model.
    """
    global last_received_text
    
    # Store the received text
    last_received_text = {
        "text": content.text,
        "url": content.url,
        "timestamp": datetime.now().isoformat()
    }
    
    # Log receipt of content
    print(f"Received {len(content.text)} characters from {content.url}")
    
    # Return simple confirmation
    return {"success": True, "message": "Content stored for future processing"}

@router.get("/last-content")
async def get_last_content():
    """
    Get the last received content from a webpage.
    This endpoint is useful for testing that your Chrome extension
    is successfully extracting and sending text.
    """
    return last_received_text
