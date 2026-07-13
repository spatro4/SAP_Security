import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Cheat Sheets" };

function getCheatSheets() {
  const dir = path.join(process.cwd(), "content", "cheatsheets");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), title: data.title as string, summary: (data.summary as string) ?? "" };
    });
}

export default function CheatSheetsPage() {
  const sheets = getCheatSheets();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cheat Sheets</h1>
          <p className="mt-1 text-muted-foreground">Quick-reference comparisons for the night before the interview.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sheets.map((s) => (
          <Link key={s.slug} href={`/cheat-sheets/${s.slug}`}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardContent className="p-5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.summary}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
