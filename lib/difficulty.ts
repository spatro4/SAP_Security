import type { Difficulty } from "./content-types";

export const DIFFICULTY_BADGE: Record<Difficulty, "success" | "default" | "warning" | "destructive" | "secondary"> = {
  Easy: "success",
  Medium: "default",
  Hard: "warning",
  Architect: "destructive",
  Manager: "secondary",
  "Principal Architect": "destructive",
};
