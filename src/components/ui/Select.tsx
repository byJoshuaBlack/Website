"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
  /** Shown in the list beside the label, such as a dialling code. */
  detail?: string;
  /** What the closed field shows instead of the label, when shorter. */
  short?: ReactNode;
};

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** The visible label's id, or a name for screen readers when there is none. */
  labelledBy?: string;
  label?: string;
  invalid?: boolean;
  /** "field" fills its row like an input; "inline" sits inside another field, such as the phone's code. */
  variant?: "field" | "inline";
  onBlur?: () => void;
};

// The site's own dropdown: a square, hairline list on linen instead of the browser's menu. It follows
// the listbox pattern: arrows move, Enter or Space chooses, Escape closes, typing jumps to a match.
export function Select({ id, value, onChange, options, placeholder = "—", labelledBy, label, invalid, variant = "field", onBlur }: Props) {
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [upward, setUpward] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = (index = selectedIndex) => {
    // Opens upward when the list would run under the bottom dock or off the screen.
    const box = root.current?.getBoundingClientRect();
    if (box) setUpward(window.innerHeight - box.bottom < 400 && box.top > 320);
    setActive(index >= 0 ? index : 0);
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) setActive((index) => Math.min(index + 1, last));
        else show();
        return;
      case "ArrowUp":
        event.preventDefault();
        if (open) setActive((index) => Math.max(index - 1, 0));
        else show();
        return;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(last);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else show();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : "") + event.key.toLowerCase(), at: now };
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(typed.current.text));
      if (match >= 0) {
        if (open) setActive(match);
        else onChange(options[match]!.value);
      }
    }
  }

  return (
    <div ref={root} className={cn("relative", variant === "field" && "w-full")}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={(event) => {
          // Safari does not focus buttons on click; the keys below need focus.
          event.currentTarget.focus();
          if (open) setOpen(false);
          else show();
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={cn(
          "flex items-center gap-2 text-left text-body text-ink outline-none",
          variant === "field"
            ? cn(
                "h-12 w-full border bg-transparent px-4 transition-colors focus-visible:border-ink",
                invalid ? "border-ink" : open ? "border-ink" : "border-rule",
              )
            : "h-full shrink-0 pl-4 pr-3",
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-mute")}>
          {selected ? (selected.short ?? selected.label) : placeholder}
        </span>
        <Icon name="chevron-down" size={16} className={cn("shrink-0 transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : label}
          className={cn(
            "absolute z-50 max-h-72 overflow-y-auto border border-ink bg-paper py-1",
            upward ? "bottom-full mb-1" : "top-full mt-1",
            variant === "field" ? "inset-x-0" : "left-0 w-72 max-w-[calc(100vw-2*var(--gutter,1rem))]",
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              onPointerMove={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-body",
                index === active && "bg-tile",
                option.value === value && "text-pine",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {option.detail && <span className="shrink-0 text-label text-mute">{option.detail}</span>}
              {option.value === value && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-pine" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
