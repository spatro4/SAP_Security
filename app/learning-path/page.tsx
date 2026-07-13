import { getAllChapterSummaries } from "@/lib/content";
import { LearningPathClient } from "@/components/learning-path-client";

export const metadata = { title: "Learning Path" };

export default function LearningPathPage() {
  const chapters = getAllChapterSummaries();
  return <LearningPathClient chapters={chapters} />;
}
