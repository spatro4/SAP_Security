import { CATEGORIES } from "./categories";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
      { title: "Learning Path", href: "/learning-path", icon: "Map" },
    ],
  },
  {
    title: "Chapters",
    items: CATEGORIES.map((c) => ({
      title: c.shortTitle,
      href: `/chapters/${c.slug}`,
      icon: c.icon,
    })),
  },
  {
    title: "Practice",
    items: [
      { title: "Interview Questions", href: "/questions", icon: "MessagesSquare" },
      { title: "Scenario Labs", href: "/scenarios", icon: "FlaskConical" },
      { title: "Quiz Engine", href: "/quiz", icon: "ListChecks" },
      { title: "Flash Cards", href: "/flashcards", icon: "Layers3" },
      { title: "Mock Interview", href: "/mock-interview", icon: "Video" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Architecture", href: "/architecture", icon: "Workflow" },
      { title: "Audit & Compliance", href: "/audit", icon: "Scale" },
      { title: "Cheat Sheets", href: "/cheat-sheets", icon: "FileText" },
      { title: "Glossary", href: "/glossary", icon: "BookOpenText" },
      { title: "Explorer", href: "/explorer", icon: "Compass" },
      { title: "Roadmaps", href: "/roadmaps", icon: "Route" },
      { title: "Downloads", href: "/downloads", icon: "Download" },
    ],
  },
  {
    title: "You",
    items: [
      { title: "Notes", href: "/notes", icon: "NotebookPen" },
      { title: "Bookmarks", href: "/bookmarks", icon: "Bookmark" },
      { title: "Revision", href: "/revision", icon: "RotateCcw" },
      { title: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
];
