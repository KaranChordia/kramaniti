import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL_NAME = process.env.GROQ_CLARITY_MODEL || 'llama-3.3-70b-versatile';

export type BlueprintRequestBody = {
  answers: Record<string, string>;
  transcript: Array<{ role: string; content: string }>;
  aiTasks: Array<{ label: string; question: string }>;
  contextLog: string[];
};

export function createStreamingBlueprintRoute(systemPrompt: string) {
  return async function POST(request: Request) {
    let body: BlueprintRequestBody;

    try {
      body = (await request.json()) as BlueprintRequestBody;
    } catch {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;

        const safeClose = () => {
          if (closed) return;
          closed = true;
          controller.close();
        };

        const pushToken = (token: string) => {
          if (closed) return;
          // We stream raw text, not JSON objects, to make frontend parsing trivial
          controller.enqueue(encoder.encode(token));
        };

        try {
          if (!process.env.GROQ_API_KEY) {
            pushToken("Error: GROQ_API_KEY is not configured.");
            safeClose();
            return;
          }

          const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
            maxRetries: 1,
            timeout: 60_000,
          });

          const prompt = `
System Prompt:
${systemPrompt}

---
CONTEXT FOR GENERATION:
User Answers:
${JSON.stringify(body.answers, null, 2)}

AI Tasks (Unresolved areas):
${JSON.stringify(body.aiTasks, null, 2)}

Synthesized Context Log:
${body.contextLog.join('\n')}
`;

          const completion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: MODEL_NAME,
            temperature: 0.7,
            max_completion_tokens: 2000,
            top_p: 1,
            stream: true,
            stop: null,
          });

          for await (const chunk of completion) {
            const token = chunk.choices[0]?.delta?.content || '';
            if (token) {
              pushToken(token);
            }
          }

          safeClose();
        } catch (error) {
          console.error('Blueprint streaming failed:', error);
          if (!closed) pushToken("\n\n*Error: Failed to stream from AI.*");
          safeClose();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  };
}
