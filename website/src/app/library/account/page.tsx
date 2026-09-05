"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getKoshSupabase } from "@/lib/kosh/supabase";
import { KoshNav } from "../KoshNav";
import { KoshAuth } from "../KoshAuth";
import styles from "../editorial.module.css";
export default function KoshRecovery() {
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const supabase = getKoshSupabase();
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("The passwords do not match.");
      return;
    }
    const supabase = getKoshSupabase();
    if (!supabase || !recovery) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirm("");
      setMessage("Password updated. You can return to your library.");
      setRecovery(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update your password. Request a new recovery link.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <header className={styles.resourceHero}>
        <p className={styles.eyebrow}>Kosh account</p>
        <h1>Return to your library.</h1>
        <p>
          {recovery
            ? "Choose a new password for your account."
            : "Use “Forgot password?” below to request a recovery link. If a link has expired, request a new one."}
        </p>
      </header>
      {recovery ? (
        <form className={styles.form} onSubmit={submit}>
          <label>
            New password
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <button disabled={busy} className={styles.primary}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      ) : (
        <KoshAuth />
      )}
      <p role="status" className={styles.notice}>
        {message ||
          "Recovery links are time-limited and can only be used for the account they were issued to."}
      </p>
      <Link className={styles.textLink} href="/library/workspace">
        Return to my library ↗
      </Link>
    </main>
  );
}
