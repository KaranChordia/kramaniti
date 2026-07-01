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
        print("Testing PDF upload...")
        async with Agent(config) as agent:
            # Try to upload one pdf
            pdf = Document.from_file("/Users/karanchordia/Documents/GitHub/kramaniti/Finance_Kramaniti/Incvoices - Expense/Wework Rent - July 2026.pdf")
            resp = await agent.chat(["What is this document?", pdf])
            print(f"PDF Response: {await resp.text()}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
