import { notFound } from "next/navigation";
import { getAllScenarios } from "@/lib/content";
import { renderScenarios } from "@/lib/render-content";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { ScenarioListClient } from "@/components/scenarios/scenario-list-client";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  return { title: category ? `${category.shortTitle} Scenarios` : "Scenarios" };
}

export default async function CategoryScenariosPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const scenarios = getAllScenarios().filter((s) => s.category === params.category);
  const rendered = await renderScenarios(scenarios);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{category.title} &mdash; Scenario Labs</h1>
        <p className="mt-1 text-muted-foreground">{category.description}</p>
      </div>
      {rendered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Scenarios for this track are being authored. Check back soon.</p>
      ) : (
        <ScenarioListClient scenarios={rendered} />
      )}
    </div>
  );
}
