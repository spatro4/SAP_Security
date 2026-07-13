"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookmarkType = "chapter" | "question" | "scenario" | "flashcard";

export interface Bookmark {
  id: string;
  type: BookmarkType;
  title: string;
  href: string;
  category?: string;
  createdAt: string;
}

export interface NoteEntry {
  id: string; // usually tied to a chapter/question slug, or "general:<uuid>"
  refHref?: string;
  title: string;
  body: string;
  updatedAt: string;
}

export interface RevisionCard {
  id: string;
  type: BookmarkType;
  interval: number; // days
  ease: number;
  dueAt: string; // ISO date
  lastResult?: "again" | "hard" | "good" | "easy";
  reviewCount: number;
}

export interface QuizAttempt {
  id: string;
  category: string;
  score: number;
  total: number;
  takenAt: string;
}

export interface MockInterviewResult {
  id: string;
  difficulty: string;
  category: string;
  score: number;
  total: number;
  durationSeconds: number;
  takenAt: string;
  weakAreas: string[];
}

interface AppState {
  completedChapters: Record<string, string>; // slug -> ISO date completed
  chapterSectionProgress: Record<string, string[]>; // slug -> completed section ids
  bookmarks: Bookmark[];
  notes: NoteEntry[];
  revisionCards: Record<string, RevisionCard>;
  quizAttempts: QuizAttempt[];
  mockInterviewResults: MockInterviewResult[];
  dailyChallengeCompleted: Record<string, string>; // date -> questionId
  weakTopics: Record<string, number>; // category -> miss count

  markChapterComplete: (slug: string) => void;
  markChapterIncomplete: (slug: string) => void;
  toggleSectionComplete: (slug: string, sectionId: string) => void;

  addBookmark: (b: Omit<Bookmark, "createdAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  upsertNote: (n: Omit<NoteEntry, "updatedAt">) => void;
  removeNote: (id: string) => void;

  reviewCard: (id: string, type: BookmarkType, result: "again" | "hard" | "good" | "easy") => void;

  recordQuizAttempt: (a: Omit<QuizAttempt, "id" | "takenAt">) => void;
  recordMockInterview: (r: Omit<MockInterviewResult, "id" | "takenAt">) => void;
  recordDailyChallenge: (date: string, questionId: string) => void;
  registerMiss: (category: string) => void;

  readinessScore: () => number;
  resetAll: () => void;
}

const SM2_INTERVALS = [1, 3, 7, 16, 35, 75];

function nextInterval(current: RevisionCard | undefined, result: "again" | "hard" | "good" | "easy") {
  const idx = current ? SM2_INTERVALS.indexOf(current.interval) : -1;
  let ease = current?.ease ?? 2.5;
  let interval: number;

  if (result === "again") {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  } else if (result === "hard") {
    interval = SM2_INTERVALS[Math.max(0, idx)] ?? 1;
    ease = Math.max(1.3, ease - 0.15);
  } else if (result === "good") {
    interval = SM2_INTERVALS[Math.min(SM2_INTERVALS.length - 1, idx + 1)] ?? 1;
    ease += 0.05;
  } else {
    interval = Math.round((SM2_INTERVALS[Math.min(SM2_INTERVALS.length - 1, idx + 2)] ?? 3) * ease);
    ease += 0.15;
  }
  return { interval, ease };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      completedChapters: {},
      chapterSectionProgress: {},
      bookmarks: [],
      notes: [],
      revisionCards: {},
      quizAttempts: [],
      mockInterviewResults: [],
      dailyChallengeCompleted: {},
      weakTopics: {},

      markChapterComplete: (slug) =>
        set((s) => ({
          completedChapters: { ...s.completedChapters, [slug]: new Date().toISOString() },
        })),

      markChapterIncomplete: (slug) =>
        set((s) => {
          const next = { ...s.completedChapters };
          delete next[slug];
          return { completedChapters: next };
        }),

      toggleSectionComplete: (slug, sectionId) =>
        set((s) => {
          const current = s.chapterSectionProgress[slug] ?? [];
          const has = current.includes(sectionId);
          const updated = has ? current.filter((id) => id !== sectionId) : [...current, sectionId];
          return { chapterSectionProgress: { ...s.chapterSectionProgress, [slug]: updated } };
        }),

      addBookmark: (b) =>
        set((s) => {
          if (s.bookmarks.some((x) => x.id === b.id)) return s;
          return { bookmarks: [{ ...b, createdAt: new Date().toISOString() }, ...s.bookmarks] };
        }),

      removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),

      upsertNote: (n) =>
        set((s) => {
          const idx = s.notes.findIndex((x) => x.id === n.id);
          const entry = { ...n, updatedAt: new Date().toISOString() };
          if (idx === -1) return { notes: [entry, ...s.notes] };
          const next = [...s.notes];
          next[idx] = entry;
          return { notes: next };
        }),

      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      reviewCard: (id, type, result) =>
        set((s) => {
          const current = s.revisionCards[id];
          const { interval, ease } = nextInterval(current, result);
          const dueAt = new Date();
          dueAt.setDate(dueAt.getDate() + interval);
          return {
            revisionCards: {
              ...s.revisionCards,
              [id]: {
                id,
                type,
                interval,
                ease,
                dueAt: dueAt.toISOString(),
                lastResult: result,
                reviewCount: (current?.reviewCount ?? 0) + 1,
              },
            },
          };
        }),

      recordQuizAttempt: (a) =>
        set((s) => ({
          quizAttempts: [
            { ...a, id: `${Date.now()}`, takenAt: new Date().toISOString() },
            ...s.quizAttempts,
          ].slice(0, 200),
        })),

      recordMockInterview: (r) =>
        set((s) => ({
          mockInterviewResults: [
            { ...r, id: `${Date.now()}`, takenAt: new Date().toISOString() },
            ...s.mockInterviewResults,
          ].slice(0, 100),
        })),

      recordDailyChallenge: (date, questionId) =>
        set((s) => ({ dailyChallengeCompleted: { ...s.dailyChallengeCompleted, [date]: questionId } })),

      registerMiss: (category) =>
        set((s) => ({ weakTopics: { ...s.weakTopics, [category]: (s.weakTopics[category] ?? 0) + 1 } })),

      readinessScore: () => {
        const s = get();
        const chapterScore = Math.min(1, Object.keys(s.completedChapters).length / 15) * 35;
        const quizzes = s.quizAttempts.slice(0, 20);
        const quizAvg =
          quizzes.length > 0
            ? quizzes.reduce((acc, q) => acc + q.score / Math.max(1, q.total), 0) / quizzes.length
            : 0;
        const quizScore = quizAvg * 35;
        const mocks = s.mockInterviewResults.slice(0, 10);
        const mockAvg =
          mocks.length > 0
            ? mocks.reduce((acc, m) => acc + m.score / Math.max(1, m.total), 0) / mocks.length
            : 0;
        const mockScore = mockAvg * 30;
        return Math.round(Math.min(100, chapterScore + quizScore + mockScore));
      },

      resetAll: () =>
        set({
          completedChapters: {},
          chapterSectionProgress: {},
          bookmarks: [],
          notes: [],
          revisionCards: {},
          quizAttempts: [],
          mockInterviewResults: [],
          dailyChallengeCompleted: {},
          weakTopics: {},
        }),
    }),
    { name: "sap-security-academy-store" }
  )
);
