import { notFound } from "next/navigation";
import { getAllQuestions } from "@/lib/content";
import { renderQuestions } from "@/lib/render-content";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { QuestionListClient } from "@/components/questions/question-list-client";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  return { title: category ? `${category.shortTitle} Questions` : "Questions" };
}

export default async function CategoryQuestionsPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const questions = getAllQuestions().filter((q) => q.category === params.category);
  const rendered = await renderQuestions(questions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{category.title} &mdash; Interview Questions</h1>
        <p className="mt-1 text-muted-foreground">{category.description}</p>
      </div>
      {rendered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Questions for this track are being authored. Check back soon.</p>
      ) : (
        <QuestionListClient questions={rendered} />
      )}
    </div>
  );
}
