import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const layouts = {
  2: "grid-cols-1 md:grid-cols-2",
  // Two to a row on phones, where an odd tile out spans the row.
  3: "grid-cols-2 md:grid-cols-3 [&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:col-span-1",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function TileGrid({ columns, children, className }: { columns: 2 | 3 | 4; children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-px", layouts[columns], className)}>{children}</div>;
}
