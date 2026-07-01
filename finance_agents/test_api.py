import asyncio
import os
from dotenv import load_dotenv
load_dotenv(override=True)

from google.antigravity import Agent, LocalAgentConfig
from google.antigravity.types import Document

async def main():
    try:
        config = LocalAgentConfig(
            model="gemini-flash-latest",
            api_key=os.getenv("GEMINI_API_KEY")
        )
        print("Testing text chat...")
        async with Agent(config) as agent:
            resp = await agent.chat("Hello, explain AI in 5 words.")
            print(f"Text Response: {await resp.text()}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
