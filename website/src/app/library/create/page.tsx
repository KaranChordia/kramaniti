import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { StudioShell } from "@/components/kosh/studio/StudioShell";
import { blankSkill, slugify } from "@/lib/kosh/studio/schema";
import { libraryItems } from "@/lib/library/libraryData";
import { RESOURCE_VERSION } from "@/lib/library/resourceDetails";
import { workingTemplate } from "@/lib/kosh/resourceContent";
export const metadata: Metadata = {
  title: "Create a skill | Kramaniti Kosh",
  description:
    "Shape, review and export a reusable skill with clear human boundaries.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/library/create" },
};
export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string | string[] }>;
}) {
  const { source } = await searchParams;
  if (!source) return <StudioShell />;
  const item = libraryItems.find((item) => item.id === source);
  if (!item)
    return (
      <StudioShell sourceError="That public resource could not be found. No private artifact was opened." />
    );
  const markdown = await readFile(
    path.join(process.cwd(), "public", item.download),
    "utf8",
  );
  const draft = blankSkill(item.summary);
  draft.title = item.title;
  draft.slug = slugify(item.title);
  draft.summary = item.summary;
  draft.content.useWhen = item.useWhen;
  draft.content.steps = [
    { id: "source-method-1", instruction: workingTemplate(markdown) },
  ];
  draft.source = { resourceId: item.id, version: RESOURCE_VERSION };
  return <StudioShell initialDraft={draft} />;
}
