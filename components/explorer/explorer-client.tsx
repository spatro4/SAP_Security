"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AuthObjectEntry, TransactionEntry, TableEntry } from "@/lib/content-types";

export function ExplorerClient({
  authObjects,
  transactions,
  tables,
}: {
  authObjects: AuthObjectEntry[];
  transactions: TransactionEntry[];
  tables: TableEntry[];
}) {
  const [query, setQuery] = React.useState("");
  const q = query.toLowerCase();

  const filteredObjects = authObjects.filter((o) => o.object.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  const filteredTx = transactions.filter((t) => t.tcode.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  const filteredTables = tables.filter((t) => t.table.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));

  return (
    <div className="space-y-4">
      <Input placeholder="Search objects, transactions, tables..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
      <Tabs defaultValue="objects">
        <TabsList>
          <TabsTrigger value="objects">Authorization Objects ({filteredObjects.length})</TabsTrigger>
          <TabsTrigger value="tcodes">Transactions ({filteredTx.length})</TabsTrigger>
          <TabsTrigger value="tables">Tables ({filteredTables.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="objects" className="space-y-2">
          {filteredObjects.map((o) => (
            <Card key={o.object}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-semibold text-primary">{o.object}</code>
                  <Badge variant="outline">{o.category}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
                {o.fields.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {o.fields.map((f) => (
                      <Badge key={f.field} variant="secondary" title={f.description}>
                        {f.field}
                      </Badge>
                    ))}
                  </div>
                )}
                {o.relatedTcodes.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">Used by: {o.relatedTcodes.join(", ")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tcodes" className="space-y-2">
          {filteredTx.map((t) => (
            <Card key={t.tcode}>
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <div>
                  <code className="font-semibold text-primary">{t.tcode}</code>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <Badge variant="outline">{t.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tables" className="space-y-2">
          {filteredTables.map((t) => (
            <Card key={t.table}>
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <div>
                  <code className="font-semibold text-primary">{t.table}</code>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <Badge variant="outline">{t.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
