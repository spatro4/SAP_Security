import type { ComponentType } from "react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = (Icons as unknown as Record<string, ComponentType<LucideProps>>)[name];
  if (!Cmp) return <Icons.Circle {...props} />;
  return <Cmp {...props} />;
}
