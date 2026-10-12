import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  formatCreatedDate,
  kindLabels,
  type LibraryItem,
} from "@/lib/library/libraryData";
import styles from "./editorial.module.css";
export function ResourceTile({ item }: { item: LibraryItem }) {
  return (
    <Link href={`/kosh/${item.id}`} className={styles.resource}>
      <span className={styles.tileTop}>
        <span className={styles.tileKind}>{kindLabels[item.kind]}</span>
        <time className={styles.tileDate} dateTime={item.created}>
          {formatCreatedDate(item.created)}
        </time>
      </span>
      <div className={styles.tileBody}>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
      <span className={styles.tileFooter}>
        <span>Free to download</span>
        <span>
          Open template <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
