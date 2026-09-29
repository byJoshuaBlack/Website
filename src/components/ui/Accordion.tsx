import type { ReactNode } from "react";
import { Icon } from "./Icon";

export type AccordionItem = {
  title: string;
  content: ReactNode;
  open?: boolean;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="border-t border-rule">
      {items.map((item) => (
        <details key={item.title} open={item.open} className="group/acc border-b border-rule">
          <summary className="flex list-none items-center justify-between py-4 text-label">
            {item.title}
            <Icon
              name="chevron-down"
              size={16}
              className="transition-transform duration-300 ease-editorial group-open/acc:rotate-180"
            />
          </summary>
          <div className="pb-5 text-label text-mute">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
