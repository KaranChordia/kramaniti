import { libraryItems, kindLabels } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";

export type DiscoveryMessage = { role: "user" | "assistant"; content: string };
export type DiscoveryAnswer = {
  reply: string;
  recommendations: { id: string; reason: string }[];
  followUps: string[];
  mode: "assistant" | "catalogue";
};
export type DiscoveryTurn = { question: string; answer: DiscoveryAnswer };
export const discoveryStarters = [
  "Customer enquiries are piling up",
  "Work keeps waiting for the founder",
  "We have too many AI tools",
];
export const MAX_DISCOVERY_TURNS = 8;
export const MAX_DISCOVERY_MESSAGE = 1000;

// One server-owned catalogue, shared by model context and outage suggestions.
export const discoveryCatalogue = libraryItems.map((item) => ({
  id: item.id,
  title: item.title,
  format: kindLabels[item.kind],
  category: item.category,
  summary: item.summary,
  useWhen: item.useWhen,
  outcome: resourceDetails[item.id].outcome,
  limit: resourceDetails[item.id].limit,
}));

export function parseDiscoveryMessages(value: unknown): DiscoveryMessage[] | null {
  if (!Array.isArray(value) || !value.length || value.length > MAX_DISCOVERY_TURNS * 2 - 1 || value.length % 2 !== 1) return null;
  const messages: DiscoveryMessage[] = [];
  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== "object" ||
      entry.role !== (index % 2 === 0 ? "user" : "assistant") ||
      typeof entry.content !== "string" || !entry.content.trim() ||
      entry.content.length > (entry.role === "user" ? MAX_DISCOVERY_MESSAGE : 1200)) return null;
    messages.push({ role: entry.role, content: entry.content.trim() });
  }
  return messages;
}

export function parseDiscoveryAnswer(value: unknown): DiscoveryAnswer | null {
  if (!value || typeof value !== "object") return null;
  const answer = value as Record<string, unknown>;
  if (typeof answer.reply !== "string" || !answer.reply.trim() || answer.reply.length > 1000 ||
    !Array.isArray(answer.recommendations) || answer.recommendations.length > 3 ||
    !Array.isArray(answer.followUps) || answer.followUps.length > 3) return null;
  const recommendations: DiscoveryAnswer["recommendations"] = [];
  for (const entry of answer.recommendations) {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" ||
      !libraryItems.some((item) => item.id === entry.id) ||
      typeof entry.reason !== "string" || !entry.reason.trim() || entry.reason.length > 300 ||
      recommendations.some((item) => item.id === entry.id)) return null;
    recommendations.push({ id: entry.id, reason: plainText(entry.reason) });
  }
  if (!answer.followUps.every((text) => typeof text === "string" && text.trim() && text.length <= 100)) return null;
  return { reply: plainText(answer.reply), recommendations, followUps: answer.followUps.map((text: string) => plainText(text)), mode: "assistant" };
}

// Keep prose readable even if a provider slips Markdown or internal identifiers into it.
function plainText(text: string): string {
  let result = text.trim().replace(/\*\*|`/g, "").replace(/[\u2010\u2011]/g, "-");
  for (const item of libraryItems) result = result.replaceAll(item.id, item.title);
  return result;
}

const synonyms: Record<string, string> = {
  "research-synthesis-agent": "research evidence sources compare investigate decision brief",
  "workflow-diagnostic-skill": "process workflow slow delays handoffs stuck messy",
  "source-checking-skill": "facts claims verify publish evidence accuracy check",
  "plugin-evaluation-guide": "plugin permissions connect app integration access security",
  "agent-brief-template": "assistant instructions job scope agent brief recurring",
  "human-review-gate": "approval signoff sign-off important sending review",
  "exception-log": "errors wrong mistakes corrections overrides repeat ai",
  "enquiry-triage-agent": "customer enquiries inquiries whatsapp email replies inbox piling",
  "builder-exit-handover-test": "builder leaving handover absence maintenance run fix",
  "founder-memory-sop-agent": "founder knowhow knowledge sop steps document instructions",
  "adoption-packet-skill": "team rules adoption ai policy client data",
  "client-onboarding-handoff-brief": "onboard onboarding sales delivery client handoff scope",
  "non-build-list-register": "ideas prioritize prioritise build defer reject ai",
  "conditional-founder-review-rules": "founder waiting approvals review bottleneck signoff",
  "bottleneck-interview-guide": "interview people waiting bottleneck slow process",
  "constraint-pick-sheet": "constraint priority problem fix first build",
  "proposal-quote-drafting-brief": "proposal proposals quote quotes prices pricing scope promises",
  "ai-tool-subscription-audit": "subscriptions tools apps audit paying costs duplicate too many",
  "digital-readiness-baseline": "digital paper notebooks registers information software",
  "repeated-question-log": "questions repeated repetitive answers knowledge faq",
  "test-before-build-sheet": "test pilot experiment validate before build",
  "customer-handoff-plan": "customer chat complaints escalate escalation human handover chatbot",
  "decision-record": "decisions why owner record chat meetings exceptions",
  "review-reply-brief": "reviews review ratings google zomato swiggy reply replies complaints stars",
};
const ignored = new Set("a an the i we our my me us you your to for of in on at it is are was be have has with and or but do does can should need want help work business team keeps how what which too".split(" "));
function words(text: string) {
  return [...new Set(text.toLowerCase().match(/[\p{L}\p{N}-]+/gu) ?? [])].filter((word) => word.length > 2 && !ignored.has(word));
}

export function catalogueDiscovery(messages: DiscoveryMessage[]): DiscoveryAnswer {
  const latest = words(messages.at(-1)?.content ?? "");
  const earlier = words(messages.filter((message) => message.role === "user").slice(0, -1).map((message) => message.content).join(" "));
  const ranked = discoveryCatalogue.map((item) => {
    const cues = new Set(words(synonyms[item.id] ?? ""));
    const text = new Set(words(`${item.title} ${item.summary} ${item.useWhen}`));
    const score = (terms: string[]) => terms.reduce((sum, term) => sum + (cues.has(term) ? 3 : text.has(term) ? 1 : 0), 0);
    return { item, score: score(latest) + score(earlier) * 0.25 };
  }).filter((entry) => entry.score >= 3).sort((a, b) => b.score - a.score).slice(0, 3);
  return {
    reply: ranked.length
      ? "These public templates may be useful starting points. Open one to check its method, example and limits against your situation."
      : "I couldn’t find a clear match in the catalogue. Which task needs help: answering customers, fixing a slow process, checking facts, or choosing tools?",
    recommendations: ranked.map(({ item }) => ({ id: item.id, reason: item.summary })),
    followUps: ranked.length ? [] : [...discoveryStarters],
    mode: "catalogue",
  };
}

export function discoveryHistory(turns: DiscoveryTurn[]): DiscoveryMessage[] {
  return turns.flatMap(({ question, answer }) => [
    { role: "user" as const, content: question },
    { role: "assistant" as const, content: `${answer.reply.slice(0, 800)}${answer.recommendations.length ? `\nSuggested templates: ${answer.recommendations.map(({ id }) => libraryItems.find((item) => item.id === id)?.title ?? id).join("; ")}` : ""}`.slice(0, 1200) },
  ]);
}
