import { notFound } from "next/navigation";
import { getAllChapterFiles, getChapterBySlug } from "@/lib/content";
import { ChapterRenderer } from "@/components/chapter-renderer";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function generateStaticParams() {
  const files = getAllChapterFiles();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(process.cwd(), "content", "chapters", file), "utf-8");
    const { data } = matter(raw);
    return { category: data.category as string, slug: data.slug as string };
  });
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const chapter = await getChapterBySlug(params.category, params.slug);
  return { title: chapter?.title ?? "Chapter" };
}

export default async function ChapterPage({ params }: { params: { category: string; slug: string } }) {
  const chapter = await getChapterBySlug(params.category, params.slug);
  if (!chapter) notFound();
  return <ChapterRenderer chapter={chapter} />;
}
