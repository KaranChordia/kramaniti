export type ResourceDetail = {
  outcome: string;
  question: string;
  requires: string[];
  check: string;
  limit: string;
  related: string[];
};

export const RESOURCE_VERSION = "1.1";
export const resourceDetails: Record<string, ResourceDetail> = {
  "research-synthesis-agent": {
    outcome:
      "A research brief with evidence you can trace and a decision someone can own.",
    question:
      "What decision will this research support, and which sources may it use?",
    requires: [
      "One specific decision question",
      "Approved documents or source links",
      "A decision owner and deadline",
    ],
    check:
      "Every material claim has a source or uncertainty label; the recommendation stays within the evidence; a named person owns the decision.",
    limit:
      "This template cannot verify sources that you have not supplied or that your chosen assistant cannot access.",
    related: ["source-checking-skill", "human-review-gate"],
  },
  "workflow-diagnostic-skill": {
    outcome:
      "A clear process map and the smallest useful improvement to investigate.",
    question:
      "Which recurring process is causing friction, and where does work wait or repeat?",
    requires: [
      "The current steps and handoffs",
      "People responsible for each step",
      "Examples of delays or exceptions",
    ],
    check:
      "The map reflects a real instance; observed friction is separate from suspected causes; the next intervention has an owner and a review point.",
    limit:
      "A process description alone does not establish the cause, cost, or frequency of a delay.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "source-checking-skill": {
    outcome: "A draft whose claims are traceable, qualified, or removed.",
    question:
      "Which draft needs checking, and what evidence is approved for its claims?",
    requires: [
      "The exact draft to check",
      "Source documents or links",
      "A named reviewer for public or sensitive claims",
    ],
    check:
      "No stronger claim survives than the source supports; source links are retained; public permission and factual support are considered separately.",
    limit:
      "A source can support a claim without granting permission to publish it. This method is not specialist legal or financial review.",
    related: ["research-synthesis-agent", "human-review-gate"],
  },
  "plugin-evaluation-guide": {
    outcome:
      "A recorded connection decision with permissions, ownership and a failure plan.",
    question:
      "What job would this connection perform, and what access does it request?",
    requires: [
      "The specific plugin and current documentation",
      "Requested permissions and intended data",
      "An owner who can approve and revoke access",
    ],
    check:
      "Every permission has a reason; unknown retention or access behaviour stays visible; a named owner can disable the connection.",
    limit:
      "Permissions and provider behaviour change. Recheck current documentation before connecting; no plugin compatibility is implied.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "agent-brief-template": {
    outcome:
      "An accountable agent brief with a bounded job and a clear handoff.",
    question:
      "What recurring job should the agent support, and what must remain with a person?",
    requires: [
      "One recurring job and its outcome",
      "Approved inputs and exclusions",
      "An owner and a receiving person or team",
    ],
    check:
      "The job is specific; inputs and exclusions are explicit; the sample test includes a stop condition; the receiving owner is named.",
    limit:
      "A well-written brief does not prove runtime reliability or grant access to tools. Test it in the intended environment.",
    related: ["plugin-evaluation-guide", "human-review-gate"],
  },
  "human-review-gate": {
    outcome: "An explicit approval decision with evidence and a next owner.",
    question:
      "What exact action needs approval, and who is authorised to decide?",
    requires: [
      "The proposed action or final wording",
      "Evidence, assumptions and unresolved questions",
      "An authorised decision owner",
    ],
    check:
      "The exact action is visible; recommendations and approvals are distinct; the decision record is completed by the authorised owner.",
    limit:
      "The template records a decision. It does not establish a person\u2019s authority or replace approval required by the organisation.",
    related: ["source-checking-skill", "workflow-diagnostic-skill"],
  },
  "exception-log": {
    outcome:
      "A shared record of each time someone had to step in, so repeat problems get fixed once, with a named person responsible.",
    question:
      "Where does your team keep having to fix the AI’s work, and who will look over the record?",
    requires: [
      "One live workflow where people regularly correct, override or escalate",
      "A shared table or sheet placed beside that workflow",
      "A named owner who reviews the log on a fixed day",
    ],
    check:
      "Every entry says what was expected and what happened; each reviewed pattern ends in one outcome with an owner; urgent cases went to a person the same day rather than waiting for review.",
    limit:
      "A log shows what people noticed and recorded, not everything that went wrong, so treat counts as signals rather than measurements. It does not decide which changes are worth making; the named owner does.",
    related: ["human-review-gate", "workflow-diagnostic-skill"],
  },
  "enquiry-triage-agent": {
    outcome:
      "Every enquiry is sorted and either answered from information you have approved or passed to the right person, and nothing is sent without a person agreeing to it.",
    question:
      "Which enquiries can be answered from information you already give out, and which must always go to a person?",
    requires: [
      "A sample of recent real enquiries from WhatsApp and email",
      "The approved answers you already give (price list, stock rules, timings, delivery areas)",
      "A named person for each type of enquiry that needs a human call",
    ],
    check:
      "Every reply is built only from the approved information; money, complaints and delivery promises always reach a person; nothing is sent without approval during the trial; the weekly log shows which drafts were edited and why.",
    limit:
      "This brief does not connect to WhatsApp or email by itself, and it cannot check stock, orders or payments it has not been given. Check your messaging provider’s current rules on automated and business messages, and your obligations for customer data, before connecting any tool.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "builder-exit-handover-test": {
    outcome:
      "A clear answer on whether your team can run, pause and fix the process without the person who built it, plus a short list of what to sort out before more people use it.",
    question:
      "If the person who built this left tomorrow, could the person who uses it every day run it, pause it and fix it?",
    requires: [
      "One workflow already in use, manual or AI-assisted",
      "The person who runs it day to day, and someone who has not built it",
      "An hour when the builder can stay present but silent",
    ],
    check:
      "The test was run with the operator, not the builder, doing the work; every No or Partly answer has a fix with an owner; recovery cards have safe actions that do not depend on the builder; the decision owner signed the result.",
    limit:
      "This test checks whether ownership, instructions and recovery steps exist. It does not prove the workflow is accurate, secure or compliant, and a few practice cases will not show every failure.",
    related: ["exception-log", "human-review-gate"],
  },
  "founder-memory-sop-agent": {
    outcome:
      "Written steps built only from what the founder actually said, with gaps sent back as questions and nothing treated as the rule until the founder approves it.",
    question:
      "Which routine task keeps coming back to the founder, and who will follow the written version?",
    requires: [
      "A recorded walkthrough, voice note transcript or written notes from the founder about one routine task",
      "The person who will follow the procedure day to day",
      "Time set aside for the founder to review the draft and answer its questions",
    ],
    check:
      "Every step traces back to something the founder said; guesses appear as open questions rather than rules; judgment calls are marked as decision points; the founder has approved the version in use and it is stored where the team works.",
    limit:
      "The extractor can only capture what the founder said in one walkthrough, and a single example rarely covers every case. It does not check whether the procedure meets legal, regulatory or professional requirements; that stays with the responsible professional.",
    related: ["workflow-diagnostic-skill", "source-checking-skill"],
  },
  "adoption-packet-skill": {
    outcome:
      "One page that tells a small team how to use a new AI tool in daily work: what it is for, what stays with people, when to ignore it and who to ask when it goes wrong.",
    question:
      "What can the team use the AI for, what stays with people, and who helps when it goes wrong?",
    requires: [
      "One workflow that is about to go live, or that people already use informally",
      "The person accountable for the workflow and the person who will answer questions about it",
      "Your rules on which client information may go into which tools",
    ],
    check:
      "A new team member could use the workflow from the packet alone; client information rules are specific; every client-facing output has a named reviewer; the support route names a real person; the packet has a version and an owner.",
    limit:
      "The packet sets out how the team should work; it does not make a tool secure or confirm what a provider does with the data you enter. Check each tool’s current terms and your client agreements before use.",
    related: ["builder-exit-handover-test", "exception-log"],
  },
  "client-onboarding-handoff-brief": {
    outcome:
      "A complete handoff from sales to delivery for each new client, with named owners, a clear scope boundary, and an onboarding assistant that only prepares work a person has agreed to.",
    question:
      "What must sales pass to delivery before work starts, and what may an onboarding assistant never do alone?",
    requires: [
      "One recent closed deal where delivery still had to chase sales for missing details",
      "The list of what delivery needs before work can start (scope, contacts, approvals, files)",
      "Named owners in sales and delivery who will keep the handoff honest",
    ],
    check:
      "Every sold item and open promise is written down; blanks and chat-only extras are flagged; the assistant only drafts organisation and checklists; sales and delivery owners are named; delivery has accepted or refused the pack in writing before work is treated as started.",
    limit:
      "This brief does not connect to your CRM, email or file store by itself, and it cannot invent missing commercial or legal detail. Check your client agreements and any rules on where client files may be stored before you connect tools.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "non-build-list-register": {
    outcome:
      "A short register of AI ideas, each with a clear decision, a reason, a named owner and a date to look again.",
    question:
      "Which AI ideas will you build, assist, keep with people, defer or reject, and who owns each call?",
    requires: [
      "A list of AI ideas people have suggested, even if rough or unfinished",
      "Someone who can decide what the organisation will and will not spend time on",
      "A shared place for the register that the team can find again",
    ],
    check:
      "Every idea has one decision option, a reason code, a named owner and a review date (or a clear reject); money and customer-promise ideas stay with a person; blanks are visible rather than filled with guesses.",
    limit:
      "The register records choices; it does not prove an idea would work, save money or be safe to run. Reason codes are labels for discussion, not a scoring system.",
    related: ["human-review-gate", "workflow-diagnostic-skill"],
  },
  "conditional-founder-review-rules": {
    outcome:
      "A short set of rules that say which work needs founder sign-off and which can move with a lighter check, so the founder stops being a permanent review queue.",
    question:
      "Which work still needs the founder, and which can move with a named deputy, peer check or log?",
    requires: [
      "A list of the recurring work that currently waits on the founder",
      "Named people who can act as deputy or peer reviewer when a lighter path is allowed",
      "A shared place for the rules that the team can find again",
    ],
    check:
      "Every category has one default path, a reason, a time limit and an escalation; founder-only triggers are written down; lighter paths name the deputy or peer and the log; blanks stay visible rather than filled with guesses.",
    limit:
      "The rules record who may decide; they do not prove a decision was wise, lawful or safe. A lighter path is not approval for money, legal wording or a new customer promise.",
    related: ["human-review-gate", "exception-log"],
  },
  "bottleneck-interview-guide": {
    outcome:
      "A short interview record that shows where work waits, repeats or depends on one person, so you can choose what to fix before you buy or build anything.",
    question:
      "Where does work wait, repeat or depend on one person, and what should you fix first?",
    requires: [
      "Permission from the owner to talk with the people who do the work",
      "One recurring process that already feels slow or fragile",
      "A quiet place and enough time for a short, honest conversation",
    ],
    check:
      "Both who-to-ask roles are covered or the gap is noted; the capture table has visible blanks where answers were unclear; one bottleneck has interview evidence, a named owner and a review date; no tools, costs or frequencies were invented.",
    limit:
      "The interview shows where people say work waits; it does not prove cost, frequency or the right tool. Notes are not a substitute for clinical, legal or financial judgment.",
    related: ["workflow-diagnostic-skill", "founder-memory-sop-agent"],
  },
  "constraint-pick-sheet": {
    outcome:
      "A one-page sheet that names the single constraint to address first, with evidence, a named owner and a plain picture of what better looks like, before anyone picks a tool.",
    question:
      "Which one constraint should you address first, and what evidence shows it is the limiting point?",
    requires: [
      "A short picture of how work moves today for one route that already feels stuck",
      "Someone who can decide what the organisation will focus on first",
      "Agreement that no tool or build choice will be made until this sheet is filled",
    ],
    check:
      "The sheet has one decision option, one constraint statement, evidence with visible blanks where facts are missing, a named owner and a review date; no tool, cost or frequency was invented before the sheet was filled.",
    limit:
      "The sheet records which constraint you chose to address first; it does not prove cost, frequency or the right tool. A filled sheet is not approval to buy software or to change what customers are promised.",
    related: ["workflow-diagnostic-skill", "non-build-list-register"],
  },
  "proposal-quote-drafting-brief": {
    outcome:
      "A draft proposal or quote built only from agreed scope notes and your own rate card, with every price, discount, timeline, claim and term checked by a named person before it reaches the client.",
    question:
      "Which scope notes and rates may the draft use, and who must approve the prices and promises before it is sent?",
    requires: [
      "Written scope notes from the client conversation, agreed by whoever ran it",
      "Your current rate card and standard terms, kept as the only source of prices",
      "A named person who approves prices, discounts, dates, claims and terms before anything is sent",
    ],
    check:
      "Every price traces to the rate card and every scope line to an agreed note; anything without a source is a visible blank; discounts, dates, claims and terms are on the review list; the named reviewer has recorded a decision before the client sees it.",
    limit:
      "The brief prepares a draft for review. It cannot decide what to charge, confirm your team has capacity or check that a term is legally or tax correct, and a draft is not approval to send.",
    related: ["human-review-gate", "client-onboarding-handoff-brief"],
  },
  "ai-tool-subscription-audit": {
    outcome:
      "A one-page list of every AI tool the team uses, with the job each one does, who looks after it, what data it can see and one clear decision to keep, change, merge or stop it, before anyone adds the next subscription.",
    question:
      "Which AI tools does the team pay for, what job does each one do, and which should you keep, merge or stop?",
    requires: [
      "Access to the bills, card statements or admin pages where AI tools are paid for",
      "A few minutes with each person who uses an AI tool for work, to ask what they use it for",
      "Someone who can decide what to keep, change or stop, and who knows who pays for each tool",
    ],
    check:
      "Every tool has a named job or a No clear job flag, an owner, the data it can see and one decision; costs, renewal dates and usage come from bills or the people asked, with blanks left visible; nothing was cancelled or changed before the owner agreed.",
    limit:
      "The audit shows what you use and why; it does not prove that a tool is secure, compliant or good value, and it does not check vendor terms. A filled list is not approval to cancel, buy or change anyone’s access.",
    related: ["plugin-evaluation-guide", "non-build-list-register"],
  },
  "digital-readiness-baseline": {
    outcome:
      "A one-page record of where each piece of business information lives today, who holds it and what goes wrong if that person is away, with one small, safe first digital step that has an owner and a way to check it worked, before anyone buys software or AI.",
    question:
      "Where does your business information live today, who holds each piece, and what is the one safe first step to take it digital?",
    requires: [
      "Time to look at the registers, notebooks, spreadsheets, chat groups and accounting software the business already uses",
      "A short chat with each person who keeps a piece of information that the business depends on",
      "Someone who can decide the first step and who will not buy any new software until this record is filled",
    ],
    check:
      "Every piece of information has where it lives, who holds it, a risk rating and any flags; facts come from the people asked, with blanks left visible; there is one first step with an owner, a start date and a way to check it worked; nothing was bought and the old way was not stopped before the check passed.",
    limit:
      "The baseline records where information lives and who the business depends on; it does not prove that a tool is right, safe or worth paying for, and it does not check data protection or accounting rules. A filled record is not approval to buy software, move customer or staff details, or stop the paper register.",
    related: ["bottleneck-interview-guide", "founder-memory-sop-agent"],
  },
  "repeated-question-log": {
    outcome:
      "A simple log of the questions customers and staff keep asking, who asks, who answers, where the answer is kept today and what the asker needed to decide, with one repeated question chosen to get an agreed answer in one agreed place, owned by a named person, before anyone builds a bot, an FAQ page or a new form.",
    question:
      "Which questions does your business answer again and again, where do those answers live today, and which one should get a proper answer first?",
    requires: [
      "Two to four weeks of real questions from calls, WhatsApp, email, the counter and staff chats, or a few days of writing them down as they arrive",
      "A short chat with the people who answer questions most often",
      "Someone who can approve what the correct answer is and where it should be kept",
    ],
    check:
      "Every repeated question has its count taken from the log, who asks, who answers, where the answer is kept today and any flags; different answers are recorded rather than smoothed over; one answer card has an approved answer, one place to live, an owner and a review date; nothing was built and no money or warranty answer was set to go out automatically.",
    limit:
      "The log shows which questions repeat and where the answers sit; it does not prove that a bot, FAQ page or form is the right fix, and it does not check consumer, warranty or data protection rules. An approved answer card is not approval to automate replies or to promise anything new to customers.",
    related: ["enquiry-triage-agent", "founder-memory-sop-agent"],
  },
  "test-before-build-sheet": {
    outcome:
      "A one-page sheet that names the workflow, who uses it, what starts it, what \"done\" looks like in real work, safe sample inputs, expected behaviour, fail and stop conditions, evidence to keep, a named owner and a review date, written and agreed before anyone builds or buys anything.",
    question:
      "How will you know this workflow works in real use, before anyone builds or buys a tool for it?",
    requires: [
      "One workflow the team wants to change or support, described in plain words",
      "Someone who does that work today, and someone who can decide what \"working\" means",
      "Agreement that no build, bot, app or hire will start until this sheet is filled",
    ],
    check:
      "The sheet names one workflow, who uses it, the trigger, what \"done\" looks like, safe sample inputs, expected behaviour, fail and stop conditions, evidence to keep, a named owner and a review date; blanks stay visible where facts are missing; no pass rates or results were invented; nothing was built or bought before the sheet was filled.",
    limit:
      "The sheet records how you will know the workflow works; it does not prove that a tool is right, safe or worth paying for, and it does not check medical, data protection or consumer rules. A filled sheet is not approval to send reminders, give clinical advice, change fees or turn on automation.",
    related: ["constraint-pick-sheet", "human-review-gate"],
  },
};

export const researchCollection = [
  {
    id: "research-synthesis-agent",
    step: "Frame the decision",
    handoff: "Produce the evidence brief and name what is still unknown.",
  },
  {
    id: "source-checking-skill",
    step: "Check the claims",
    handoff: "Carry the brief forward. Verify the wording against its sources.",
  },
  {
    id: "human-review-gate",
    step: "Make the human call",
    handoff:
      "Present the checked brief and exact next action to the decision owner.",
  },
];
