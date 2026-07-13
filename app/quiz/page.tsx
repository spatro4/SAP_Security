import { getAllQuizQuestions } from "@/lib/content";
import { QuizSetup } from "@/components/quiz/quiz-setup";

export const metadata = { title: "Quiz Engine" };

export default function QuizPage() {
  const questions = getAllQuizQuestions();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quiz Engine</h1>
        <p className="mt-1 text-muted-foreground">Rapid-fire practice across MCQ, True/False, Scenario, and Drag-Drop formats.</p>
      </div>
      <QuizSetup questions={questions} />
    </div>
  );
}
