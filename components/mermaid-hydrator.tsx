"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

let mermaidModulePromise: Promise<typeof import("mermaid")> | null = null;
function loadMermaid() {
  if (!mermaidModulePromise) mermaidModulePromise = import("mermaid");
  return mermaidModulePromise;
}

export function MermaidHydrator() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  React.useEffect(() => {
    let cancelled = false;

    async function render() {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-mermaid]:not([data-mermaid-rendered])")
      );
      if (nodes.length === 0) return;

      const { default: mermaid } = await loadMermaid();
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "inherit",
      });

      for (const node of nodes) {
        const source = node.getAttribute("data-mermaid") ?? "";
        if (!source.trim()) continue;
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        try {
          const { svg } = await mermaid.render(id, source);
          node.innerHTML = svg;
          node.setAttribute("data-mermaid-rendered", "true");
        } catch (err) {
          node.innerHTML = `<pre class="text-xs text-destructive">Diagram render error</pre>`;
        }
      }
    }

    render();
    const observer = new MutationObserver(() => render());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [resolvedTheme, pathname]);

  React.useEffect(() => {
    // Force re-render of already-rendered diagrams when theme flips.
    document.querySelectorAll("[data-mermaid-rendered]").forEach((n) => n.removeAttribute("data-mermaid-rendered"));
  }, [resolvedTheme]);

  return null;
}
