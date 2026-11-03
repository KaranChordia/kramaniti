import type { Metadata } from "next";
import { TemplateGuide } from "../TemplateGuide";
import styles from "../editorial.module.css";
import assistant from "../assistant.module.css";
import { KOSH_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kosh Assistant | Kramaniti Kosh",
  alternates: { canonical: `${KOSH_URL}/assistant/` },
  openGraph: { url: `${KOSH_URL}/assistant/` },
  description:
    "Describe the work in front of you and Kosh Assistant will help you find a practical template to start with.",
};

export default function KoshAssistantPage() {
  return (
    <main
      id="kosh-main"
      className={`${styles.page} ${assistant.page}`}
      data-disable-global-shockwave="true"
      tabIndex={-1}
    >
      <header className={assistant.hero}>
        <p className={assistant.eyebrow}>Kosh Assistant</p>
        <h1>Start with the work.<br /><em>Find the right template.</em></h1>
        <p>
          Describe what is getting stuck, what you are deciding, or what you
          want your team to handle more clearly. I’ll suggest a practical
          starting point from the Kosh library.
        </p>
      </header>
      <section className={assistant.workspace} aria-label="Kosh Assistant">
        <TemplateGuide />
      </section>
    </main>
  );
}
