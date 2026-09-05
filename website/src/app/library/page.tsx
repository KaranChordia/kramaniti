import type { Metadata } from "next";
import { LibraryLanding } from "./LibraryLanding";

export const metadata: Metadata = {
  title: "Kramaniti Kosh",
  alternates: { canonical: "/library" },
  description:
    "Practical templates and guides for research, workflows and accountable AI, with examples and setup guidance.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  return <LibraryLanding initialKind={kind} />;
}
