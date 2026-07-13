"use client";

import * as React from "react";

export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {});
    });
  }, []);

  return null;
}
