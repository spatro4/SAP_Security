import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

// Rewrite ```mermaid code fences into a container div BEFORE prism touches them,
// so the client can hydrate them with mermaid.js instead of syntax-highlighting them.
function rehypeMermaid() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "pre") return;
      const codeNode = node.children?.[0];
      if (!codeNode || codeNode.tagName !== "code") return;
      const classNames: string[] = codeNode.properties?.className ?? [];
      if (!classNames.includes("language-mermaid")) return;
      const rawText = (codeNode.children ?? [])
        .map((c: any) => (c.type === "text" ? c.value : ""))
        .join("");

      node.tagName = "div";
      node.properties = { className: ["mermaid-diagram-source"], "data-mermaid": rawText };
      node.children = [];
    });
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaid)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["no-underline"] } })
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}

export function extractHeadings(markdown: string): { id: string; title: string; depth: number }[] {
  const lines = markdown.split("\n");
  const headings: { id: string; title: string; depth: number }[] = [];
  for (const line of lines) {
    const match = /^(#{1,4})\s+(.*)$/.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const title = match[2].replace(/[#*`]/g, "").trim();
      const id = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      headings.push({ id, title, depth });
    }
  }
  return headings;
}
