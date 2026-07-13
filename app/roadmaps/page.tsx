import { Route } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMarkdownDoc } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";

export const metadata = { title: "Roadmaps" };

async function renderDoc(slug: string) {
  const doc = getMarkdownDoc("pages", slug);
  return doc ? markdownToHtml(doc.content) : "<p>Coming soon.</p>";
}

export default async function RoadmapsPage() {
  const [d30, d90, d365] = await Promise.all([renderDoc("roadmap-30"), renderDoc("roadmap-90"), renderDoc("roadmap-365")]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Route className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revision Roadmaps</h1>
          <p className="mt-1 text-muted-foreground">Structured plans for a 30-day sprint, a 90-day depth build, or a 365-day mastery arc.</p>
        </div>
      </div>

      <Tabs defaultValue="30">
        <TabsList>
          <TabsTrigger value="30">30-Day Sprint</TabsTrigger>
          <TabsTrigger value="90">90-Day Plan</TabsTrigger>
          <TabsTrigger value="365">365-Day Mastery</TabsTrigger>
        </TabsList>
        <TabsContent value="30">
          <div className="prose-sap" dangerouslySetInnerHTML={{ __html: d30 }} />
        </TabsContent>
        <TabsContent value="90">
          <div className="prose-sap" dangerouslySetInnerHTML={{ __html: d90 }} />
        </TabsContent>
        <TabsContent value="365">
          <div className="prose-sap" dangerouslySetInnerHTML={{ __html: d365 }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
