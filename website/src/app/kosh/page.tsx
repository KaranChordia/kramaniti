import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { koshLandingJsonLd } from "@/lib/kosh/jsonLd";
import { KoshStage } from "./KoshStage";
import { parseLibrarySort } from "@/lib/library/libraryData";
import { KOSH_URL, OG_BASE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kramaniti Kosh",
  alternates: { canonical: `${KOSH_URL}/` },
  openGraph: { ...OG_BASE, url: `${KOSH_URL}/` },
  description:
    "Practical templates and guides for research, workflows and accountable AI, with examples and setup guidance.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    sort?: string | string[];
    scene?: string | string[];
    item?: string | string[];
    step?: string | string[];
  }>;
}) {
  const { q, sort, scene, item, step } = await searchParams;
  return (
    <>
      <JsonLd data={koshLandingJsonLd()} />
      <KoshStage
        initialQuery={typeof q === "string" ? q.slice(0, 200) : ""}
        initialSort={parseLibrarySort(typeof sort === "string" ? sort : undefined)}
        initialScene={typeof scene === "string" ? scene : undefined}
        initialItem={typeof item === "string" ? item : undefined}
        initialStep={typeof step === "string" ? step : undefined}
      />
    </>
  );
}
