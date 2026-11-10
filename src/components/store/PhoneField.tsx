"use client";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { dialCountries, findDialCountry, formatAsTyped } from "@/store/phone";

type Props = {
  id: string;
  country: string;
  number: string;
  onCountry: (code: string) => void;
  onNumber: (value: string) => void;
  onBlur: () => void;
  invalid?: boolean;
  countryLabel: string;
};

const options = dialCountries.map((country) => ({
  value: country.code,
  label: `${country.flag}  ${country.name}`,
  detail: country.dial,
  short: (
    <span className="tabular-nums">
      {country.flag} {country.dial}
    </span>
  ),
}));

// One field: the country's dialling code on the left, then the number, hinted with an example.
export function PhoneField({ id, country, number, onCountry, onNumber, onBlur, invalid, countryLabel }: Props) {
  const example = findDialCountry(country)?.example;
  return (
    <div
      className={cn(
        "flex h-12 w-full items-stretch border bg-transparent transition-colors focus-within:border-ink",
        invalid ? "border-ink" : "border-rule",
      )}
    >
      <Select variant="inline" value={country} onChange={onCountry} options={options} label={countryLabel} />
      <span aria-hidden="true" className="my-3 w-px bg-rule" />
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={number}
        onChange={(event) => onNumber(formatAsTyped(country, event.target.value))}
        onBlur={onBlur}
        placeholder={example}
        aria-invalid={invalid || undefined}
        className="min-w-0 flex-1 bg-transparent px-4 text-body tabular-nums text-ink outline-none placeholder:text-mute/60"
      />
    </div>
  );
}
