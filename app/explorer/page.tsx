import { Compass } from "lucide-react";
import { getAllAuthObjects, getAllTransactions, getAllTables } from "@/lib/content";
import { ExplorerClient } from "@/components/explorer/explorer-client";

export const metadata = { title: "Explorer" };

export default function ExplorerPage() {
  const authObjects = getAllAuthObjects();
  const transactions = getAllTransactions();
  const tables = getAllTables();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Authorization Object / Transaction / Table Explorer</h1>
          <p className="mt-1 text-muted-foreground">Look up any object, tcode, or table the moment it comes up in an interview or a ticket.</p>
        </div>
      </div>
      <ExplorerClient authObjects={authObjects} transactions={transactions} tables={tables} />
    </div>
  );
}
