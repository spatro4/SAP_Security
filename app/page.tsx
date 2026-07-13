import { getAllChapterSummaries, getAllQuestions } from "@/lib/content";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function DashboardPage() {
  const chapters = getAllChapterSummaries();
  const questions = getAllQuestions().map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    difficulty: q.difficulty,
  }));

  return <DashboardClient chapters={chapters} dailyQuestions={questions} />;
}
