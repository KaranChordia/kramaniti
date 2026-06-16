import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import {
  buildFallbackResponse,
  buildGroqPrompt,
  parseAssistantEnvelope,
  type ClarityAnswers,
  type ConversationTurn,
  type QuestionId,
} from '@/lib/clarity-engine/assistant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestBody = {
  answers: ClarityAnswers;
  transcript: ConversationTurn[];
  currentQuestionKey: QuestionId;
  currentQuestion: string;
  latestAnswer: string;
};

type StreamEvent =
  | { type: 'token'; value: string }
  | { type: 'final'; data: ReturnType<typeof buildFallbackResponse> }
  | { type: 'error'; message: string };

const MODEL_NAME = process.env.GROQ_CLARITY_MODEL || 'llama-3.3-70b-versatile';

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const fallback = buildFallbackResponse({
    answers: body.answers,
    currentQuestionKey: body.currentQuestionKey,
    latestAnswer: body.latestAnswer,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const safeClose = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      const push = (event: StreamEvent) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        if (!process.env.GROQ_API_KEY) {
          push({ type: 'final', data: fallback });
          safeClose();
          return;
        }

        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
          maxRetries: 1,
          timeout: 45_000,
        });

        const completion = await groq.chat.completions.create({
          messages: buildGroqPrompt(body),
          model: MODEL_NAME,
          temperature: 1,
          max_completion_tokens: 8192,
          top_p: 1,
          stream: true,
          stop: null,
        });

        let raw = '';

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content || '';

          if (!token) continue;

          raw += token;
          push({ type: 'token', value: token });
        }

        const parsed = parseAssistantEnvelope(raw, body.answers) || fallback;
        push({ type: 'final', data: parsed });
      } catch (error) {
        console.error('Clarity Engine Groq route failed:', error);
        push({ type: 'final', data: fallback });
      } finally {
        safeClose();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
