"use client";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

/** The artifact stays mounted; only a deliberate navigation receives a transition. */
export function useStudioTransition() {
  const active = useRef<ViewTransition | null>(null);
  const sequence = useRef(0);
  useEffect(
    () => () => {
      sequence.current += 1;
      active.current?.skipTransition();
    },
    [],
  );
  return (
    update: () => void,
    direction: "forward" | "back" | "arrival" = "forward",
    afterUpdate?: () => void,
  ) => {
    const request = ++sequence.current;
    active.current?.skipTransition();
    const apply = () => {
      if (request === sequence.current) {
        flushSync(update);
        afterUpdate?.();
      }
    };
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }
    document.documentElement.dataset.studioDirection = direction;
    const transition = document.startViewTransition(apply);
    active.current = transition;
    // Skipping an animation rejects ready even when its update succeeds.
    void transition.ready.catch(() => {});
    void transition.finished
      .catch(() => {})
      .finally(() => {
        if (active.current === transition) active.current = null;
      });
  };
}
