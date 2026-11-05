import type { Metadata } from "next";
import { KoshStage } from "./KoshStage";

export const metadata: Metadata = {
  title: "Kosh fixed-stage prototype",
  description: "A local interaction prototype for a viewport-contained Kosh workspace.",
  robots: { index: false, follow: false },
};

export default async function KoshPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{
    scene?: string | string[];
    item?: string | string[];
    step?: string | string[];
  }>;
}) {
  const params = await searchParams;
  return (
    <KoshStage
      initialScene={typeof params.scene === "string" ? params.scene : undefined}
      initialItem={typeof params.item === "string" ? params.item : undefined}
      initialStep={typeof params.step === "string" ? params.step : undefined}
    />
  );
}
