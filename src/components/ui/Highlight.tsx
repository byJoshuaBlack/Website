import type { ReactNode } from "react";

type Mark = { text: string; className: string };

type Props = {
  text: string;
  marks: Mark[];
};

export function Highlight({ text, marks }: Props) {
  const found = marks
    .map((mark) => ({ ...mark, at: mark.text ? text.indexOf(mark.text) : -1 }))
    .filter((mark) => mark.at >= 0)
    .sort((a, b) => a.at - b.at);

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const mark of found) {
    if (mark.at < cursor) continue;
    parts.push(text.slice(cursor, mark.at));
    parts.push(
      <span key={mark.at} className={mark.className}>
        {mark.text}
      </span>,
    );
    cursor = mark.at + mark.text.length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
