"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, Sun, Moon, Laptop, Download, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sap-security-academy-store";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const resetAll = useAppStore((s) => s.resetAll);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => setMounted(true), []);

  function exportData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sap-security-academy-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        JSON.parse(String(reader.result));
        localStorage.setItem(STORAGE_KEY, String(reader.result));
        window.location.reload();
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">Theme, data backup, and reset options. All progress is stored only on this device.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose light, dark, or follow your system preference.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {mounted &&
            (
              [
                { key: "light", icon: Sun, label: "Light" },
                { key: "dark", icon: Moon, label: "Dark" },
                { key: "system", icon: Laptop, label: "System" },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.key}
                variant={theme === opt.key ? "default" : "outline"}
                onClick={() => setTheme(opt.key)}
                className={cn(theme === opt.key && "ring-2 ring-primary/40")}
              >
                <opt.icon className="h-4 w-4" /> {opt.label}
              </Button>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Backup</CardTitle>
          <CardDescription>Your progress, bookmarks, notes, and quiz history live in this browser&rsquo;s local storage only.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4" /> Export Backup
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import Backup
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importData} />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Reset All Progress</CardTitle>
          <CardDescription>Clears completed chapters, bookmarks, notes, quiz history, and revision cards on this device. Cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("This will permanently clear all local progress. Continue?")) resetAll();
            }}
          >
            <Trash2 className="h-4 w-4" /> Reset Everything
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
