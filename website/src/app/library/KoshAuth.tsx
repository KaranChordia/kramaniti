"use client";
import { useState } from "react";
import { getKoshSupabase, isKoshSupabaseConfigured } from "@/lib/kosh/supabase";
import styles from "./editorial.module.css";
export function KoshAuth() {
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "reset">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!isKoshSupabaseConfigured())
    return (
      <p className={styles.notice}>
        Member features are not configured in this preview. You can still read,
        edit and download resources.
      </p>
    );
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getKoshSupabase();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: `${window.location.origin}/library/account` },
        );
        if (error) throw error;
        setMessage(
          "If an account matches this email, a recovery link will arrive shortly.",
        );
      } else if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: window.location.href.split("#")[0],
          },
        });
        if (error) throw error;
        setMessage(
          data.session
            ? "You are signed in."
            : "Check your email to confirm your account, then return here to sign in.",
        );
        setPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setPassword("");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      <h3>
        {mode === "reset"
          ? "Recover your account"
          : mode === "sign-up"
            ? "Create your Kosh account"
            : "Sign in to your library"}
      </h3>
      {mode === "sign-up" && (
        <label>
          Name
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      )}
      <label>
        Email
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {mode !== "reset" && (
        <label>
          Password
          <input
            required
            type="password"
            minLength={8}
            autoComplete={
              mode === "sign-up" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      <div className={styles.actions}>
        <button disabled={busy} className={styles.primary}>
          {busy
            ? "Working…"
            : mode === "reset"
              ? "Send recovery link"
              : mode === "sign-up"
                ? "Create account"
                : "Sign in"}
        </button>
        <button
          disabled={busy}
          type="button"
          className={styles.secondary}
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setMessage("");
          }}
        >
          {mode === "sign-in" ? "Create an account" : "Back to sign in"}
        </button>
        {mode === "sign-in" && (
          <button
            disabled={busy}
            type="button"
            className={styles.secondary}
            onClick={() => {
              setMode("reset");
              setMessage("");
            }}
          >
            Forgot password?
          </button>
        )}
      </div>
      <p role="status" className={styles.caption}>
        {message}
      </p>
    </form>
  );
}
