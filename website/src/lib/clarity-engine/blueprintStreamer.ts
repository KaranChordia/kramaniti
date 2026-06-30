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
  squareProject?: {
    projectId: string;
    folderId?: string | null;
    projectTitle: string;
    folderName?: string;
    projectInstruction?: string | null;
  } | null;
};

function buildLocalBlueprintFallback(systemPrompt: string, body: BlueprintRequestBody) {
  const answerValues = Object.values(body.answers).filter(Boolean);
  const strongestSignal =
    answerValues[answerValues.length - 1] ||
    body.contextLog[body.contextLog.length - 1] ||
    'The user is still clarifying the first useful business signal.';

  if (systemPrompt.includes('Strategy Director')) {
    return `### Strategy & Clarity Action Plan

**Current signal:** ${strongestSignal}

#### Strategic Diagnosis
- The real issue is not choosing tools. The user needs a sharper buyer, problem, and operating promise before implementation.
- Treat the current signal as the first hypothesis to test, not as a finished offer.

#### Recommended Positioning
- Frame the work around one practical operating improvement the buyer can understand quickly.
- Use a promise that connects the buyer's pain to a clearer workflow or decision route.

#### First Decisions
- Define the exact buyer who feels the problem often enough to act.
- Name the before-state in one sentence.
- Decide what proof would make the promise believable without inventing claims.

#### 7-Day Action Plan
- Write one problem statement, one buyer sentence, and one operating promise.
- Review 5 recent conversations, enquiries, or notes to find repeated language.
- Draft one offer page outline before creating more content or adding tools.

#### Risks To Avoid
- Do not lead with AI if the buyer's problem is actually clarity, workflow, or trust.
- Do not scale content before the strategic spine is clear.
- Keep the sequence: strategy before tools, systems before scale, content after clarity.`;
  }

  if (systemPrompt.includes('Operations & Systems Architect')) {
    return `### Systems & Workflow Action Plan

**Current signal:** ${strongestSignal}

#### Workflow Diagnosis
- The first systems issue is usually not lack of software. It is unclear intake, weak handoff, scattered context, or repeated manual synthesis.
- Map the work from first signal to delivered outcome before choosing automation.

#### First Operating System
- Build one reusable intake and synthesis path for the recurring work.
- The first artifact should capture context, decision status, next action, owner, and handoff notes.

#### Human + AI Rules
- Human-led: diagnosis, promise, approvals, sensitive decisions, and final recommendations.
- AI-assisted: summarizing, classifying, drafting, pattern extraction, and preparing options.
- Automate later only when the handoff rule is already clear.

#### 14-Day Build Plan
- Days 1-3: map the current workflow and mark every handoff.
- Days 4-7: design one intake/synthesis artifact.
- Days 8-11: test it on 3 real cases.
- Days 12-14: revise the artifact and document human/AI rules.

#### Risks To Avoid
- Do not automate a messy process before the decision logic is visible.
- Do not add tools that create another place to check without improving the handoff.`;
  }

  return `### Content & Presence Action Plan

**Current signal:** ${strongestSignal}

#### Presence Diagnosis
- The presence gap is usually a trust gap: the buyer cannot yet see how the thinking, workflow, or outcome works.
- Content should make the operating clarity visible, not decorate an unclear offer.

#### Core Narrative
- Repeat this structure: the messy before-state, the operating logic, and the sharper next step.
- Keep AI as infrastructure unless the buyer specifically cares about the AI method.

#### First Content Moves
- Publish one post explaining the repeated problem.
- Publish one walkthrough of the diagnostic process.
- Create one proof-safe workflow map or checklist.
- Rewrite one website section around the buyer's felt problem.
- Turn one real operating artifact into an anonymized insight.

#### 30-Day Presence Plan
- Week 1: clarify the core narrative and one primary channel.
- Week 2: publish problem/process content.
- Week 3: publish proof-safe workflow content.
- Week 4: refine the offer page or service explainer from the strongest signal.

#### Claims To Avoid
- Do not invent metrics, testimonials, case studies, or client proof.
- Do not promise transformation that the workflow cannot yet support.`;
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
KRAMANITI CONTEXT:
Kramaniti is a first-principles AI systems partner. Use this sequence: strategy before tools, systems before scale, content after clarity. Keep AI human-collaborative: AI assists, humans lead. Do not invent proof, metrics, testimonials, or client claims. The output is reflective diagnostic guidance, not a sales CTA.

OUTPUT STANDARD:
Do not simply summarize the user's answers. Use the answers as raw signal and produce a practical plan of action. Every section must include recommendations, specific next actions, useful suggestions, or risks to avoid. Prefer concrete verbs such as define, map, remove, draft, test, document, publish, and review. If information is missing, name the assumption and give the next action needed to resolve it.

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
