import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./editorial.module.css";
import { KOSH_URL } from "@/lib/seo";

export function KoshNav() {
  return (
    <nav className={styles.nav} aria-label="Kosh navigation">
      <Link href={KOSH_URL} className={styles.brand}>
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
        <Link href={`${KOSH_URL}/#catalogue`}>Browse</Link>
        <Link href={`${KOSH_URL}/#collections`}>Collections</Link>
        <Link href={`${KOSH_URL}/workspace/`}>
          My library <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
