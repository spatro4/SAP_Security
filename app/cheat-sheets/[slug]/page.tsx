import { notFound } from "next/navigation";
import { getAllMarkdownSlugs, getMarkdownDoc } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { PrintButton } from "@/components/print-button";

export function generateStaticParams() {
  return getAllMarkdownSlugs("cheatsheets").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getMarkdownDoc("cheatsheets", params.slug);
  return { title: (doc?.data.title as string) ?? "Cheat Sheet" };
}

export default async function CheatSheetPage({ params }: { params: { slug: string } }) {
  const doc = getMarkdownDoc("cheatsheets", params.slug);
  if (!doc) notFound();
  const html = await markdownToHtml(doc.content);

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{doc.data.title as string}</h1>
        <PrintButton />
      </div>
      <div className="prose-sap" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
