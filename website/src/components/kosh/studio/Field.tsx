"use client";
import { useId, useLayoutEffect, useRef } from "react";
import styles from "./studio.module.css";
export function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  maxLength = 12000,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  compact?: boolean;
}) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      if (el.getClientRects().length) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };
    resize();
    let width = 0;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== width) {
        width = entry.contentRect.width;
        resize();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div className={compact ? styles.compactField : styles.field}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      <textarea
        data-studio-intent={label === "Purpose" ? "true" : undefined}
        id={id}
        ref={ref}
        value={value}
        rows={compact ? 1 : 2}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? `Add ${label.toLowerCase()}…`}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </div>
  );
}
