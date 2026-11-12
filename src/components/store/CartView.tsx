"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { PhoneField } from "@/components/store/PhoneField";
import { Select } from "@/components/ui/Select";
import type { CheckoutContent, LinkItem, Picture, ShopContent } from "@/content/types";
import { removeFromCart, setQuantity, useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { defaultDialCountry, isValidEmail, toInternational } from "@/store/phone";

export type CatalogItem = {
  slug: string;
  name: string;
  unitPrice: number;
  picture: Picture;
  /** The most one order may hold: the shop's limit or what is left in stock. */
  max: number;
};

type Props = {
  catalog: CatalogItem[];
  zones: ShopContent["zones"];
  states: readonly string[];
  copy: CheckoutContent;
  policies: LinkItem[];
};

type Field = "items" | "firstName" | "lastName" | "email" | "phone" | "address" | "city" | "state" | "agree";

const naira = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

const inputClasses =
  "h-12 w-full appearance-none border border-rule bg-transparent px-4 text-body text-ink outline-none transition-colors focus:border-ink";

// True once the browser's saved cart can be read, so the page never flashes "empty" first.
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);

type RowProps = { label: string; error?: string; children: ReactNode; htmlFor: string; labelId?: string };

function Row({ label, error, children, htmlFor, labelId }: RowProps) {
  return (
    <div>
      <label id={labelId} htmlFor={htmlFor} className="mb-2 block text-tiny uppercase text-mute">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-label text-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function CartView({ catalog, zones, states, copy, policies }: Props) {
  const hydrated = useHydrated();
  const cart = useCart();
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(defaultDialCountry);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field | "form", string>>>({});
  const [sending, setSending] = useState(false);

  const lines = cart.flatMap((line) => {
    const item = catalog.find((entry) => entry.slug === line.slug);
    return item ? [{ ...item, quantity: Math.min(line.quantity, Math.max(item.max, 1)) }] : [];
  });
  const unavailable = cart.filter((line) => !catalog.some((entry) => entry.slug === line.slug));
  const zone = state ? (zones.find((item) => item.states.includes(state)) ?? zones.find((item) => item.everywhereElse)) : undefined;
  const deliveryFree = zones.length > 0 && zones.every((item) => item.fee === 0);
  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
  const total = subtotal + (zone?.fee ?? 0);

  if (!hydrated) return <div className="min-h-[40svh]" />;

  if (lines.length === 0) {
    return (
      <div className="max-w-sm py-6">
        <p className="copy-lg">{copy.cart.empty}</p>
        <div className="mt-8">
          <Button href="/collection" variant="pine">
            {copy.cart.continueShopping}
          </Button>
        </div>
      </div>
    );
  }

  const setError = (field: Field, message?: string) => setErrors((current) => ({ ...current, [field]: message }));
  const checkEmail = () => setError("email", email.trim() && !isValidEmail(email) ? copy.form.emailInvalid : undefined);
  const checkPhone = () =>
    setError("phone", phone.trim() && !toInternational(phoneCountry, phone) ? copy.form.phoneInvalid : undefined);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!isValidEmail(email) || !toInternational(phoneCountry, phone)) {
      setErrors({
        email: isValidEmail(email) ? undefined : copy.form.emailInvalid,
        phone: toInternational(phoneCountry, phone) ? undefined : copy.form.phoneInvalid,
      });
      document.getElementById(isValidEmail(email) ? "phone" : "email")?.focus();
      return;
    }
    setSending(true);
    setErrors({});
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          items: lines.map((line) => ({ product: line.slug, quantity: line.quantity })),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email,
          phoneCountry,
          phone,
          address: data.get("address"),
          city: data.get("city"),
          state,
          agree: data.get("agree") === "on",
        }),
      });
      const result = (await response.json()) as { authorizationUrl?: string; message?: string; field?: Field };
      if (response.ok && result.authorizationUrl) {
        window.location.assign(result.authorizationUrl);
        return;
      }
      setErrors({ [result.field ?? "form"]: result.message ?? "Something went wrong. Please try again." });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    }
    setSending(false);
  }

  return (
    <form onSubmit={submit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
      <div>
        <ul className="border-t border-rule">
          {lines.map((line) => (
            <li key={line.slug} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-rule py-5 sm:grid-cols-[6rem_1fr]">
              <Link href={`/collection/${line.slug}`} aria-label={line.name}>
                <Frame picture={line.picture} sizes="96px" />
              </Link>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/collection/${line.slug}`} className="heading-sm truncate">
                    {line.name}
                  </Link>
                  <span className="shrink-0 text-body">{naira(line.unitPrice * line.quantity)}</span>
                </div>
                <p className="text-label text-mute">{naira(line.unitPrice)}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div role="group" aria-label={`${copy.cart.quantityLabel}: ${line.name}`} className="flex h-10 items-center border border-rule">
                    <button
                      type="button"
                      aria-label="One fewer"
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="grid h-full w-10 place-items-center"
                    >
                      −
                    </button>
                    <span aria-live="polite" className="w-8 text-center text-body">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="One more"
                      disabled={line.quantity >= line.max}
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      className="grid h-full w-10 place-items-center disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(line.slug)} className="text-label text-mute">
                    <span className="link-line-in">{copy.cart.remove}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {unavailable.map((line) => (
          <p key={line.slug} className="mt-4 text-label text-mute">
            {line.slug} is no longer available.{" "}
            <button type="button" onClick={() => removeFromCart(line.slug)} className="link-line-in">
              {copy.cart.remove}
            </button>
          </p>
        ))}
        {errors.items && (
          <p role="alert" className="mt-4 text-label text-ink">
            {errors.items}
          </p>
        )}

        <h2 className="heading-sm mt-12">{copy.cart.detailsTitle}</h2>
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Row label={copy.form.firstNameLabel} htmlFor="firstName" error={errors.firstName}>
              <input id="firstName" name="firstName" autoComplete="given-name" required className={inputClasses} />
            </Row>
            <Row label={copy.form.lastNameLabel} htmlFor="lastName" error={errors.lastName}>
              <input id="lastName" name="lastName" autoComplete="family-name" required className={inputClasses} />
            </Row>
          </div>
          <Row label={copy.form.emailLabel} htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email && isValidEmail(event.target.value)) setError("email");
              }}
              onBlur={checkEmail}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(inputClasses, errors.email && "border-ink")}
            />
          </Row>
          <Row label={copy.form.phoneLabel} htmlFor="phone" error={errors.phone}>
            <PhoneField
              id="phone"
              country={phoneCountry}
              number={phone}
              onCountry={(code) => {
                setPhoneCountry(code);
                if (errors.phone && toInternational(code, phone)) setError("phone");
              }}
              onNumber={(value) => {
                setPhone(value);
                if (errors.phone && toInternational(phoneCountry, value)) setError("phone");
              }}
              onBlur={checkPhone}
              invalid={Boolean(errors.phone)}
              countryLabel={copy.form.countryCodeLabel}
            />
          </Row>
          <Row label={copy.form.addressLabel} htmlFor="address" error={errors.address}>
            <textarea
              id="address"
              name="address"
              autoComplete="street-address"
              rows={3}
              required
              className={cn(inputClasses, "h-auto py-3")}
            />
          </Row>
          <div className="grid gap-6 sm:grid-cols-2">
            <Row label={copy.form.cityLabel} htmlFor="city" error={errors.city}>
              <input id="city" name="city" autoComplete="address-level2" required className={inputClasses} />
            </Row>
            <Row label={copy.form.stateLabel} htmlFor="state" labelId="state-label" error={errors.state}>
              <Select
                id="state"
                labelledBy="state-label"
                value={state}
                onChange={(value) => {
                  setState(value);
                  setError("state");
                }}
                options={states.map((item) => ({ value: item, label: item }))}
                invalid={Boolean(errors.state)}
              />
            </Row>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:mt-0 lg:self-start">
        <dl className="border-y border-rule py-5 text-body">
          <div className="flex justify-between py-1">
            <dt className="text-mute">{copy.form.subtotalLabel}</dt>
            <dd>{naira(subtotal)}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-mute">
              {copy.form.deliveryLabel}
              {zone && !deliveryFree ? ` · ${zone.name}` : ""}
            </dt>
            <dd>{deliveryFree || zone?.fee === 0 ? copy.form.deliveryIncluded : zone ? naira(zone.fee) : "—"}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-rule pt-3 font-bold">
            <dt>{copy.form.totalLabel}</dt>
            <dd aria-live="polite">{naira(total)}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <label className="flex items-start gap-3 text-label">
            <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-pine)]" />
            <span>
              {copy.form.agreement}{" "}
              {policies.length === 0 && "policies"}
              {policies.map((policy, index) => (
                <span key={policy.href}>
                  {index > 0 && (index === policies.length - 1 ? " and " : ", ")}
                  <Link href={policy.href} target="_blank" className="link-line-in text-pine">
                    {policy.label.toLowerCase()}
                  </Link>
                </span>
              ))}
              .
            </span>
          </label>
          {errors.agree && (
            <p role="alert" className="mt-2 text-label text-ink">
              {errors.agree}
            </p>
          )}
        </div>

        {errors.form && (
          <p role="alert" className="mt-4 text-label text-ink">
            {errors.form}
          </p>
        )}
        <button type="submit" disabled={sending} className={buttonClasses("pine", "default", "mt-6 disabled:opacity-60 max-lg:mx-auto max-lg:max-w-xs")}>
          {sending ? "…" : copy.cart.payLabel}
        </button>
      </div>
    </form>
  );
}
