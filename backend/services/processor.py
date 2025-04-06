from openai import OpenAI
import os 
import json
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

last_processed = {"title": "", "description": "", "prompt": ""}


async def process_webpage_content(text: str, url: str}) -> Dict[str, Any]: