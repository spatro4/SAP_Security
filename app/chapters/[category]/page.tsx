import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllChapterSummaries } from "@/lib/content";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { Icon } from "@/components/icon";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  return { title: category?.title ?? "Chapter Category" };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const chapters = getAllChapterSummaries().filter((c) => c.category === params.category);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
          <Icon name={category.icon} className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{category.title}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {chapters.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chapters for this track are being authored. Check back soon.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((ch) => (
            <Link key={ch.slug} href={ch.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline">{ch.level}</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" /> {ch.estMinutes} min
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{ch.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ch.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                    Read chapter <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
