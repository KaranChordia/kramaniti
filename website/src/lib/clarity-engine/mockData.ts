export interface MockScenarioQuestion {
  question: string;
  label: string;
  placeholder: string;
  assistantReply: string;
}

export interface MockScenario {
  id: string;
  name: string;
  answers: Record<string, string>;
  questions: Record<string, MockScenarioQuestion>;
  blueprint: {
    strategy: string;
    systems: string;
    presence: string;
  };
}

export const mockScenarios: MockScenario[] = [
  {
    id: 'founder-service-business',
    name: 'Founder-Led Service Business',
    answers: {
      phase1_clarity_goal:
        'We are a founder-led consulting business with good expertise, but the offer feels scattered. We want clearer packaging before we create more content or add AI tools.',
      phase2_audience_problem:
        'The buyer is usually a founder or small leadership team. They know they need better systems and content, but they cannot tell what should be strategy, what should be workflow, and what should be marketing.',
      phase3_current_workflow:
        'Right now everything starts in calls and notes. We diagnose manually, write custom proposals from scratch, and then rebuild similar delivery documents every time.',
      phase4_main_friction:
        'The main friction is turning a messy first conversation into a clear scope. We lose time deciding what the client actually needs and what should come first.',
      phase5_ai_boundary:
        'Human judgment should stay in diagnosis, positioning, and final recommendations. AI could help summarize calls, identify repeated patterns, draft scopes, and prepare handoff documents.',
      phase6_presence_proof:
        'We want the public presence to show practical thinking: how we diagnose messy businesses, design workflows, and turn clarity into useful content without making exaggerated claims.',
    },
    questions: {
      phase2_audience_problem: {
        question: 'Who is this for, and what problem are they already feeling?',
        label: 'Buyer Problem',
        placeholder: 'Describe the buyer and the pain they already recognize...',
        assistantReply:
          'The first signal is not a tool problem. It is an offer and operating clarity problem, which means the buyer and the felt pain need to be sharper before anything scales.',
      },
      phase3_current_workflow: {
        question: 'How does this work today, from first signal to delivered outcome?',
        label: 'Current Workflow',
        placeholder: 'Walk through the current path, even if it is messy...',
        assistantReply:
          'That points to a buyer who needs structure before execution. Now the operating route matters: we need to see how the work currently moves from interest to delivery.',
      },
      phase4_main_friction: {
        question: 'Where is the main friction, delay, or decision confusion?',
        label: 'Main Friction',
        placeholder: 'Name the bottleneck, repeated delay, or unclear decision point...',
        assistantReply:
          'The current workflow is call-led and custom every time. That can stay premium, but the repeated decisions need a clearer system underneath.',
      },
      phase5_ai_boundary: {
        question: 'Which parts need human judgment, and which parts could AI assist?',
        label: 'AI Boundary',
        placeholder: 'Separate judgment, approval, drafting, summarizing, routing, or automation...',
        assistantReply:
          'The friction is the translation layer: turning conversation into scope. This is exactly where human diagnosis should lead and AI can prepare the operating material around it.',
      },
      phase6_presence_proof: {
        question: 'What trust, proof, or public presence should this create?',
        label: 'Proof & Presence',
        placeholder: 'Describe the confidence, proof, or narrative this should build...',
        assistantReply:
          'That boundary is strong. AI can support the memory, synthesis, and drafting, while the founder keeps control of diagnosis, promise, and approval.',
      },
      complete: {
        question: 'I have enough context. We are ready to build the blueprint.',
        label: 'Blueprint Ready',
        placeholder: 'Generate the diagnostic blueprint...',
        assistantReply:
          'The diagnostic signal is complete: buyer, problem, workflow, friction, AI boundary, and presence direction are visible. The blueprint can now reflect how Kramaniti would think through the operating route.',
      },
    },
    blueprint: {
      strategy: `### Strategy & Clarity Action Plan

#### Strategic Diagnosis
- The real strategic issue is not lack of expertise. It is that the offer, workflow, and content story are not yet connected into one clear operating route.
- The buyer is a founder or leadership team that needs order before execution.

#### Recommended Positioning
- Position the offer as a **clarity-to-operating-system diagnostic** for founder-led businesses.
- The promise should be practical: turn scattered conversations into one clear scope, workflow, and proof-safe presence direction.

#### First Decisions
- Decide the one buyer profile this diagnostic is for first.
- Decide the minimum output every first engagement should produce: scope, workflow map, or implementation brief.
- Decide what proof can be shown safely: frameworks, anonymized maps, before/after structure, or founder thinking.

#### 7-Day Action Plan
- Write a one-page diagnostic offer with buyer, problem, output, and next step.
- Review the last 5 discovery calls or notes and mark repeated problems.
- Draft one sample scope artifact that could be reused after every first conversation.

#### Risks To Avoid
- Do not build more content before the diagnostic offer is clear.
- Do not let AI write the promise; use AI only to prepare the raw material for founder judgment.`,
      systems: `### Systems & Workflow Action Plan

#### Workflow Diagnosis
- The workflow depends too much on founder memory after calls.
- The repeated failure point is translating messy conversation into a consistent scope and handoff.

#### First Operating System
- Build a **Discovery-to-Scope System**.
- It should include intake questions, call summary fields, diagnosis tags, recommended route, open assumptions, and a final scope outline.

#### Human + AI Rules
- Human-led: diagnosis, positioning, recommendation, client promise, final scope.
- AI-assisted: call summary, repeated pattern extraction, first-draft scope, checklist generation, handoff note.
- Automate later: proposal assembly only after the scope structure is stable.

#### 14-Day Build Plan
- Days 1-3: map the current discovery-to-proposal workflow.
- Days 4-6: create the reusable diagnostic intake and synthesis view.
- Days 7-10: test it on 3 past opportunities.
- Days 11-14: refine the output and write usage rules for founder review.

#### Risks To Avoid
- Do not automate proposal writing before the diagnostic logic is stable.
- Do not create a system that only stores notes; it must produce a clear next action.`,
      presence: `### Content & Presence Action Plan

#### Presence Diagnosis
- The presence should prove how the founder thinks, not just announce services.
- The trust gap is whether buyers can see the method behind the diagnosis.

#### Core Narrative
- Repeat this story: scattered business signals become clear strategy, then reusable systems, then useful content.
- Keep the language grounded in clarity, workflows, infrastructure, and practical AI.

#### First Content Moves
- Publish one post on why unclear scope slows founder-led businesses.
- Publish one anonymized workflow map showing discovery-to-scope.
- Rewrite one website section around the diagnostic offer.
- Create one short walkthrough of the intake/synthesis artifact.
- Turn one repeated client question into a practical explainer.

#### 30-Day Presence Plan
- Week 1: finalize the core narrative and offer-page outline.
- Week 2: publish problem/process content.
- Week 3: publish proof-safe workflow artifacts.
- Week 4: refine the website copy from the strongest audience signal.

#### Claims To Avoid
- Do not claim client outcomes or metrics without evidence.
- Do not make AI the headline when the real value is strategic clarity and operating design.`,
    },
  },
  {
    id: 'messy-operations-ai-adoption',
    name: 'Messy Operations AI Adoption',
    answers: {
      phase1_clarity_goal:
        'We run a growing education business and want to use AI, but our internal operations are messy. Before buying tools, we need to understand where AI actually belongs.',
      phase2_audience_problem:
        'The people affected are the operations team, instructors, and students. Everyone feels delays in onboarding, repeated support questions, and inconsistent follow-up.',
      phase3_current_workflow:
        'Student enquiries arrive through forms, calls, and WhatsApp. The team copies details into spreadsheets, manually assigns follow-ups, and instructors often lack context.',
      phase4_main_friction:
        'The biggest friction is handoff. Information gets collected but not converted into clear next actions for the right person.',
      phase5_ai_boundary:
        'Humans should handle student conversations, sensitive decisions, and final approvals. AI could classify enquiries, summarize context, draft responses, and flag urgent cases.',
      phase6_presence_proof:
        'We want our public presence to show that we are organized, responsive, and serious about student outcomes, not just that we use AI.',
    },
    questions: {
      phase2_audience_problem: {
        question: 'Who is this for, and what problem are they already feeling?',
        label: 'Buyer Problem',
        placeholder: 'Describe the buyer and the pain they already recognize...',
        assistantReply:
          'This is the right starting point: do not buy AI tools before the operating problem is named. The next signal is who feels the mess most clearly.',
      },
      phase3_current_workflow: {
        question: 'How does this work today, from first signal to delivered outcome?',
        label: 'Current Workflow',
        placeholder: 'Walk through the current path, even if it is messy...',
        assistantReply:
          'The problem touches several people, which means this is a workflow issue, not a single automation task. We need to see the current path before deciding where AI should assist.',
      },
      phase4_main_friction: {
        question: 'Where is the main friction, delay, or decision confusion?',
        label: 'Main Friction',
        placeholder: 'Name the bottleneck, repeated delay, or unclear decision point...',
        assistantReply:
          'The current workflow is scattered across channels and spreadsheets. That gives us enough to look for the first bottleneck instead of automating the whole system blindly.',
      },
      phase5_ai_boundary: {
        question: 'Which parts need human judgment, and which parts could AI assist?',
        label: 'AI Boundary',
        placeholder: 'Separate judgment, approval, drafting, summarizing, routing, or automation...',
        assistantReply:
          'The handoff is the operating problem. AI should not replace the relationship; it should prepare context and routing so people can respond better.',
      },
      phase6_presence_proof: {
        question: 'What trust, proof, or public presence should this create?',
        label: 'Proof & Presence',
        placeholder: 'Describe the confidence, proof, or narrative this should build...',
        assistantReply:
          'That is a healthy AI boundary. The system can assist classification and context, while people keep control of sensitive communication and decisions.',
      },
      complete: {
        question: 'I have enough context. We are ready to build the blueprint.',
        label: 'Blueprint Ready',
        placeholder: 'Generate the diagnostic blueprint...',
        assistantReply:
          'The operating route is visible now: messy intake, weak handoff, clear human judgment, and a trust-led presence goal. The blueprint can stay practical and reflective.',
      },
    },
    blueprint: {
      strategy: `### Strategy & Clarity Action Plan

#### Strategic Diagnosis
- The business does not need a broad AI rollout yet. It needs one operational lane where better intake and handoff will improve student experience.
- The strongest strategic route is to frame AI as support infrastructure, not as the public promise.

#### Recommended Positioning
- Position the initiative as **responsive student operations**.
- The promise: enquiries and support signals become clear next actions faster, with humans still owning sensitive communication.

#### First Decisions
- Choose the first workflow: enquiry-to-follow-up is the best starting lane.
- Define what counts as urgent, routine, and needs-human-review.
- Decide what student data can be summarized safely and who can see it.

#### 7-Day Action Plan
- Collect 20 recent enquiries and group them by intent.
- Write the first triage rules for urgency, owner, and next action.
- Draft a one-page student response standard for the team.

#### Risks To Avoid
- Do not buy an AI tool before the handoff rules are written.
- Do not publicly claim better outcomes until the workflow is tested and measured.`,
      systems: `### Systems & Workflow Action Plan

#### Workflow Diagnosis
- The handoff is the weak point: information arrives, but it does not reliably become an owned next action.
- Multiple channels are creating scattered context for both operations and instructors.

#### First Operating System
- Build a **Student Enquiry Triage Board**.
- Fields should include source, student need, urgency, owner, next action, instructor context, and review status.

#### Human + AI Rules
- Human-led: student conversations, sensitive cases, exceptions, approvals.
- AI-assisted: enquiry classification, context summary, draft response, urgency flag, routing suggestion.
- Automate later: reminders and status updates after the triage rules prove reliable.

#### 14-Day Build Plan
- Days 1-3: map all enquiry sources and handoffs.
- Days 4-7: build the triage board and response status fields.
- Days 8-11: test with live enquiries and review routing accuracy.
- Days 12-14: document what AI can draft and what must go to a human.

#### Risks To Avoid
- Do not let AI respond directly to sensitive student issues.
- Do not create a dashboard that adds admin work without improving ownership.`,
      presence: `### Content & Presence Action Plan

#### Presence Diagnosis
- The public trust gap is responsiveness and operational care.
- The presence should show that the business is organized around student outcomes, not just using AI.

#### Core Narrative
- Repeat this idea: better internal systems create clearer student follow-through.
- Keep AI as the support layer behind a human-led student experience.

#### First Content Moves
- Rewrite the enquiry/onboarding page around responsiveness and clarity.
- Publish one post about why handoffs matter in student support.
- Create one proof-safe process graphic showing enquiry-to-next-step.
- Publish one internal standard publicly as a trust signal, without private data.
- Turn common student questions into clear explainers.

#### 30-Day Presence Plan
- Week 1: clarify the student-support narrative.
- Week 2: publish process and FAQ content.
- Week 3: show the improved enquiry workflow in proof-safe form.
- Week 4: refine website copy around responsiveness and care.

#### Claims To Avoid
- Do not claim improved response times until measured.
- Do not publish student details, private cases, or unverifiable AI benefits.`,
    },
  },
];
