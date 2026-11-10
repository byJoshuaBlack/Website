// Paystack's hosted checkout: the site starts a transaction, the buyer pays on Paystack's page,
// and the site confirms the payment by asking Paystack directly. Card details never touch the site.

const apiUrl = () => process.env.PAYSTACK_API_URL || "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

type Envelope<T> = { status: boolean; message: string; data: T };

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json", ...init.headers },
  });
  const body = (await response.json().catch(() => null)) as Envelope<T> | null;
  if (!response.ok || !body?.status) {
    throw new Error(`Paystack ${path.split("/")[2] ?? path} failed: ${body?.message ?? response.status}`);
  }
  return body.data;
}

export async function initializePayment(args: {
  email: string;
  /** Kobo: naira × 100. */
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorizationUrl: string }> {
  const data = await call<{ authorization_url: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: args.email,
      amount: args.amount,
      currency: "NGN",
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
    }),
  });
  return { authorizationUrl: data.authorization_url };
}

export type Verification = {
  status: "success" | "failed" | "abandoned" | "reversed" | "ongoing" | "pending" | "queued" | string;
  /** Kobo. */
  amount: number;
  currency: string;
  channel?: string;
  paidAt?: string;
};

export async function verifyPayment(reference: string): Promise<Verification> {
  const data = await call<{ status: string; amount: number; currency: string; channel?: string; paid_at?: string }>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
  return { status: data.status, amount: data.amount, currency: data.currency, channel: data.channel, paidAt: data.paid_at };
}

/** Paystack signs each webhook with HMAC SHA-512 of the raw body, keyed with the secret key. */
export async function isValidSignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!signature) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secretKey()), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody)));
  const expected = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}
