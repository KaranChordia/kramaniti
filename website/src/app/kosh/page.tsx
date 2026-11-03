import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { koshLandingJsonLd } from "@/lib/kosh/jsonLd";
import { LibraryLanding } from "./LibraryLanding";
import { parseLibrarySort } from "@/lib/library/libraryData";
import { KOSH_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kramaniti Kosh",
  alternates: { canonical: `${KOSH_URL}/` },
  openGraph: { url: `${KOSH_URL}/` },
  description:
    "Practical templates and guides for research, workflows and accountable AI, with examples and setup guidance.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  return (
    <>
      <JsonLd data={koshLandingJsonLd()} />
    <LibraryLanding
      initialQuery={typeof q === "string" ? q.slice(0, 200) : ""}
      initialSort={parseLibrarySort(sort)}
    />
    </>
  );
}
