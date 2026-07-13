"use client";

import * as React from "react";
import { Video, Clock, ArrowRight, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { CATEGORIES, DIFFICULTIES, getCategory } from "@/lib/categories";
import type { InterviewQuestion } from "@/lib/content-types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "running" | "result";
type Rating = "missed" | "partial" | "nailed";

const TIME_OPTIONS = [60, 90, 120, 180];

export function MockInterviewClient({ questions }: { questions: InterviewQuestion[] }) {
  const [phase, setPhase] = React.useState<Phase>("setup");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState("all");
  const [count, setCount] = React.useState(8);
  const [timePerQ, setTimePerQ] = React.useState(120);

  const [pool, setPool] = React.useState<InterviewQuestion[]>([]);
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(timePerQ);
  const [notes, setNotes] = React.useState("");
  const [ratings, setRatings] = React.useState<Rating[]>([]);
  const [weakCategories, setWeakCategories] = React.useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = React.useState<number>(0);

  const { recordMockInterview, registerMiss } = useAppStore();

  React.useEffect(() => {
    if (phase !== "running" || revealed) return;
    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, revealed]);

  function start() {
    const filtered = questions.filter(
      (q) => (category === "all" || q.category === category) && (difficulty === "all" || q.difficulty === difficulty)
    );
    const selected = shuffle(filtered).slice(0, count);
    setPool(selected);
    setIndex(0);
    setRatings([]);
    setWeakCategories({});
    setNotes("");
    setRevealed(false);
    setTimeLeft(timePerQ);
    setStartedAt(Date.now());
    setPhase("running");
  }

  function rate(r: Rating) {
    const current = pool[index];
    setRatings((prev) => [...prev, r]);
    if (r !== "nailed") {
      setWeakCategories((w) => ({ ...w, [current.category]: (w[current.category] ?? 0) + 1 }));
      registerMiss(current.category);
    }

    if (index + 1 >= pool.length) {
      const score = [...ratings, r].reduce((acc, x) => acc + (x === "nailed" ? 1 : x === "partial" ? 0.5 : 0), 0);
      recordMockInterview({
        category: category === "all" ? "Mixed" : getCategory(category)?.shortTitle ?? category,
        difficulty,
        score: Math.round(score * 10) / 10,
        total: pool.length,
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        weakAreas: Object.keys(weakCategories),
      });
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setNotes("");
    setTimeLeft(timePerQ);
  }

  if (phase === "setup") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" /> Mock Interview Setup
          </CardTitle>
          <CardDescription>Simulate a real panel round: timed questions, no peeking at the answer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium">Focus Area</p>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories (Mixed Panel)</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.shortTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Difficulty</p>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Number of Questions</p>
            <Select value={String(count)} onValueChange={(v) => setCount(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 8, 10, 15, 20].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Time per Question</p>
            <Select value={String(timePerQ)} onValueChange={(v) => setTimePerQ(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} seconds
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={start}>
            Begin Interview <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "result") {
    const nailed = ratings.filter((r) => r === "nailed").length;
    const partial = ratings.filter((r) => r === "partial").length;
    const missed = ratings.filter((r) => r === "missed").length;
    const scorePct = Math.round(((nailed + partial * 0.5) / ratings.length) * 100);

    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-4 p-8 text-center">
          <Trophy className="mx-auto h-10 w-10 text-primary" />
          <h2 className="text-xl font-bold">Interview Complete</h2>
          <p className="text-4xl font-bold text-primary">{scorePct}%</p>
          <div className="flex justify-center gap-3 text-sm">
            <Badge variant="success">{nailed} nailed</Badge>
            <Badge variant="warning">{partial} partial</Badge>
            <Badge variant="destructive">{missed} missed</Badge>
          </div>
          {Object.keys(weakCategories).length > 0 && (
            <div className="text-left">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Areas to revisit</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {Object.keys(weakCategories).map((c) => (
                  <li key={c}>{getCategory(c)?.shortTitle ?? c}</li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={() => setPhase("setup")}>Run Another Round</Button>
        </CardContent>
      </Card>
    );
  }

  const current = pool[index];
  if (!current) return <p className="text-sm text-muted-foreground">No questions matched your setup filters.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Progress value={(index / pool.length) * 100} className="flex-1" />
        <span className="shrink-0 text-sm text-muted-foreground">
          {index + 1} / {pool.length}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{current.difficulty}</Badge>
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" /> {timeLeft}s
            </span>
          </div>
          <p className="text-lg font-medium">{current.question}</p>

          {!revealed ? (
            <>
              <Textarea
                placeholder="Speak your answer out loud, or jot key points here (not saved)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
              <Button className="w-full" onClick={() => setRevealed(true)}>
                Reveal Expected Answer
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-muted/40 p-4 text-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Answer</p>
                <p>{current.expectedAnswer}</p>
              </div>
              <p className="text-sm text-muted-foreground">How did you do?</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="border-destructive/40 hover:bg-destructive/10" onClick={() => rate("missed")}>
                  Missed
                </Button>
                <Button variant="outline" className="border-warning/40 hover:bg-warning/10" onClick={() => rate("partial")}>
                  Partial
                </Button>
                <Button variant="outline" className="border-success/40 hover:bg-success/10" onClick={() => rate("nailed")}>
                  Nailed it
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
