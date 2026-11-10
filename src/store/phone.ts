// Phone numbers are stored in international form (+2348031234567) so they can be texted without
// guessing. Shared by the checkout form and the server.

export type DialCountry = {
  code: string;
  name: string;
  flag: string;
  dial: string;
  /** An example shown in the empty field. */
  example: string;
  /** How many digits follow the dialling code, without a leading 0. */
  digits: [number, number];
  /** Digits a mobile number may start with, when that is fixed. */
  starts?: string;
};

export const dialCountries: DialCountry[] = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dial: "+234", example: "803 123 4567", digits: [10, 10], starts: "789" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", dial: "+233", example: "24 123 4567", digits: [9, 9] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44", example: "7400 123456", digits: [10, 10] },
  { code: "US", name: "United States and Canada", flag: "🇺🇸", dial: "+1", example: "201 555 0123", digits: [10, 10] },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dial: "+27", example: "71 123 4567", digits: [9, 9] },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dial: "+254", example: "712 345678", digits: [9, 9] },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dial: "+971", example: "50 123 4567", digits: [9, 9] },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dial: "+353", example: "85 012 3456", digits: [9, 9] },
];

export const defaultDialCountry = "NG";

export const findDialCountry = (code: string) => dialCountries.find((country) => country.code === code);

/** The digits after the dialling code: spaces and dashes dropped, and a leading trunk 0 too. */
export function nationalDigits(input: string): string {
  return input.replace(/\D/g, "").replace(/^0+/, "");
}

/** Returns the number in international form, or undefined when it does not fit the country. */
export function toInternational(countryCode: string, input: string): string | undefined {
  const country = findDialCountry(countryCode);
  if (!country) return undefined;
  const digits = nationalDigits(input);
  const [min, max] = country.digits;
  if (digits.length < min || digits.length > max) return undefined;
  if (country.starts && !country.starts.includes(digits[0]!)) return undefined;
  return `${country.dial}${digits}`;
}

/** Groups digits as they are typed, following the country's example. */
export function formatAsTyped(countryCode: string, input: string): string {
  const country = findDialCountry(countryCode);
  const digits = input.replace(/\D/g, "").slice(0, (country?.digits[1] ?? 14) + 1);
  if (!country) return digits;
  const groups = country.example.split(" ").map((group) => group.length);
  // A leading 0 (as Nigerians often type it) goes with the first group.
  if (digits.startsWith("0")) groups[0] = (groups[0] ?? 0) + 1;
  const parts: string[] = [];
  let at = 0;
  for (const size of groups) {
    if (at >= digits.length) break;
    parts.push(digits.slice(at, at + size));
    at += size;
  }
  if (at < digits.length) parts.push(digits.slice(at));
  return parts.join(" ");
}

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
