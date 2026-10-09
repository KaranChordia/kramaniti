import type { Metadata } from "next";
import { LibraryLanding } from "./LibraryLanding";
import { parseLibrarySort } from "@/lib/library/libraryData";

export const metadata: Metadata = {
  title: "Kramaniti Kosh",
  alternates: { canonical: "/library" },
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
    <LibraryLanding
      initialQuery={typeof q === "string" ? q.slice(0, 200) : ""}
      initialSort={parseLibrarySort(sort)}
    />
  );
}
