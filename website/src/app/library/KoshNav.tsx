import Image from "next/image";
import Link from "next/link";
import styles from "./editorial.module.css";

export function KoshNav() {
  return (
    <nav className={styles.nav} aria-label="Kosh navigation">
      <Link href="/library" className={styles.brand}>
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
        <Link href="/library#catalogue">Browse</Link>
        <Link href="/library#collections">Collections</Link>
        <Link href="/library/workspace">
          My library <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </nav>
  );
}
