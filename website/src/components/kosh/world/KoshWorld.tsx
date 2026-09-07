"use client";
import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { StudioMemory } from "./session";
import styles from "./world.module.css";

type Discovery = { href: string; scroll: number };
const Journey = createContext<{
  discovery: Discovery;
  requestReturn: () => void;
  restoreExplore: () => void;
  readStudio: (key: string) => StudioMemory | undefined;
  writeStudio: (key: string, value: StudioMemory) => void;
  remember: () => void;
} | null>(null);
export function useKoshJourney() {
  return useContext(Journey);
}
export function BackToExplore({
  children = "Explore",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const journey = useKoshJourney();
  const pathname = usePathname();
  return (
    <Link
      href={
        pathname === "/library"
          ? "/library#catalogue"
          : (journey?.discovery.href ?? "/library#catalogue")
      }
      scroll={pathname === "/library"}
      className={className}
      aria-current={
        pathname === "/library" || pathname.startsWith("/library/resources/")
          ? "page"
          : undefined
      }
      onNavigate={(event) => {
        if (pathname === "/library") {
          event.preventDefault();
          document.getElementById("catalogue")?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        } else journey?.requestReturn();
      }}
    >
      {children}
    </Link>
  );
}
export function KoshWorld({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [discovery, setDiscovery] = useState<Discovery>({
    href: "/library#catalogue",
    scroll: 0,
  });
  const returning = useRef(false);
  const memory = useRef<Record<string, StudioMemory>>({});
  const [studioHref, setStudioHref] = useState("/library/create");
  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (Object.values(memory.current).some((session) => session.draft)) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const guardLeavingKosh = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (!link || event.defaultPrevented || link.hasAttribute("download") ||
          link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          !Object.values(memory.current).some((session) => session.draft)) return;
      const destination = new URL(link.href);
      if (destination.origin === location.origin &&
          (destination.pathname === "/library" || destination.pathname.startsWith("/library/"))) return;
      if (!window.confirm("Your skill drafts live only in this tab. Leave Kosh without exporting?"))
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    document.addEventListener("click", guardLeavingKosh, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeLeaving);
      document.removeEventListener("click", guardLeavingKosh, true);
    };
  }, []);
  const readStudio = useCallback((key: string) => memory.current[key], []);
  const writeStudio = useCallback((key: string, value: StudioMemory) => {
    memory.current[key] = value;
  }, []);
  const requestReturn = useCallback(() => {
    returning.current = true;
  }, []);
  const restoreExplore = useCallback(() => {
    if (returning.current) {
      returning.current = false;
      const y = discovery.scroll;
      requestAnimationFrame(() =>
        window.scrollTo({ top: y, behavior: "instant" }),
      );
    }
  }, [discovery.scroll]);
  function remember() {
    if (window.location.pathname === "/library/create")
      setStudioHref(`${window.location.pathname}${window.location.search}`);
    if (window.location.pathname === "/library")
      setDiscovery({
        href: `${window.location.pathname}${window.location.search}#catalogue`,
        scroll: window.scrollY,
      });
  }
  return (
    <Journey.Provider
      value={{
        discovery,
        requestReturn,
        restoreExplore,
        readStudio,
        writeStudio,
        remember,
      }}
    >
      <div
        className={styles.world}
        onClickCapture={(event) => {
          const link = (event.target as Element).closest("a");
          if (!event.defaultPrevented && link) remember();
        }}
      >
        <header className={styles.worldHeader}>
          <Link className={styles.brand} href="/library">
            <Image
              src="/assets/brand/kramaniti-kosh-mark.png"
              width={36}
              height={36}
              alt=""
            />
            <span>
              Kramaniti <b>Kosh</b>
            </span>
          </Link>
          <nav aria-label="Kosh spaces">
            <BackToExplore />
            <Link
              href={studioHref}
              aria-current={
                pathname.startsWith("/library/create") ||
                pathname.startsWith("/library/studio")
                  ? "page"
                  : undefined
              }
            >
              Create
            </Link>
            <Link
              href="/library/workspace"
              aria-current={
                pathname.startsWith("/library/workspace") ||
                pathname.startsWith("/library/account")
                  ? "page"
                  : undefined
              }
            >
              My work
            </Link>
          </nav>
          <Link href="/" className={styles.home}>
            Kramaniti ↗
          </Link>
        </header>
        <div key={pathname} className={styles.scene}>
          {children}
        </div>
      </div>
    </Journey.Provider>
  );
}
