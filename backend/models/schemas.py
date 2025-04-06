from pydantic import BaseModel
from typing import Optional, Dict

class ContentRequest(BaseModel):
    url: str
    text: str
    title: Optional[str] = None
    metadata: Optional[Dict] = None
    
    class Config:
        schema_extra = {
            "example": {
                "url": "https://example.com",
                "text": "This is the content of the webpage",
                "title": "Example Page",
                "metadata": {"author": "John Doe", "date": "2025-04-05"}
            }
        }