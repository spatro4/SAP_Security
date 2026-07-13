import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarNav } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MermaidHydrator } from "@/components/mermaid-hydrator";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export const metadata: Metadata = {
  title: {
    default: "SAP Security Architect Academy",
    template: "%s | SAP Security Architect Academy",
  },
  description:
    "Master SAP Security & Authorization from Consultant to Principal Architect. 1500+ interview questions, scenario labs, mock interviews, and deep architecture content for SAP Security professionals.",
  applicationName: "SAP Security Architect Academy",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.json`,
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icons/icon.svg`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a19" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border lg:block">
              <SidebarNav />
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
              <footer className="no-print border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
                SAP Security Architect Academy &mdash; Built for consultants, leads, and architects.
              </footer>
            </div>
          </div>
          <MermaidHydrator />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
