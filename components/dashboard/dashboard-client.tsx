"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Target,
  Gauge,
  AlertTriangle,
  Bookmark as BookmarkIcon,
  Clock,
  Video,
  Sparkles,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { StatTile } from "@/components/dashboard/stat-tile";
import { CategoryBarList } from "@/components/dashboard/category-bar-list";
import { useAppStore } from "@/lib/store";
import { getCategory } from "@/lib/categories";
import { pickDailyItem, todayKey } from "@/lib/daily";
import type { ChapterSummary, InterviewQuestion } from "@/lib/content-types";

interface DashboardClientProps {
  chapters: ChapterSummary[];
  dailyQuestions: Pick<InterviewQuestion, "id" | "category" | "question" | "difficulty">[];
}

export function DashboardClient({ chapters, dailyQuestions }: DashboardClientProps) {
  const store = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const completedCount = Object.keys(store.completedChapters).length;
  const totalChapters = chapters.length;
  const readiness = store.readinessScore();
  const readinessTone = readiness >= 75 ? "good" : readiness >= 45 ? "warning" : "critical";

  const categoryProgress = React.useMemo(() => {
    const byCategory: Record<string, { done: number; total: number }> = {};
    for (const ch of chapters) {
      byCategory[ch.category] ??= { done: 0, total: 0 };
      byCategory[ch.category].total += 1;
      if (store.completedChapters[ch.slug]) byCategory[ch.category].done += 1;
    }
    return Object.entries(byCategory)
      .map(([slug, v]) => ({
        label: getCategory(slug)?.shortTitle ?? slug,
        value: v.total > 0 ? (v.done / v.total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [chapters, store.completedChapters]);

  const weakAreas = React.useMemo(
    () =>
      Object.entries(store.weakTopics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([slug, misses]) => ({ label: getCategory(slug)?.shortTitle ?? slug, misses })),
    [store.weakTopics]
  );

  const recentChapters = React.useMemo(() => {
    return Object.entries(store.completedChapters)
      .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())
      .slice(0, 5)
      .map(([slug]) => chapters.find((c) => c.slug === slug))
      .filter((c): c is ChapterSummary => Boolean(c));
  }, [store.completedChapters, chapters]);

  const dueRevisionCount = React.useMemo(
    () => Object.values(store.revisionCards).filter((c) => new Date(c.dueAt) <= new Date()).length,
    [store.revisionCards]
  );

  const daily = pickDailyItem(dailyQuestions);
  const today = todayKey();
  const dailyDone = store.dailyChallengeCompleted[today] === daily?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Architect.</h1>
        <p className="mt-1 text-muted-foreground">
          Here&rsquo;s where you stand today. Keep the streak alive &mdash; consistency beats cramming.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={BookOpen} label="Topics Completed" value={hydrated ? `${completedCount} / ${totalChapters}` : "—"} hint="Chapters marked done" />
        <StatTile icon={Target} label="Today's Goal" value="1 Chapter + 10 Qs" hint="Recommended daily pace" tone="default" />
        <StatTile
          icon={AlertTriangle}
          label="Weak Areas"
          value={hydrated ? `${weakAreas.length}` : "—"}
          hint={weakAreas[0]?.label ?? "None identified yet"}
          tone={weakAreas.length > 0 ? "warning" : "good"}
        />
        <StatTile icon={Clock} label="Revision Due" value={hydrated ? `${dueRevisionCount}` : "—"} hint="Cards due for spaced review" tone={dueRevisionCount > 0 ? "warning" : "good"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" /> Interview Readiness Score
            </CardTitle>
            <CardDescription>Weighted from chapters, quizzes, and mock interviews.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ProgressRing value={hydrated ? readiness : 0} tone={readinessTone} sublabel="Readiness" size={140} strokeWidth={12} />
            <p className="text-center text-xs text-muted-foreground">
              {readiness >= 75
                ? "Strong. Focus on Architect & Principal-level scenarios."
                : readiness >= 45
                ? "Building momentum. Add more mock interviews and quizzes."
                : "Just getting started. Work through core chapters first."}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Progress by Category
            </CardTitle>
            <CardDescription>Chapter completion across your learning path.</CardDescription>
          </CardHeader>
          <CardContent>
            {hydrated && categoryProgress.some((c) => c.value > 0) ? (
              <CategoryBarList data={categoryProgress} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No chapters completed yet. Start with{" "}
                <Link href="/learning-path" className="text-primary underline underline-offset-4">
                  the Learning Path
                </Link>
                .
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Daily Challenge
            </CardTitle>
            <CardDescription>A new question every day, picked for you.</CardDescription>
          </CardHeader>
          <CardContent>
            {daily ? (
              <div className="space-y-2">
                <Badge variant="outline">{daily.difficulty}</Badge>
                <p className="text-sm font-medium">{daily.question}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Question bank loading...</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" variant={dailyDone ? "secondary" : "default"} className="w-full">
              <Link href={daily ? `/questions/${daily.category}#${daily.id}` : "/questions"}>
                {dailyDone ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Reviewed today
                  </>
                ) : (
                  <>
                    Attempt Challenge <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" /> Upcoming Mock Interview
            </CardTitle>
            <CardDescription>Simulate a real panel round under time pressure.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {store.mockInterviewResults.length > 0
                ? `Last score: ${store.mockInterviewResults[0].score}/${store.mockInterviewResults[0].total} (${store.mockInterviewResults[0].category})`
                : "You haven't attempted a mock interview yet. Aim for one this week."}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link href="/mock-interview">
                Start Mock Interview <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4 text-primary" /> Recent Bookmarks
            </CardTitle>
            <CardDescription>Jump back into what you saved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hydrated && store.bookmarks.length > 0 ? (
              store.bookmarks.slice(0, 4).map((b) => (
                <Link key={b.id} href={b.href} className="block truncate text-sm text-foreground hover:text-primary">
                  {b.title}
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No bookmarks yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/bookmarks">View all bookmarks</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary" /> Recent Chapters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hydrated && recentChapters.length > 0 ? (
              recentChapters.map((c) => (
                <Link key={c.slug} href={c.href} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                  <span className="truncate">{c.title}</span>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Complete a chapter to see it here.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Weak Areas To Revisit
            </CardTitle>
            <CardDescription>Based on quiz misses tracked on this device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hydrated && weakAreas.length > 0 ? (
              weakAreas.map((w) => (
                <div key={w.label} className="flex items-center justify-between text-sm">
                  <span>{w.label}</span>
                  <Badge variant="warning">{w.misses} misses</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Take a quiz to surface weak areas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
