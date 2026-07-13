import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml, extractHeadings } from "./markdown";
import type {
  Chapter,
  ChapterFrontmatter,
  ChapterSummary,
  InterviewQuestion,
  Scenario,
  Flashcard,
  QuizQuestion,
  GlossaryTerm,
  ArchitectureDiagram,
  AuthObjectEntry,
  TransactionEntry,
  TableEntry,
} from "./content-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonDir<T>(dirName: string): T[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const items: T[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) items.push(...parsed);
    else items.push(parsed);
  }
  return items;
}

export function getAllChapterFiles(): string[] {
  const dir = path.join(CONTENT_DIR, "chapters");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function getAllChapterSummaries(): ChapterSummary[] {
  const files = getAllChapterFiles();
  const chapters: ChapterSummary[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, "chapters", file), "utf-8");
    const { data } = matter(raw);
    const fm = data as ChapterFrontmatter;
    return { ...fm, href: `/chapters/${fm.category}/${fm.slug}` };
  });
  return chapters.sort((a, b) => a.order - b.order);
}

export async function getChapterBySlug(category: string, slug: string): Promise<Chapter | null> {
  const files = getAllChapterFiles();
  const target = files.find((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, "chapters", file), "utf-8");
    const { data } = matter(raw);
    return data.category === category && data.slug === slug;
  });
  if (!target) return null;

  const raw = fs.readFileSync(path.join(CONTENT_DIR, "chapters", target), "utf-8");
  const { data, content } = matter(raw);
  const html = await markdownToHtml(content);
  const sections = extractHeadings(content).filter((h) => h.depth <= 3);
  return { ...(data as ChapterFrontmatter), html, sections };
}

export function getAllQuestions(): InterviewQuestion[] {
  return readJsonDir<InterviewQuestion>("questions");
}

export function getAllScenarios(): Scenario[] {
  return readJsonDir<Scenario>("scenarios");
}

export function getAllFlashcards(): Flashcard[] {
  return readJsonDir<Flashcard>("flashcards");
}

export function getAllQuizQuestions(): QuizQuestion[] {
  return readJsonDir<QuizQuestion>("quiz");
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  const terms = readJsonDir<GlossaryTerm>("glossary");
  return terms.sort((a, b) => a.term.localeCompare(b.term));
}

export function getAllDiagrams(): ArchitectureDiagram[] {
  return readJsonDir<ArchitectureDiagram>("architecture");
}

export function getAllAuthObjects(): AuthObjectEntry[] {
  return readJsonDir<AuthObjectEntry>("explorer/auth-objects");
}

export function getAllTransactions(): TransactionEntry[] {
  return readJsonDir<TransactionEntry>("explorer/transactions");
}

export function getAllTables(): TableEntry[] {
  return readJsonDir<TableEntry>("explorer/tables");
}

export function getMarkdownDoc(dirName: string, fileSlug: string): { data: Record<string, unknown>; content: string } | null {
  const filePath = path.join(CONTENT_DIR, dirName, `${fileSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

export function getAllMarkdownSlugs(dirName: string): string[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}
