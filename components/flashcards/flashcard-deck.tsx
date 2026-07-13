"use client";

import * as React from "react";
import { RotateCw, ArrowRight, Shuffle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";
import type { Flashcard } from "@/lib/content-types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [category, setCategory] = React.useState("all");
  const [deck, setDeck] = React.useState(() => cards);
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const { reviewCard } = useAppStore();

  const filtered = React.useMemo(() => (category === "all" ? cards : cards.filter((c) => c.category === category)), [cards, category]);

  React.useEffect(() => {
    setDeck(filtered);
    setIndex(0);
    setFlipped(false);
  }, [filtered]);

  const current = deck[index];

  function goNext() {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(1, deck.length));
  }

  function rate(result: "again" | "hard" | "good" | "easy") {
    if (current) reviewCard(`flashcard:${current.id}`, "flashcard", result);
    goNext();
  }

  if (!current) return <p className="text-sm text-muted-foreground">No flashcards match this filter.</p>;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.shortTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {deck.length}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setDeck(shuffle(deck))}>
          <Shuffle className="h-4 w-4" /> Shuffle
        </Button>
      </div>

      <Card
        className="flex min-h-[260px] cursor-pointer select-none items-center justify-center p-8 text-center"
        onClick={() => setFlipped((f) => !f)}
      >
        <CardContent className="p-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{flipped ? "Answer" : "Question"}</p>
          <p className="text-lg font-medium">{flipped ? current.back : current.front}</p>
          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <RotateCw className="h-3 w-3" /> Click to flip
          </p>
        </CardContent>
      </Card>

      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {(["again", "hard", "good", "easy"] as const).map((r) => (
            <Button key={r} variant="outline" onClick={() => rate(r)}>
              {r}
            </Button>
          ))}
        </div>
      ) : (
        <Button className="w-full" variant="outline" onClick={goNext}>
          Skip <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
