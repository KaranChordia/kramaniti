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
  "Let’s understand the work before choosing a tool. We’ll look at what matters, how it works today, where it gets stuck, where AI could help, and what should stay with people.";

export const INITIAL_STATUS_LABEL = 'Listening';

const COMPLETE_ASSISTANT_REPLY =
  'That is enough to see the problem, the current workflow, where AI may help, and what should stay human-led. Your clarity plan is ready.';

export const DEFAULT_ANSWERS: ClarityAnswers = {};

export const INITIAL_SYNTHESIS: Omit<
  AssistantEnvelope,
  'assistantReply' | 'nextQuestion' | 'nextQuestionKey' | 'latestSummary' | 'source'
> = {
  completion: 0,
  statusLabel: INITIAL_STATUS_LABEL,
  clarityContext: 'Waiting for your starting point.',
  workflowDirection: 'The next step becomes clear once we can see the problem and the work around it.',
  presenceIdeas: [
    'Communication comes after the work is clear.',
    'Useful proof comes from real work, not slogans.',
    'Use the channel closest to the customer and the decision.',
  ],
  signalTrail: ['What matters', 'How the work happens', 'What should become clear'],
  focusTags: ['private', 'focused'],
};

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

const QUESTION_SEQUENCE = [
  'phase1_clarity_goal',
  'phase2_audience_problem',
  'phase3_current_workflow',
  'phase4_main_friction',
  'phase5_ai_boundary',
  'phase6_presence_proof',
] as const;

const QUESTION_COUNT = QUESTION_SEQUENCE.length;

const questionIndex = (key: QuestionId) => QUESTION_SEQUENCE.indexOf(key as (typeof QUESTION_SEQUENCE)[number]);

const compactSignal = (value: string, fallback = 'this work') => {
  const cleaned = clean(value);
  if (!cleaned) return fallback;

  const firstLine = cleaned
    .split(/\n|\.|\?|!/)
    .map((item) => clean(item))
    .find(Boolean);
  const source = firstLine || cleaned;

  return source.length > 86 ? `${source.slice(0, 83).trim()}...` : source;
};

const hasAnswer = (answers: ClarityAnswers, key: (typeof QUESTION_SEQUENCE)[number]) =>
  Boolean(clean(answers[key] || ''));

const nextMissingQuestionKey = (answers: ClarityAnswers, afterKey: QuestionId): QuestionId => {
  const startIndex = Math.max(questionIndex(afterKey) + 1, 0);
  const next = QUESTION_SEQUENCE.slice(startIndex).find((key) => !hasAnswer(answers, key));
  return next ?? 'complete';
};

const primarySignalFromAnswers = (answers: ClarityAnswers) =>
  compactSignal(
    answers.phase1_clarity_goal ||
      answers.phase2_audience_problem ||
      answers.phase3_current_workflow ||
      Object.values(answers).find(Boolean) ||
      '',
  );

const inferWorkNoun = (answers: ClarityAnswers) => {
  const combined = Object.values(answers).join(' ').toLowerCase();

  if (/content|post|linkedin|brand|presence|video|reel|website|copy/.test(combined)) return 'content or presence system';
  if (/workflow|operation|handoff|process|crm|report|task|manual|automation/.test(combined)) return 'workflow';
  if (/offer|service|client|buyer|sales|lead|proposal/.test(combined)) return 'offer';
  if (/product|app|platform|tool|prototype|build/.test(combined)) return 'product idea';
  if (/community|founder|circle|network/.test(combined)) return 'community direction';

  return 'work';
};

export const buildPersonalizedQuestion = (
  nextKey: QuestionId,
  answers: ClarityAnswers,
): Pick<AssistantEnvelope, 'nextQuestion' | 'nextQuestionLabel' | 'nextQuestionPlaceholder'> => {
  const signal = primarySignalFromAnswers(answers);
  const workNoun = inferWorkNoun(answers);
  const workflowSignal = compactSignal(answers.phase3_current_workflow || answers.phase1_clarity_goal, `this ${workNoun}`);
  const audienceSignal = compactSignal(answers.phase2_audience_problem || answers.phase1_clarity_goal, `this ${workNoun}`);

  const questions: Record<string, Pick<AssistantEnvelope, 'nextQuestion' | 'nextQuestionLabel' | 'nextQuestionPlaceholder'>> = {
    phase2_audience_problem: {
      nextQuestion: `For "${signal}", who feels the problem most clearly, and what are they already trying to fix?`,
      nextQuestionLabel: 'Who It Helps',
      nextQuestionPlaceholder: `Name the person or team this ${workNoun} is for, and the problem they already notice...`,
    },
    phase3_current_workflow: {
      nextQuestion: `If we follow "${audienceSignal}" in real life, what happens today from start to finish?`,
      nextQuestionLabel: 'How It Works Now',
      nextQuestionPlaceholder: 'Walk through the current path in plain steps, even if parts are messy...',
    },
    phase4_main_friction: {
      nextQuestion: `In that current path, where does "${workflowSignal}" slow down, get repeated, or become unclear?`,
      nextQuestionLabel: 'Where It Gets Stuck',
      nextQuestionPlaceholder: 'Name the delay, repeated manual work, missing handoff, or unclear decision...',
    },
    phase5_ai_boundary: {
      nextQuestion: `For that problem, what should people decide, and what could AI help prepare or organize?`,
      nextQuestionLabel: 'People + AI',
      nextQuestionPlaceholder: 'Separate judgment, approval, taste, privacy, drafting, summarizing, routing, or automation...',
    },
    phase6_presence_proof: {
      nextQuestion: `Once this is clearer, what should people be able to trust, see, or understand about "${signal}"?`,
      nextQuestionLabel: 'What Should Be Clear',
      nextQuestionPlaceholder: 'Describe the proof, confidence, message, report, demo, or public explanation this should create...',
    },
  };

  return questions[nextKey] || {
    nextQuestion: 'What should become clearer next?',
    nextQuestionLabel: 'Next Step',
    nextQuestionPlaceholder: 'Add the next useful detail...',
  };
};

const completionFromAnswers = (answers: ClarityAnswers) => {
  const filled = Object.keys(answers).length;
  return Math.min(100, Math.round((filled / QUESTION_COUNT) * 100));
};

const deriveStatus = (completion: number) => {
  if (completion >= 95) return 'Blueprint ready';
  if (completion >= 70) return 'Opportunity mapping';
  if (completion >= 35) return 'Pattern recognition';
  return 'Listening';
};

export const createInitialSessionEnvelope = (): AssistantEnvelope => ({
  assistantReply: INITIAL_ASSISTANT_REPLY,
  nextQuestion: 'What are you trying to build, improve, or make clearer?',
  nextQuestionKey: 'phase1_clarity_goal',
  nextQuestionLabel: 'Your Starting Point',
  nextQuestionPlaceholder: 'Name the piece of work, business problem, or idea you want to make clearer...',
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
    const isComplete = nextQuestionKey === 'complete';

    return {
      assistantReply: isComplete ? COMPLETE_ASSISTANT_REPLY : clean(assistantReplyRaw),
      nextQuestion: isComplete
        ? 'I have enough context. Your clarity plan is ready.'
        : clean(parsed.nextQuestion || 'Ready for the next step?'),
      nextQuestionKey,
      nextQuestionLabel: isComplete ? 'Clarity Plan Ready' : clean(parsed.nextQuestionLabel || 'Next Step'),
      nextQuestionPlaceholder: isComplete
        ? 'Open your clarity plan...'
        : clean(parsed.nextQuestionPlaceholder || 'Provide your thoughts...'),
      latestSummary: clean(parsed.latestSummary || ''),
      completion:
        typeof parsed.completion === 'number'
          ? Math.max(
              completionFromAnswers(answers),
              Math.min(100, Math.round(parsed.completion))
            )
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
  const nextKey = nextMissingQuestionKey(input.answers, input.currentQuestionKey);
  const completion = completionFromAnswers(input.answers);
  const latestAnswer = clean(input.latestAnswer);
  const latestSummary = latestAnswer
    ? `Captured signal: ${latestAnswer.slice(0, 170)}${latestAnswer.length > 170 ? '...' : ''}`
    : 'Captured a diagnostic signal for the operating route.';
  const signal = primarySignalFromAnswers(input.answers);
  const workNoun = inferWorkNoun(input.answers);

  if (nextKey === 'complete') {
    return {
      assistantReply: COMPLETE_ASSISTANT_REPLY,
      nextQuestion: 'I have enough context. Your clarity plan is ready.',
      nextQuestionKey: 'complete',
      nextQuestionLabel: 'Clarity Plan Ready',
      nextQuestionPlaceholder: 'Open your clarity plan...',
      latestSummary,
      completion: 100,
      statusLabel: 'Blueprint ready',
      clarityContext: 'The core business problem and the person it affects are clear enough to review.',
      workflowDirection: 'The workflow can now be separated into people-led decisions and useful AI support.',
      presenceIdeas: [
        'Turn the clearest part of the work into proof.',
        'Use communication to show the problem, the work, and what became clearer.',
        'Keep public claims grounded in what the workflow can actually deliver.',
      ],
      signalTrail: ['Strategy before tools', 'Systems before scale', 'Content after clarity'],
      focusTags: ['clarity', 'workflow', 'communication'],
      source: 'local',
    };
  }

  const next = buildPersonalizedQuestion(nextKey, input.answers);

  return {
    assistantReply:
      `That helps. I’ll keep the next question tied to your ${workNoun} around "${signal}" instead of moving into a generic checklist.`,
    nextQuestion: next.nextQuestion,
    nextQuestionKey: nextKey,
    nextQuestionLabel: next.nextQuestionLabel,
    nextQuestionPlaceholder: next.nextQuestionPlaceholder,
    latestSummary,
    completion,
    statusLabel: deriveStatus(completion),
    clarityContext: 'We are moving from the goal to the person, the work, the boundary, and the proof.',
    workflowDirection: 'The next step is still being shaped from how the work happens today.',
    presenceIdeas: [
      'Proof should come from the work itself.',
      'Communication should explain what changed, not decorate it.',
      'Content comes after the work is clear.',
    ],
    signalTrail: ['What matters', 'How the work happens', 'People + AI'],
    focusTags: ['focused', 'practical', 'human-led'],
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

You help potential Kramaniti clients move from a vague goal, AI curiosity, scattered workflow, or unclear public presence into a practical operating diagnosis.

Kramaniti diagnostic sequence:
1. Strategy before tools: clarify what the user is trying to build, improve, or make clearer.
2. Buyer/problem before solution: identify who this is for and what problem they already feel.
3. Systems before scale: map how the work happens today, from first signal to delivered outcome.
4. Friction before automation: identify the delay, repeated manual work, or decision confusion.
5. Human-led, AI-assisted: separate human judgment from AI support.
6. Content after clarity: define the trust, proof, or presence the work should create.

Question arc and allowed keys:
- phase1_clarity_goal: What are you trying to build, improve, or make clearer?
- phase2_audience_problem: Who is this for, and what problem are they already feeling?
- phase3_current_workflow: How does this work today, from first signal to delivered outcome?
- phase4_main_friction: Where is the main friction, delay, or decision confusion?
- phase5_ai_boundary: Which parts need human judgment, and which parts could AI assist?
- phase6_presence_proof: What trust, proof, or public presence should this create?
- complete: I have enough context. Your clarity plan is ready.

Voice rules:
- USE EXTREMELY SIMPLE, PLAIN ENGLISH. No jargon, no complex startup terminology. Speak like a clear, practical partner.
- business-first, precise, no hype.
- strategy before tools, systems before scale, content after clarity.
- Sound like Kramaniti's thinking, not a sales pitch.

Behavior rules:
- Synthesize what the user just said.
- Ask EXACTLY ONE next question. Make the question very simple, easy to understand, and clearly connected to the user's actual first intent/context.
- Balance structure with flexibility: keep the six essential diagnostic areas, but rewrite each next question in the user's words and around their specific business, project, workflow, audience, or blocker.
- Do not sound like a fixed survey. Avoid generic phrasing when the user has provided concrete context.
- Do not ask for information the user has already clearly provided. If an answer already covers the next diagnostic area, advance to the next missing area.
- Do NOT dive into endless deep conversation loops. You must actively drive the user through the 6-step Kramaniti diagnostic.
- MAXIMUM QUESTIONS: Ask no more than 6 questions in total. Once the user has answered phase6_presence_proof, you MUST stop asking questions.
- To stop the conversation, set "nextQuestionKey" to "complete", and set "nextQuestion" to "I have enough context. Your clarity plan is ready."
- If the user answers with an "[AI Task]" marker (meaning they don't know the answer), immediately accept it as a task for later and forcefully advance to the next logical question.
- Keep the assistant reply to two short paragraphs maximum (strictly 3-4 sentences or 4-5 lines total). Never write long, sprawling text.
- "nextQuestion" MUST be a full, conversational question ending in a question mark (e.g. "For the internal reporting workflow you described, where does the handoff break most often?"). It MUST be extremely concise (strictly 1-2 sentences maximum). Do NOT write long, sprawling questions. Do NOT put short topic phrases here.
- Exception: when "nextQuestionKey" is "complete", the assistant reply MUST NOT ask another question. It must close the diagnostic and point to the blueprint.
- You must generate a short UI label (max 3 words) and a simple UI placeholder hint for your next question.
- You must summarize the user's latest answer in 1-2 short lines and include it in "latestSummary".
- Do not ask about budget, booking, or sales readiness. The output is a reflective diagnostic blueprint, not a lead form.
- Do not use a visible fit score. You may imply readiness through the clarity of the diagnosis.
- Do not claim outcomes, metrics, or public proof the user has not provided.

You MUST wrap your conversational response in <assistant_reply> tags and your structured state in <state> tags. NO EXCEPTIONS.

Return EXACTLY this envelope and nothing else:
<assistant_reply>
Two short paragraphs max. For active diagnostic steps, the second paragraph must end with one next question. For "complete", do not ask a question.
</assistant_reply>
<state>
{"nextQuestion":"string","nextQuestionLabel":"string","nextQuestionPlaceholder":"string","nextQuestionKey":"phase1_clarity_goal|phase2_audience_problem|phase3_current_workflow|phase4_main_friction|phase5_ai_boundary|phase6_presence_proof|complete","latestSummary":"string","completion":0,"statusLabel":"Listening|Pattern recognition|Opportunity mapping|Blueprint ready","clarityContext":"string","workflowDirection":"string","presenceIdeas":["string"],"signalTrail":["string"],"focusTags":["string"]}
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
