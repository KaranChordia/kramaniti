import { ResourceSpace } from "@/components/kosh/resource/ResourceSpace";
import { resourceSections } from "@/lib/kosh/resourceSections";
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { libraryItems } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import { workingTemplate } from "@/lib/kosh/resourceContent";

export function generateStaticParams() {
  return libraryItems.map((item) => ({ id: item.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = libraryItems.find((item) => item.id === id);
  return item
    ? {
        title: `${item.title} | Kramaniti Kosh`,
        description: item.summary,
        alternates: { canonical: `/library/resources/${id}` },
      }
    : { title: "Resource not found | Kosh" };
}
export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = libraryItems.find((item) => item.id === id);
  if (!item) notFound();
  const detail = resourceDetails[id];
  const markdown = await readFile(
    path.join(process.cwd(), "public", item.download),
    "utf8",
  );
  return (
    <ResourceSpace
      key={item.id}
      item={item}
      detail={detail}
      markdown={markdown}
      original={`# ${item.title}\n\n${workingTemplate(markdown)}`}
      sections={resourceSections(markdown)}
      related={detail.related.map((id) =>
        libraryItems.find((entry) => entry.id === id)!,
      )}
    />
  );
}
