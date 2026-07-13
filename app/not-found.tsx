import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">404 — No Authorization Found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        This page doesn&rsquo;t exist, or the authorization object protecting it was never proposed in SU24.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
