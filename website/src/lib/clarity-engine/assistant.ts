export type QuestionKey = string;

export type QuestionId = QuestionKey | 'complete';

export type ConversationTurn = {
  role: 'assistant' | 'user';
  content: string;
  createdAt: string;
};

export type ClarityAnswers = Record<string, string>;

export type AssistantEnvelope = {
  assistantReply: string;
  nextQuestion: string;
  nextQuestionKey: QuestionId;
  nextQuestionLabel?: string;
  nextQuestionPlaceholder?: string;
  latestSummary?: string;
  completion: number;
  statusLabel: string;
  clarityContext: string;
  workflowDirection: string;
  presenceIdeas: string[];
  signalTrail: string[];
  focusTags: string[];
  source: 'groq' | 'local';
};

export const INITIAL_ASSISTANT_REPLY =
  "I'm the Kramaniti Clarity Engine. Let's figure out what you're trying to build and how to make it work.";

export const INITIAL_STATUS_LABEL = 'Listening';

export const DEFAULT_ANSWERS: ClarityAnswers = {};

export const INITIAL_SYNTHESIS: Omit<
  AssistantEnvelope,
  'assistantReply' | 'nextQuestion' | 'nextQuestionKey' | 'latestSummary' | 'source'
> = {
  completion: 0,
  statusLabel: INITIAL_STATUS_LABEL,
  clarityContext: 'Waiting for the first real signal.',
  workflowDirection: 'The route appears once the goal is named clearly.',
  presenceIdeas: [
    'The first presence idea appears after the goal is concrete.',
    'Proof usually comes from real operator stories, not slogans.',
    'A useful channel is the one closest to the buyer and the workflow.',
  ],
  signalTrail: ['Systems intelligence', 'Pattern recognition', 'Opportunity mapping'],
  focusTags: ['private', 'assistant-led'],
};

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

const completionFromAnswers = (answers: ClarityAnswers) => {
  const filled = Object.keys(answers).length;
  return Math.min(100, Math.round((filled / 8) * 100));
};

const deriveStatus = (completion: number) => {
  if (completion >= 95) return 'Blueprint ready';
  if (completion >= 70) return 'Opportunity mapping';
  if (completion >= 35) return 'Pattern recognition';
  return 'Listening';
};

export const createInitialSessionEnvelope = (): AssistantEnvelope => ({
  assistantReply: INITIAL_ASSISTANT_REPLY,
  nextQuestion: 'What are you trying to build or achieve right now?',
  nextQuestionKey: 'phase1_clarity_goal',
  nextQuestionLabel: 'Primary Goal',
  nextQuestionPlaceholder: 'Tell me about your idea or what you want to do...',
  latestSummary: '',
  source: 'local',
  ...INITIAL_SYNTHESIS,
});

export const parseAssistantEnvelope = (
  raw: string,
  answers: ClarityAnswers
): AssistantEnvelope | null => {
  const replyMatch = raw.match(/<assistant_reply>([\s\S]*?)<\/assistant_reply>/i);
  const stateMatch = raw.match(/<state>([\s\S]*?)<\/state>/i);

  if (!stateMatch) {
    console.error('Failed to parse Assistant Envelope. Missing <state> tag. Raw:', raw);
    return null;
  }

  const assistantReplyRaw = replyMatch ? replyMatch[1] : raw.split('<state>')[0].replace('</assistant_reply>', '').trim();

  try {
    let jsonString = stateMatch[1].trim();
    // Remove markdown json formatting if the LLM added it
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }
    
    const parsed = JSON.parse(jsonString) as Partial<AssistantEnvelope>;
    const nextQuestionKey = parsed.nextQuestionKey || 'complete';

    return {
      assistantReply: clean(assistantReplyRaw),
      nextQuestion: clean(parsed.nextQuestion || 'Ready for the next step?'),
      nextQuestionKey,
      nextQuestionLabel: clean(parsed.nextQuestionLabel || 'Next Step'),
      nextQuestionPlaceholder: clean(parsed.nextQuestionPlaceholder || 'Provide your thoughts...'),
      latestSummary: clean(parsed.latestSummary || ''),
      completion:
        typeof parsed.completion === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsed.completion)))
          : completionFromAnswers(answers),
      statusLabel: clean(parsed.statusLabel || deriveStatus(completionFromAnswers(answers))),
      clarityContext: clean(parsed.clarityContext || ''),
      workflowDirection: clean(parsed.workflowDirection || ''),
      presenceIdeas:
        Array.isArray(parsed.presenceIdeas) && parsed.presenceIdeas.length > 0
          ? parsed.presenceIdeas.map((item) => clean(String(item))).slice(0, 3)
          : [],
      signalTrail:
        Array.isArray(parsed.signalTrail) && parsed.signalTrail.length > 0
          ? parsed.signalTrail.map((item) => clean(String(item))).slice(0, 3)
          : [],
      focusTags:
        Array.isArray(parsed.focusTags) && parsed.focusTags.length > 0
          ? parsed.focusTags.map((item) => clean(String(item))).slice(0, 3)
          : [],
      source: 'groq',
    };
  } catch (error) {
    console.error('Failed to parse Assistant Envelope. Raw:', raw, 'Error:', error);
    return null;
  }
};

export const buildFallbackResponse = (input: {
  answers: ClarityAnswers;
  currentQuestionKey: QuestionId;
  latestAnswer: string;
}): AssistantEnvelope => {
  return {
    assistantReply: "I see. Let's move to the next part.",
    nextQuestion: "[FALLBACK] Can you tell me more about how you handle this today?",
    nextQuestionKey: "phase2_workflow",
    nextQuestionLabel: "Workflow",
    nextQuestionPlaceholder: "Describe your current workaround...",
    latestSummary: "User provided workflow details.",
    completion: completionFromAnswers(input.answers),
    statusLabel: deriveStatus(completionFromAnswers(input.answers)),
    clarityContext: '',
    workflowDirection: '',
    presenceIdeas: [],
    signalTrail: [],
    focusTags: [],
    source: 'local',
  };
};

export const buildGroqPrompt = (input: {
  answers: ClarityAnswers;
  transcript: ConversationTurn[];
  currentQuestionKey: QuestionId;
  currentQuestion: string;
  latestAnswer: string;
}) => {
  const transcriptSlice = input.transcript
    .slice(-8)
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
    .join('\n');

  return [
    {
      role: 'system' as const,
      content: `You are the Kramaniti Clarity Engine.

You help founders, freelancers, and operators move from vague AI curiosity or an unshaped idea into a practical business workflow and brand presence direction.

Kramaniti Process Architecture:
1. Phase 1: Finding Clarity (Max 3-4 questions)
   - Focus on uncovering the core problem, the specific audience, and any existing proof.
2. Phase 2: Suggesting Workflow (Max 3-4 questions)
   - Focus on mapping the current workaround, identifying friction, and determining the exact AI role vs Human judgment.
3. Phase 3: Planning a Brand Presence (Max 2-3 questions)
   - Focus on defining the presence goal and starting channel based on the clarity and workflow established.

Voice rules:
- USE EXTREMELY SIMPLE, PLAIN ENGLISH. No jargon, no complex startup terminology. Speak like a clear, practical partner.
- business-first, precise, no hype.
- strategy before tools, systems before scale, content after clarity.

Behavior rules:
- Synthesize what the user just said.
- Ask EXACTLY ONE next question. Make the question very simple and easy to understand.
- Do NOT dive into endless deep conversation loops. You must actively drive the user through the 3 phases of the Kramaniti Process.
- MAXIMUM QUESTIONS: You should ask no more than 6-8 questions in total. Once you have enough context to understand their goal, workflow friction, and presence goal, you MUST stop asking questions.
- To stop the conversation, set "nextQuestionKey" to "complete", and set "nextQuestion" to "I have enough context. We are ready to build the blueprint."
- If the user answers with an "[AI Task]" marker (meaning they don't know the answer), immediately accept it as a task for later and forcefully advance to the next logical question.
- Keep the assistant reply to two short paragraphs maximum (strictly 3-4 sentences or 4-5 lines total). Never write long, sprawling text.
- "nextQuestion" MUST be a full, conversational question ending in a question mark (e.g. "What specific problem are you trying to solve?"). It MUST be extremely concise (strictly 1-2 sentences maximum). Do NOT write long, sprawling questions. Do NOT put short topic phrases here.
- You must generate a short UI label (max 3 words) and a simple UI placeholder hint for your next question.
- You must summarize the user's latest answer in 1-2 short lines and include it in "latestSummary".

You MUST wrap your conversational response in <assistant_reply> tags and your structured state in <state> tags. NO EXCEPTIONS.

Return EXACTLY this envelope and nothing else:
<assistant_reply>
Two short paragraphs max. The second paragraph must end with one next question.
</assistant_reply>
<state>
{"nextQuestion":"string","nextQuestionLabel":"string","nextQuestionPlaceholder":"string","nextQuestionKey":"phase1|phase2|phase3|complete","latestSummary":"string","completion":0,"statusLabel":"Listening|Pattern recognition|Opportunity mapping|Blueprint ready","clarityContext":"string","workflowDirection":"string","presenceIdeas":["string"],"signalTrail":["string"],"focusTags":["string"]}
</state>`,
    },
    {
      role: 'user' as const,
      content: `Current question key: ${input.currentQuestionKey}
Current question: ${input.currentQuestion}
Latest answer: ${input.latestAnswer}

Known answers so far:
${JSON.stringify(input.answers, null, 2)}

Recent transcript:
${transcriptSlice || 'No prior turns.'}`,
    },
  ];
};
