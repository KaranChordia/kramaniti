"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import type { LibraryItem } from "@/lib/library/libraryData";
import { RESOURCE_VERSION } from "@/lib/library/resourceDetails";
import {
  getKoshSupabase,
  isKoshSupabaseConfigured,
  type KoshWorkingCopy,
} from "@/lib/kosh/supabase";
import { parseKoshContext } from "@/lib/kosh/context";
import { KoshAuth } from "./KoshAuth";
import styles from "./editorial.module.css";

export function ResourceWorkbench({
  item,
  original,
  question,
}: {
  item: LibraryItem;
  original: string;
  question: string;
}) {
  const router = useRouter();
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [resetRequested, setResetRequested] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [loading, setLoading] = useState(isKoshSupabaseConfigured);
  const [profiles, setProfiles] = useState({ personal: "", professional: "" });
  const [source, setSource] = useState<"custom" | "personal" | "professional">(
    "custom",
  );
  const [context, setContext] = useState("");
  const [content, setContent] = useState(original);
  const [title, setTitle] = useState(item.title);
  const [version, setVersion] = useState(RESOURCE_VERSION);
  const [copyKind, setCopyKind] =
    useState<KoshWorkingCopy["context_kind"]>("manual");
  const [copyId, setCopyId] = useState<string | null>(null);
  const [copies, setCopies] = useState<KoshWorkingCopy[]>([]);
  const [savedValue, setSavedValue] = useState({
    content: original,
    title: item.title,
  });
  const [compare, setCompare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const [pendingOpen, setPendingOpen] = useState<KoshWorkingCopy | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const accountRef = useRef<string | null>(null);
  const dirty = content !== savedValue.content || title !== savedValue.title;
  const selectedContext = source === "custom" ? context : profiles[source];

  useEffect(() => {
    const supabase = getKoshSupabase();
    if (!supabase) return;
    let alive = true;
    const update = (next: User | null) => {
      if (!alive) return;
      const nextId = next?.id ?? null;
      if (accountRef.current !== nextId) {
        requestRef.current?.abort();
        setBusy(false);
        setSaving(false);
        setBookmarkBusy(false);
        setCopies([]);
        setBookmarked(false);
        setProfiles({ personal: "", professional: "" });
        setStorageMessage("");
        setPendingOpen(null);
        setPendingDelete(null);
        if (accountRef.current) {
          setCopyId(null);
          setContent(original);
          setTitle(item.title);
          setVersion(RESOURCE_VERSION);
          setCopyKind("manual");
          setContext("");
          setSavedValue({ content: original, title: item.title });
          setMessage("Account changed. Private working state was cleared.");
        }
      }
      accountRef.current = nextId;
      setUser(next);
      setLoading(false);
    };
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error && alive)
          setMessage("Your session could not be loaded. Please sign in again.");
        update(data.session?.user ?? null);
      })
      .catch(() => {
        if (alive) {
          setLoading(false);
          setMessage("Could not connect to your account.");
        }
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      update(session?.user ?? null),
    );
    return () => {
      alive = false;
      subscription.unsubscribe();
      requestRef.current?.abort();
    };
  }, [item.title, original]);

  const userId = user?.id;
  useEffect(() => {
    let alive = true;
    const supabase = getKoshSupabase();
    if (userId && supabase) {
      Promise.all([
        supabase
          .from("profiles")
          .select("context")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("working_copies")
          .select("*")
          .eq("user_id", userId)
          .eq("template_id", item.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("template_bookmarks")
          .select("template_id")
          .eq("user_id", userId)
          .eq("template_id", item.id)
          .maybeSingle(),
      ])
        .then(([profile, result, bookmark]) => {
          if (!alive) return;
          if (!bookmark.error) setBookmarked(Boolean(bookmark.data));
          if (!profile.error)
            setProfiles(parseKoshContext(profile.data?.context));
          if (result.error)
            setStorageMessage(
              "Saved copies are unavailable in this environment. Your draft can still be edited and downloaded.",
            );
          else {
            setCopies(result.data ?? []);
            const requestedId = new URLSearchParams(window.location.search).get(
              "copy",
            );
            const requested = result.data?.find(
              (copy) => copy.id === requestedId,
            );
            if (requested) {
              setCopyId(requested.id);
              setContent(requested.content);
              setTitle(requested.title);
              setVersion(requested.template_version);
              setCopyKind(requested.context_kind);
              setSavedValue({
                content: requested.content,
                title: requested.title,
              });
            } else if (requestedId)
              setStorageMessage(
                "That copy is unavailable in your account. The original is shown below.",
              );
          }
        })
        .catch(() => {
          if (alive)
            setStorageMessage(
              "Could not load saved copies. Check your connection and reload.",
            );
        });
    }
    return () => {
      alive = false;
    };
  }, [userId, item.id]); // Session refresh must not discard a working draft.

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const guard = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const link = (event.target as Element)?.closest("a");
      if (!link || link.hasAttribute("download") || link.target === "_blank")
        return;
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname &&
          destination.search === window.location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setPendingNavigation(
        destination.pathname + destination.search + destination.hash,
      );
      requestAnimationFrame(() =>
        document
          .getElementById("draft-navigation-warning")
          ?.scrollIntoView({ block: "center" }),
      );
    };
    document.addEventListener("click", guard, true);
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", guard, true);
    };
  }, [dirty]);

  async function toggleBookmark() {
    const supabase = getKoshSupabase();
    if (!supabase || !user) return;
    const owner = user.id;
    setBookmarkBusy(true);
    try {
      const { error } = bookmarked
        ? await supabase
            .from("template_bookmarks")
            .delete()
            .eq("user_id", owner)
            .eq("template_id", item.id)
        : await supabase
            .from("template_bookmarks")
            .insert({ user_id: owner, template_id: item.id });
      if (error) throw error;
      if (accountRef.current === owner) {
        setBookmarked(!bookmarked);
        setMessage(
          bookmarked ? "Removed from favourites." : "Saved to favourites.",
        );
      }
    } catch {
      if (accountRef.current === owner)
        setMessage("Could not update favourites. Please try again.");
    } finally {
      if (accountRef.current === owner) setBookmarkBusy(false);
    }
  }
  function download() {
    const blob = new Blob(
      [
        `<!-- Kosh source: ${item.id}; version: ${version}; working copy: review required -->\n\n${content}`,
      ],
      { type: "text/markdown;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.id}-working-copy.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Download requested. If your browser does not save the file, use Copy Markdown below.",
    );
  }
  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(
        `<!-- Kosh source: ${item.id}; version: ${version}; working copy: review required -->\n\n${content}`,
      );
      setMessage(
        "Working Markdown copied. Paste it into your own document or editor.",
      );
    } catch {
      setMessage(
        "Clipboard access is unavailable. Select and copy the text in the editor, or download the file.",
      );
    }
  }
  async function adapt() {
    const supabase = getKoshSupabase();
    if (!supabase || !user || busy) return;
    const owner = user.id;
    setBusy(true);
    setMessage("");
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 55000);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session)
        throw new Error(
          "Your session expired. Sign in again. Your current draft is still available to download.",
        );
      const response = await fetch("/api/kosh/adapt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          templateId: item.id,
          contextKind: source,
          ...(source === "custom" ? { context } : {}),
        }),
        signal: controller.signal,
      });
      const payload = await response.json();
      if (!response.ok || typeof payload.content !== "string")
        throw new Error(
          payload.error ||
            "Generation failed. Your existing draft has been preserved.",
        );
      if (accountRef.current !== owner) return;
      setContent(payload.content);
      setVersion(RESOURCE_VERSION);
      setCopyKind(source);
      setCopyId(null);
      setCompare(true);
      setMessage(
        "Draft ready. Compare it with the original, check the facts and edit before saving.",
      );
    } catch (error) {
      if (accountRef.current === owner)
        setMessage(
          controller.signal.aborted
            ? "Generation stopped. Your existing draft has been preserved. A request already sent may still count toward today’s limit."
            : error instanceof Error
              ? error.message
              : "Generation failed. Try again.",
        );
    } finally {
      clearTimeout(timeout);
      if (accountRef.current === owner) setBusy(false);
    }
  }
  async function save() {
    const supabase = getKoshSupabase();
    if (!supabase || !user || saving) return;
    setSaving(true);
    setMessage("");
    const owner = user.id;
    const snapshot = { title: title.trim(), content: content.trim() };
    try {
      const result = copyId
        ? await supabase
            .from("working_copies")
            .update({ ...snapshot, updated_at: new Date().toISOString() })
            .eq("id", copyId)
            .eq("user_id", owner)
            .select()
            .single()
        : await supabase
            .from("working_copies")
            .insert({
              ...snapshot,
              user_id: owner,
              template_id: item.id,
              template_version: version,
              context_kind: copyKind,
            })
            .select()
            .single();
      if (result.error || !result.data)
        throw new Error(
          "Could not save this copy. Your draft is still here; download it or try again.",
        );
      if (accountRef.current !== owner) return;
      setCopyId(result.data.id);
      setTitle(snapshot.title);
      setContent(snapshot.content);
      setSavedValue(snapshot);
      setCopies((previous) => [
        result.data,
        ...previous.filter((copy) => copy.id !== result.data.id),
      ]);
      setStorageMessage("");
      setMessage("Working copy saved privately to your Kosh account.");
    } catch (error) {
      if (accountRef.current === owner)
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not save. Download your draft to keep it.",
        );
    } finally {
      if (accountRef.current === owner) setSaving(false);
    }
  }
  function openCopy(copy: KoshWorkingCopy) {
    setCopyId(copy.id);
    setContent(copy.content);
    setTitle(copy.title);
    setVersion(copy.template_version);
    setCopyKind(copy.context_kind);
    setSavedValue({ content: copy.content, title: copy.title });
    setPendingOpen(null);
    setMessage("Saved working copy opened.");
  }
  async function removeCopy(id: string) {
    const supabase = getKoshSupabase();
    if (!supabase || !user) return;
    const owner = user.id;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("working_copies")
        .delete()
        .eq("id", id)
        .eq("user_id", owner)
        .select("id")
        .single();
      if (error || !data)
        throw new Error("Copy could not be deleted. Try again.");
      if (accountRef.current !== owner) return;
      setCopies((previous) => previous.filter((copy) => copy.id !== id));
      if (copyId === id) setCopyId(null);
      setPendingDelete(null);
      setMessage(
        "Saved copy deleted. Any open text remains available to download.",
      );
    } catch (error) {
      if (accountRef.current === owner)
        setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      if (accountRef.current === owner) setSaving(false);
    }
  }
  return (
    <section
      id="make-it-yours"
      className={styles.workbench}
      aria-labelledby="workbench-heading"
    >
      <p className={styles.eyebrow}>Your working copy</p>
      <h2 id="workbench-heading">Make it fit the work.</h2>
      <p>
        Edit the original yourself, or sign in to adapt it with your context.
        The canonical resource stays unchanged.
      </p>
      {loading ? (
        <p role="status">Checking your account…</p>
      ) : !user ? (
        <KoshAuth />
      ) : (
        <div className={styles.form}>
          <button
            type="button"
            className={styles.secondary}
            disabled={bookmarkBusy}
            aria-pressed={bookmarked}
            onClick={() => void toggleBookmark()}
          >
            {bookmarked ? "Remove from favourites" : "Save to favourites"}
          </button>
          <label>
            Context to use
            <select
              value={source}
              disabled={busy}
              onChange={(e) => setSource(e.target.value as typeof source)}
            >
              <option value="custom">Just for this resource</option>
              <option value="professional">Saved professional context</option>
              <option value="personal">Saved personal context</option>
            </select>
          </label>
          {source === "custom" ? (
            <label>
              {question}
              <textarea
                value={context}
                maxLength={4000}
                disabled={busy}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Include your goal, approved inputs, constraints and the person who reviews the result."
              />
            </label>
          ) : (
            <>
              <p className={styles.notice}>
                {selectedContext ||
                  "This saved profile is empty. Choose context for this resource or add a profile in Settings."}
              </p>
              <Link href="/library/workspace">Manage saved context →</Link>
            </>
          )}
          <p className={styles.caption}>
            Only the context shown here and the working template are sent to
            Groq when you request an adaptation. Context entered here is not
            saved as a profile. Up to 10 attempts per day, resetting at 00:00
            UTC; failed attempts also count.
          </p>
          {dirty && (
            <p className={styles.caption}>
              Save or download your current edits before generating another
              draft.
            </p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              disabled={busy || saving || !selectedContext.trim() || dirty}
              onClick={() => void adapt()}
            >
              {busy ? "Adapting…" : "Generate a draft"}
            </button>
            {busy && (
              <button
                type="button"
                className={styles.secondary}
                onClick={() => requestRef.current?.abort()}
              >
                Stop waiting
              </button>
            )}
          </div>
        </div>
      )}
      {pendingNavigation && (
        <div
          className={styles.notice}
          id="draft-navigation-warning"
          role="alert"
        >
          <p>
            You have unsaved edits. Download or save them before leaving, or
            discard them to continue.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.secondary}
              onClick={() => setPendingNavigation(null)}
            >
              Keep editing
            </button>
            <button
              className={styles.secondary}
              onClick={() => {
                const destination = pendingNavigation;
                setPendingNavigation(null);
                router.push(destination);
              }}
            >
              Discard edits and leave
            </button>
          </div>
        </div>
      )}
      <div className={styles.form}>
        <label>
          Working copy name
          <input
            maxLength={160}
            value={title}
            disabled={busy || saving}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Edit your working copy
          <textarea
            className={styles.editor}
            value={content}
            maxLength={24000}
            disabled={busy || saving}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </label>
        <p className={styles.caption}>
          Source version {version} ·{" "}
          {dirty
            ? "Unsaved changes"
            : copyId
              ? "Saved copy"
              : "Original starting point"}{" "}
          · Human review required
          {version !== RESOURCE_VERSION
            ? ` · The current original is version ${RESOURCE_VERSION}; your copy has been preserved.`
            : ""}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={!content.trim() || busy}
            onClick={download}
          >
            Download working copy
          </button>
          <button
            type="button"
            className={styles.secondary}
            disabled={!content.trim() || busy}
            onClick={() => void copyMarkdown()}
          >
            Copy Markdown
          </button>
          {user && (
            <button
              type="button"
              className={styles.secondary}
              disabled={saving || busy || !content.trim() || !title.trim()}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : copyId ? "Save changes" : "Save privately"}
            </button>
          )}
          <button
            type="button"
            className={styles.secondary}
            aria-expanded={compare}
            onClick={() => setCompare(!compare)}
          >
            {compare ? "Hide comparison" : "Compare & preview"}
          </button>
          <button
            type="button"
            disabled={busy || saving}
            className={styles.secondary}
            onClick={() => setResetRequested(true)}
          >
            Start a fresh copy
          </button>
        </div>
        {resetRequested && (
          <div className={styles.notice}>
            <p>
              Replace the editor with the current original? Saved copies will
              remain in your account.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  setContent(original);
                  setTitle(item.title);
                  setVersion(RESOURCE_VERSION);
                  setCopyKind("manual");
                  setCopyId(null);
                  setSavedValue({ content: original, title: item.title });
                  setResetRequested(false);
                  setMessage("Fresh copy ready.");
                }}
              >
                Replace editor
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setResetRequested(false)}
              >
                Keep this copy
              </button>
            </div>
          </div>
        )}
      </div>
      <p role="status" className={styles.notice}>
        {message ||
          "Check sources, missing information and approval boundaries before using this copy."}
      </p>
      {compare && (
        <div className={styles.comparison}>
          <div>
            <h3>Current original · {RESOURCE_VERSION}</h3>
            <article className={styles.prose}>
              <ReactMarkdown>{original}</ReactMarkdown>
            </article>
          </div>
          <div>
            <h3>Your working copy · {version}</h3>
            <article className={styles.prose}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          </div>
        </div>
      )}
      {user && (
        <div>
          <h3>Saved copies of this resource</h3>
          {storageMessage && <p role="status">{storageMessage}</p>}
          {!storageMessage && !copies.length && (
            <p>
              No saved copies yet. Save a draft above to return to it later.
            </p>
          )}
          <ul className={styles.copyList}>
            {copies.map((copy) => (
              <li key={copy.id}>
                <button
                  disabled={busy || saving}
                  className={styles.secondary}
                  onClick={() =>
                    dirty ? setPendingOpen(copy) : openCopy(copy)
                  }
                >
                  {copy.title} · v{copy.template_version}
                </button>
                <button
                  disabled={busy || saving}
                  className={styles.secondary}
                  onClick={() => setPendingDelete(copy.id)}
                >
                  Delete<span className="sr-only"> {copy.title}</span>
                </button>
                {pendingDelete === copy.id && (
                  <div className={styles.notice}>
                    <p>Permanently delete “{copy.title}” from your account?</p>
                    <div className={styles.actions}>
                      <button
                        disabled={saving}
                        className={styles.secondary}
                        onClick={() => void removeCopy(copy.id)}
                      >
                        Delete saved copy
                      </button>
                      <button
                        className={styles.secondary}
                        onClick={() => setPendingDelete(null)}
                      >
                        Keep it
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {pendingOpen && (
            <div className={styles.notice}>
              <p>
                Opening “{pendingOpen.title}” will replace your unsaved edits.
              </p>
              <div className={styles.actions}>
                <button
                  className={styles.secondary}
                  onClick={() => openCopy(pendingOpen)}
                >
                  Discard edits and open
                </button>
                <button
                  className={styles.secondary}
                  onClick={() => setPendingOpen(null)}
                >
                  Keep editing
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
