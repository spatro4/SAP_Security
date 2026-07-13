import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Download, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllChapterSummaries } from "@/lib/content";

export const metadata = { title: "Downloads" };

function getCheatSheetList() {
  const dir = path.join(process.cwd(), "content", "cheatsheets");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), title: data.title as string };
    });
}

export default function DownloadsPage() {
  const chapters = getAllChapterSummaries();
  const cheatsheets = getCheatSheetList();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Download className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Downloads & PDF Export</h1>
          <p className="mt-1 text-muted-foreground">
            Every page on this site is print-optimized. Open any page and use your browser&rsquo;s <strong>Print &rarr; Save as PDF</strong> (Ctrl/Cmd+P) to export a clean, distraction-free PDF - no ads, no navigation chrome.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-primary" /> How PDF export works here
          </CardTitle>
          <CardDescription>
            This is a fully static site - there is no server generating PDFs. Instead, every chapter and cheat sheet ships with a print
            stylesheet that hides navigation, sidebars, and buttons automatically when you print.
          </CardDescription>
        </CardHeader>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Chapters</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <Link key={c.slug} href={c.href} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      {cheatsheets.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Cheat Sheets</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cheatsheets.map((c: { slug: string; title: string }) => (
              <Link key={c.slug} href={`/cheat-sheets/${c.slug}`} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
