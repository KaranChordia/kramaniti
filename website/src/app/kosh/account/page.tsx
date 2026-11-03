"use client";
import { useEffect, useState } from "react";
import { koshUrl } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getKoshSupabase } from "@/lib/kosh/supabase";
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
      <div className={styles.authLayout}>
        <header className={styles.authIntro}>
          <p className={styles.eyebrow}>Kosh account</p>
          <h1>{recovery ? "Set a new password." : "Keep the useful work close."}</h1>
          <p>
            {recovery
              ? "Choose a new password and return to your private Kosh library."
              : "Save the resources, working copies and context you want to return to."}
          </p>
          <div className={styles.authPrinciples} aria-label="Kosh account benefits">
            <span><b>01</b> Read openly</span>
            <span><b>02</b> Save privately</span>
            <span><b>03</b> Return with context</span>
          </div>
        </header>
        <section className={styles.authPanel} aria-label="Account access">
          {recovery ? (
            <form className={styles.form} onSubmit={submit}>
              <div className={styles.authPanelHeading}>
                <p className={styles.eyebrow}>Account recovery</p>
                <h2>Choose a new password</h2>
              </div>
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
              "Your account is only for your private Kosh work. Public resources remain open to everyone."}
          </p>
          <Link className={styles.textLink} href={koshUrl("/workspace/")}>
            Return to my library <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
