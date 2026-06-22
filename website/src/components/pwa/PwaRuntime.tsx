"use client";

import { useEffect, useState } from "react";
import styles from "./PwaRuntime.module.css";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const INSTALL_PROMPT_DISMISSED_KEY = "kramaniti-pwa-install-dismissed";

type BeforeInstallPromptChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<BeforeInstallPromptChoice>;
  prompt: () => Promise<BeforeInstallPromptChoice>;
}

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

export function PwaRuntime() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallVisible, setIsInstallVisible] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isLocalDevelopment = LOCAL_HOSTS.has(window.location.hostname);

    if (isLocalDevelopment) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations
              .filter((registration) => registration.active?.scriptURL.endsWith("/sw.js"))
              .map((registration) => registration.unregister())
          )
        )
        .catch(() => {});

      if ("caches" in window) {
        caches.keys()
          .then((keys) =>
            Promise.all(
              keys
                .filter((key) => key.startsWith("kramaniti-app-shell"))
                .map((key) => caches.delete(key))
            )
          )
          .catch(() => {});
      }

      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
      } catch {
        // PWA support should never interrupt the public website experience.
      }
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  useEffect(() => {
    if (isStandaloneApp()) {
      return;
    }

    const hasDismissedInstallPrompt = sessionStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === "true";
    if (hasDismissedInstallPrompt) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      window.setTimeout(() => setIsInstallVisible(true), 900);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstallVisible(false);
      sessionStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const dismissInstallPrompt = () => {
    setIsInstallVisible(false);
    sessionStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "true");
  };

  const installApp = async () => {
    if (!installPrompt) return;

    setIsInstallVisible(false);
    const choice = await installPrompt.prompt();
    setInstallPrompt(null);

    if (choice.outcome !== "accepted") {
      sessionStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "true");
    }
  };

  if (!installPrompt || !isInstallVisible) {
    return null;
  }

  return (
    <aside className={styles.installPrompt} aria-label="Install Kramaniti app">
      <div className={styles.mark} aria-hidden="true">K</div>
      <div className={styles.copy}>
        <span>Install Kramaniti</span>
        <small>Open faster from your home screen.</small>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.installButton} onClick={installApp}>
          Install
        </button>
        <button type="button" className={styles.dismissButton} onClick={dismissInstallPrompt} aria-label="Dismiss install prompt">
          ×
        </button>
      </div>
    </aside>
  );
}
