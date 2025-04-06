import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.globals import set_debug, set_verbose

# Load environment variables from .env file
load_dotenv()

# Configure LangSmith tracing (optional but helpful for debugging)
# These values should be set in your .env file
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Page2Pixel"

# Create an OpenAI chat model instance
llm = ChatOpenAI(
    model="gpt-4o-mini",  # You can change this to any model you prefer
    temperature=0.7,
)

# Simple test to verify the setup works
if __name__ == "__main__":
    print("Testing LangChain with OpenAI...")
    result = llm.invoke("Write a short poem about turning web pages into images.")
    print(result.content)
    print("Test completed successfully!")