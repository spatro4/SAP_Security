import { getAllQuestions } from "@/lib/content";
import { MockInterviewClient } from "@/components/mock-interview/mock-interview-client";

export const metadata = { title: "Mock Interview" };

export default function MockInterviewPage() {
  const questions = getAllQuestions();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mock Interview Simulator</h1>
        <p className="mt-1 text-muted-foreground">Timed, randomized rounds that mirror a real Architect/Lead panel.</p>
      </div>
      <MockInterviewClient questions={questions} />
    </div>
  );
}
