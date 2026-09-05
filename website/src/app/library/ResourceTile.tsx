import Link from "next/link";
import { Bot, Sparkles, Plug, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { LibraryItem } from "@/lib/library/libraryData";
import styles from "./editorial.module.css";
const icons = {
  Agent: Bot,
  Skill: Sparkles,
  "Plugin guide": Plug,
  Governance: ShieldCheck,
};
export function ResourceTile({ item }: { item: LibraryItem }) {
  const Icon = icons[item.kind];
  return (
    <Link href={`/library/resources/${item.id}`} className={styles.resource}>
      <span className={styles.tileTop}>
        <span className={styles.tileIcon}>
          <Icon size={21} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <span className={styles.tileKind}>{item.kind}</span>
      </span>
      <div className={styles.tileBody}>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
      <span className={styles.tileFooter}>
        <span>Template & example</span>
        <span>
          Open <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
