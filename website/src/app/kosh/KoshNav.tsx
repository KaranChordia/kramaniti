import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./editorial.module.css";

export function KoshNav() {
  return (
    <nav className={styles.nav} aria-label="Kosh navigation">
      <Link href="/kosh" className={styles.brand}>
        <Image
          src="/assets/brand/kramaniti-kosh-mark.png"
          width={42}
          height={42}
          alt=""
        />
        <span>
          Kramaniti <b>Kosh</b>
        </span>
      </Link>
      <div>
        <Link href="/kosh#catalogue">Browse</Link>
        <Link href="/kosh#collections">Collections</Link>
        <Link href="/kosh/workspace">
          My library <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
