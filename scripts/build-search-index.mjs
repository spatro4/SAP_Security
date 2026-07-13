import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_FILE = path.join(ROOT, "public", "search-index.json");

function readJsonDir(dirName) {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const items = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) items.push(...parsed);
    else items.push(parsed);
  }
  return items;
}

const entries = [];

// Chapters
const chapterDir = path.join(CONTENT_DIR, "chapters");
if (fs.existsSync(chapterDir)) {
  for (const file of fs.readdirSync(chapterDir).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(chapterDir, file), "utf-8");
    const { data, content } = matter(raw);
    entries.push({
      id: `chapter:${data.category}:${data.slug}`,
      type: "chapter",
      title: data.title,
      category: data.category,
      href: `/chapters/${data.category}/${data.slug}`,
      excerpt: data.summary ?? content.slice(0, 180),
    });
  }
}

// Questions
for (const q of readJsonDir("questions")) {
  entries.push({
    id: `question:${q.id}`,
    type: "question",
    title: q.question,
    category: q.category,
    href: `/questions/${q.category}#${q.id}`,
    excerpt: q.expectedAnswer,
    difficulty: q.difficulty,
  });
}

// Scenarios
for (const s of readJsonDir("scenarios")) {
  entries.push({
    id: `scenario:${s.id}`,
    type: "scenario",
    title: s.title,
    category: s.category,
    href: `/scenarios/${s.category}#${s.id}`,
    excerpt: s.situation,
    difficulty: s.difficulty,
  });
}

// Glossary
for (const g of readJsonDir("glossary")) {
  entries.push({
    id: `glossary:${g.term}`,
    type: "glossary",
    title: g.term,
    category: g.category,
    href: `/glossary#${g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    excerpt: g.definition,
  });
}

// Flashcards
for (const f of readJsonDir("flashcards")) {
  entries.push({
    id: `flashcard:${f.id}`,
    type: "flashcard",
    title: f.front,
    category: f.category,
    href: `/flashcards?card=${f.id}`,
    excerpt: f.back,
  });
}

fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 0));
console.log(`Search index built: ${entries.length} entries -> ${path.relative(ROOT, OUT_FILE)}`);
