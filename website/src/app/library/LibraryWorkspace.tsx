"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useKramanitiTheme } from "@/hooks/useKramanitiTheme";
import {
  getKoshSupabase,
  isKoshSupabaseConfigured,
  type KoshWorkingCopy,
} from "@/lib/kosh/supabase";
import { parseKoshContext, serializeKoshContext } from "@/lib/kosh/context";
import { libraryItems } from "@/lib/library/libraryData";
import { KoshNav } from "./KoshNav";
import { KoshAuth } from "./KoshAuth";
import { ResourceTile } from "./ResourceTile";
import { ResourceCatalogue } from "./ResourceCatalogue";
import styles from "./editorial.module.css";

type CopySummary = Pick<
  KoshWorkingCopy,
  "id" | "title" | "template_id" | "template_version" | "updated_at"
>;
export function LibraryWorkspace() {
  const { theme, toggleTheme } = useKramanitiTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isKoshSupabaseConfigured);
  const [view, setView] = useState<"Library" | "Saved" | "Settings">("Library");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copies, setCopies] = useState<CopySummary[]>([]);
  const [context, setContext] = useState({ personal: "", professional: "" });
  const [profileReady, setProfileReady] = useState(false);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const accountRef = useRef<string | null>(null);
  const userId = user?.id;
  useEffect(() => {
    let alive = true;
    const supabase = getKoshSupabase();
    if (!supabase) return;
    const update = (next: User | null) => {
      if (!alive) return;
      if (accountRef.current !== (next?.id ?? null)) {
        setBookmarks([]);
        setCopies([]);
        setContext({ personal: "", professional: "" });
        setProfileReady(false);
        setMessage("");
        setCopyMessage("");
      }
      accountRef.current = next?.id ?? null;
      setUser(next);
      setLoading(false);
    };
    supabase.auth
      .getSession()
      .then(({ data }) => {
        update(data.session?.user ?? null);
      })
      .catch(() => {
        if (alive) {
          setLoading(false);
          setMessage("Could not load your session. Please sign in again.");
        }
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      update(session?.user ?? null);
    });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    let alive = true;
    const supabase = getKoshSupabase();
    if (userId && supabase)
      Promise.all([
        supabase
          .from("profiles")
          .select("context")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("template_bookmarks")
          .select("template_id")
          .eq("user_id", userId),
        supabase
          .from("working_copies")
          .select("id,title,template_id,template_version,updated_at")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
      ])
        .then(([profile, saved, drafts]) => {
          if (!alive) return;
          if (profile.error || !profile.data)
            setMessage(
              "Your profile could not be loaded. Reload before editing saved context.",
            );
          else {
            setContext(parseKoshContext(profile.data.context));
            setProfileReady(true);
          }
          if (saved.error)
            setMessage("Your favourites could not be loaded. Please reload.");
          else setBookmarks((saved.data ?? []).map((row) => row.template_id));
          if (drafts.error)
            setCopyMessage(
              "Saved working copies are unavailable in this environment. Originals and downloads are still available.",
            );
          else setCopies(drafts.data ?? []);
        })
        .catch(() => {
          if (alive)
            setMessage("Could not connect to your library. Please reload.");
        });
    return () => {
      alive = false;
    };
  }, [userId]);
  async function saveContext(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getKoshSupabase();
    if (!supabase || !user || !profileReady) return;
    setBusy(true);
    setMessage("");
    try {
      const { error, data } = await supabase
        .from("profiles")
        .update({
          context: serializeKoshContext(context),
          context_updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select("context")
        .single();
      if (error || !data)
        throw new Error(
          "Context could not be saved. Your edits are still here.",
        );
      setMessage(
        "Context saved privately. You choose when and where it is used.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save context.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    const supabase = getKoshSupabase();
    if (!supabase) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setView("Library");
    } catch {
      setMessage("Sign out failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <header className={styles.resourceHero}>
        <p className={styles.eyebrow}>Your Kosh workspace</p>
        <h1>{user ? "Keep useful work close." : "A library of your own."}</h1>
        <p>
          {user
            ? "Return to favourites, continue a working copy, or choose the context that makes a template yours."
            : "Explore every resource publicly. Sign in to keep favourites, save private working copies and adapt templates to your context."}
        </p>
        {!user && (
          <Link className={styles.textLink} href="/library#catalogue">
            Explore without an account ↗
          </Link>
        )}
      </header>
      {loading ? (
        <p role="status">Checking your account…</p>
      ) : !user ? (
        <KoshAuth />
      ) : (
        <>
          <nav className={styles.actions} aria-label="Workspace views">
            {(["Library", "Saved", "Settings"] as const).map((label) => (
              <button
                key={label}
                className={styles.secondary}
                aria-pressed={view === label}
                onClick={() => setView(label)}
              >
                {label}
              </button>
            ))}
          </nav>
          {view === "Library" && (
            <section className={styles.section}>
              <h2>Find your next starting point.</h2>
              <ResourceCatalogue />
            </section>
          )}
          {view === "Saved" && (
            <section className={styles.section}>
              <h2>Favourites</h2>
              {bookmarks.length ? (
                <div className={styles.catalogue}>
                  {libraryItems
                    .filter((item) => bookmarks.includes(item.id))
                    .map((item) => (
                      <ResourceTile key={item.id} item={item} />
                    ))}
                </div>
              ) : (
                <p>
                  No favourites yet. Open a resource and choose “Save to
                  favourites.”
                </p>
              )}
              <h2 style={{ marginTop: 50 }}>Your working copies</h2>
              {copyMessage ? (
                <p role="status">{copyMessage}</p>
              ) : !copies.length ? (
                <p>
                  No saved copies yet. Edit a resource and save it privately to
                  return to it here.
                </p>
              ) : (
                <ul className={styles.copyList}>
                  {copies.map((copy) => (
                    <li key={copy.id}>
                      <Link
                        href={`/library/resources/${copy.template_id}?copy=${copy.id}#make-it-yours`}
                      >
                        {copy.title} ↗
                      </Link>
                      <span className={styles.caption}>
                        Source v{copy.template_version}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {view === "Settings" && (
            <section className={styles.workbench}>
              <h2>The context you choose.</h2>
              <p>
                Personal and professional profiles stay separate. A saved
                profile is sent to Groq only when you explicitly choose it for
                an adaptation.
              </p>
              <form className={styles.form} onSubmit={saveContext}>
                <label>
                  Personal context
                  <textarea
                    disabled={!profileReady || busy}
                    maxLength={4000}
                    value={context.personal}
                    onChange={(e) =>
                      setContext({ ...context, personal: e.target.value })
                    }
                    placeholder="Goals, preferences, personal projects and boundaries."
                  />
                </label>
                <label>
                  Professional context
                  <textarea
                    disabled={!profileReady || busy}
                    maxLength={4000}
                    value={context.professional}
                    onChange={(e) =>
                      setContext({ ...context, professional: e.target.value })
                    }
                    placeholder="Your work, audience, constraints and approval boundaries."
                  />
                </label>
                <p className={styles.caption}>
                  To remove a profile, clear its text and save. Only save
                  information you are authorised to share with the model when
                  you request an adaptation.
                </p>
                <button
                  disabled={busy || !profileReady}
                  className={styles.primary}
                >
                  {busy ? "Saving…" : "Save context"}
                </button>
              </form>
              <div className={styles.actions}>
                <button className={styles.secondary} onClick={toggleTheme}>
                  Use {theme === "dark" ? "light" : "dark"} appearance
                </button>
                <Link className={styles.secondary} href="/library/account">
                  Account recovery
                </Link>
                <button
                  disabled={busy}
                  className={styles.secondary}
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              </div>
            </section>
          )}
        </>
      )}
      {message && (
        <p role="status" className={styles.notice}>
          {message}
        </p>
      )}
      <footer className={styles.footer}>
        <Link href="/library">Explore Kosh</Link>
        <Link href="/library/standards">Resource standards</Link>
      </footer>
    </main>
  );
}
