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
  mockScenarioId?: string;
};

function buildLocalBlueprintFallback(systemPrompt: string, body: BlueprintRequestBody) {
  const answerValues = Object.values(body.answers).filter(Boolean);
  const strongestSignal =
    answerValues[answerValues.length - 1] ||
    body.contextLog[body.contextLog.length - 1] ||
    'The user is still clarifying the first useful business signal.';

  if (systemPrompt.includes('Strategy Director')) {
    return `### Strategy & Clarity Pillar

**Current signal:** ${strongestSignal}

#### Positioning
- Start with the clearest customer, problem, and outcome before naming tools or channels.
- Frame the offer around one practical transformation the buyer can understand quickly.

#### Core Problem
- Identify the repeated friction behind the idea: unclear buyer, scattered workflow, weak offer definition, or inconsistent follow-through.
- Treat unknowns as assumptions to test, not as claims to publish.

#### Audience Clarity
- Define who feels this problem often enough to pay for a better operating route.
- Capture the moment when they actively search for help.

#### Strategic Direction
- Write a one-line promise, a first paid workflow, and the proof needed before scaling the offer.
- Keep the sequence: strategy before tools, systems before scale, content after clarity.`;
  }

  if (systemPrompt.includes('Operations & Systems Architect')) {
    return `### Systems & Workflow Pillar

**Current signal:** ${strongestSignal}

#### Workflow Route
- Map the work from first signal to delivered outcome.
- Separate the steps that need human judgment from the steps that can be assisted by AI.

#### Friction Points
- Look for repeated manual collection, unclear decisions, scattered notes, and missing handoffs.
- Turn the first recurring bottleneck into a small operating system before adding more tools.

#### Human + AI Boundary
- Let AI draft, summarize, classify, and prepare options.
- Keep positioning, promises, approvals, and sensitive decisions human-led.

#### First Build
- Create one reusable intake, one synthesis view, and one handoff artifact that can be used repeatedly.`;
  }

  return `### Content & Presence Pillar

**Current signal:** ${strongestSignal}

#### Starting Platform
- Begin where the buyer already looks for context, trust, or proof.
- Choose one primary channel before spreading the message across formats.

#### Cinematic Narrative
- Show the before-state, the operating logic, and the sharper after-state.
- Avoid tool-led claims. Make the business clarity visible.

#### Content Engine
- Turn the clarified workflow into founder posts, short explainers, proof-safe walkthroughs, and a practical offer page.
- Reuse the same strategic spine across channels so presence follows the work instead of inventing a separate story.

#### 30-Day Direction
- Publish from the problem, the process, and the first operating artifact.
- Keep every public claim grounded in what the system can actually deliver.`;
}

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
            pushToken(buildLocalBlueprintFallback(systemPrompt, body));
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
