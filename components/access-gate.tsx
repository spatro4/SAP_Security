"use client";

import * as React from "react";
import { ShieldCheck, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACCESS_GATE_CONFIG } from "@/lib/access-gate-config";

export function AccessGate({ children }: { children: React.ReactNode }) {
  // Defaults to unlocked so the statically-exported HTML always contains the
  // real page content (no blank page for SEO/no-JS visitors). The gate only
  // ever *adds* an overlay client-side once we've checked localStorage - it
  // never hides content from the pre-rendered markup itself, which is exactly
  // why this is a cosmetic deterrent, not a real access control.
  const [unlocked, setUnlocked] = React.useState(true);
  const [entry, setEntry] = React.useState("");
  const [error, setError] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    setUnlocked(localStorage.getItem(ACCESS_GATE_CONFIG.localStorageKey) === "true");
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (entry === ACCESS_GATE_CONFIG.passcode) {
      localStorage.setItem(ACCESS_GATE_CONFIG.localStorageKey, "true");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <>
      {children}
      {!unlocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">SAP Security Architect Academy</h1>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Enter the access code to continue.</p>
            <form onSubmit={submit} className="space-y-3">
              <Input
                type="password"
                autoFocus
                value={entry}
                onChange={(e) => {
                  setEntry(e.target.value);
                  setError(false);
                }}
                placeholder="Access code"
              />
              {error && <p className="text-sm text-destructive">Incorrect code, try again.</p>}
              <Button type="submit" className="w-full">
                Enter
              </Button>
            </form>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                {showHint ? "Hide hint" : "Forgot the code?"}
              </button>
              {showHint && (
                <p className="rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-medium">{ACCESS_GATE_CONFIG.hintQuestion}</span>
                  <br />
                  {ACCESS_GATE_CONFIG.hintAnswer}
                </p>
              )}

              <a
                href={ACCESS_GATE_CONFIG.githubIssueUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Request access <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground">
              This is a lightweight access gate for a personal study site, not a security control &mdash; it does not
              protect confidential information.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
