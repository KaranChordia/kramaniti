import type { SkillDraft, Sample, HumanReview } from "@/lib/kosh/studio/schema";
/** Tab-memory continuity only. Never serialized to browser storage or a URL. */
export type StudioMemory = {
  draft: SkillDraft | null;
  view: "Build" | "Boundaries" | "Test";
  sample: Sample;
  reviews: HumanReview[];
  candidate: { draft: SkillDraft; base: string } | null;
  changeRequest: string;
  context: string;
  customContext: string;
  scroll: Record<"Build" | "Boundaries" | "Test", number>;
};
