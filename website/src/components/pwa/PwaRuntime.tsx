"use client";

import { useEffect } from "react";

const BASE_PATH = "/kramaniti";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function PwaRuntime() {
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
              .filter((registration) => registration.scope.includes(BASE_PATH))
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
        await navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, {
          scope: `${BASE_PATH}/`,
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

  return null;
}
