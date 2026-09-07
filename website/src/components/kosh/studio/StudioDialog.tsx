"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./studio.module.css";
export function StudioDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current!;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={onClose}
      aria-labelledby="studio-dialog-title"
    >
      <div className={styles.dialogHeader}>
        <h2 id="studio-dialog-title">{title}</h2>
        <button onClick={onClose} aria-label="Close dialog">
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      {children}
    </dialog>
  );
}
