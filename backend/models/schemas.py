from pydantic import BaseModel

class ContentRequest(BaseModel):
    text: str
    url: str
    selected_text: Optional[str] = None

class GeneratedImage(BaseModel):
    prompt: str
    image_url: str