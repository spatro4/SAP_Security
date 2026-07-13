import { getAllFlashcards } from "@/lib/content";
import { FlashcardDeck } from "@/components/flashcards/flashcard-deck";

export const metadata = { title: "Flash Cards" };

export default function FlashcardsPage() {
  const cards = getAllFlashcards();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flash Cards</h1>
        <p className="mt-1 text-muted-foreground">Rapid recall drills with spaced-repetition ratings.</p>
      </div>
      <FlashcardDeck cards={cards} />
    </div>
  );
}
