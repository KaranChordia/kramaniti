import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return NextResponse.json({ error: 'Internal Server Error: Missing API Key configuration.' }, { status: 500 });
    }

    // Read the Knowledge Base dynamically
    let knowledgeBase = '';
    try {
      const kbPath = path.join(process.cwd(), '..', '06_ai_agent_context', 'system_prompts', 'studio_knowledge_base.md');
      knowledgeBase = fs.readFileSync(kbPath, 'utf8');
    } catch (err) {
      console.warn('Could not load knowledge base file, falling back to base instruction.', err);
    }

    // System instruction injected to give it the Kramaniti Persona
    const systemInstruction = `You are the Kramaniti Intelligence Copilot. You are an expert AI system helping a founder clarify their business operations and workflows. Be concise, highly professional, and use first-principles thinking.\n\nHere is everything you know about Kramaniti:\n\n${knowledgeBase}`;

    const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
    
    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nUser: ${message}` }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from Gemini API' }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract the text from Gemini's response structure
    let aiText = 'No response generated.';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
      aiText = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ response: aiText });

  } catch (error) {
    console.error('Chatbot route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
