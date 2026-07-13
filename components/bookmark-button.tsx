"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, type BookmarkType } from "@/lib/store";

interface BookmarkButtonProps {
  id: string;
  type: BookmarkType;
  title: string;
  href: string;
  category?: string;
  size?: "default" | "sm" | "icon";
}

export function BookmarkButton({ id, type, title, href, category, size = "sm" }: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const bookmarked = hydrated && bookmarks.some((b) => b.id === id);

  return (
    <Button
      variant={bookmarked ? "secondary" : "outline"}
      size={size}
      onClick={() => (bookmarked ? removeBookmark(id) : addBookmark({ id, type, title, href, category }))}
      aria-pressed={bookmarked}
    >
      {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {size !== "icon" && <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>}
    </Button>
  );
}
