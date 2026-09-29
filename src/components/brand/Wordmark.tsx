import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  decorative?: boolean;
};

// The official wordmark is Tusker Grotesk 3500 Medium at its natural spacing.
// The viewBox hugs the ink of the letters at a font size of 1000.
export function Wordmark({ className, decorative }: Props) {
  return (
    <svg
      viewBox="28 -951 3840 958"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Joshua Black" })}
      className={cn("block h-auto w-full fill-current", className)}
    >
      <text
        x="0"
        y="0"
        textLength="3871"
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-tusker), 'Arial Narrow', sans-serif", fontSize: 1000, fontWeight: 500 }}
      >
        JOSHUA BLACK
      </text>
    </svg>
  );
}
