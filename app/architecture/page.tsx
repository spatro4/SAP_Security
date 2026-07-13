import { Workflow } from "lucide-react";
import { getAllDiagrams } from "@/lib/content";
import { ArchitectureGallery } from "@/components/architecture/architecture-gallery";

export const metadata = { title: "Architecture" };

export default function ArchitecturePage() {
  const diagrams = getAllDiagrams();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Workflow className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Architecture Diagrams</h1>
          <p className="mt-1 text-muted-foreground">Every core SAP Security flow, visualized end-to-end.</p>
        </div>
      </div>
      {diagrams.length === 0 ? (
        <p className="text-sm text-muted-foreground">Diagrams are being authored. Check back soon.</p>
      ) : (
        <ArchitectureGallery diagrams={diagrams} />
      )}
    </div>
  );
}
