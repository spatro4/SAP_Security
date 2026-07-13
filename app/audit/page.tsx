import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMarkdownDoc } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { PrintButton } from "@/components/print-button";

export const metadata = { title: "Audit & Compliance" };

export default async function AuditPage() {
  const doc = getMarkdownDoc("pages", "audit-overview");
  const html = doc ? await markdownToHtml(doc.content) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Scale className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit & Compliance</h1>
            <p className="mt-1 text-muted-foreground">SOX, ISO 27001, NIST, CIS, SoD, Firefighter, and audit readiness.</p>
          </div>
        </div>
        <PrintButton />
      </div>

      <div className="prose-sap" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/chapters/grc-sod-audit">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center justify-between p-5">
              <span className="font-medium">GRC & Audit Deep-Dive Chapter</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/questions/grc-sod-audit">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center justify-between p-5">
              <span className="font-medium">Audit Interview Questions</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
