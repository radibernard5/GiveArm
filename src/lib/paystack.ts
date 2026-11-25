const PAYSTACK_BASE_URL = "https://api.paystack.co";

export function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  return key;
}

interface InitializePaystackParams {
  email: string;
  amount: number;
  currency: "GHS" | "USD";
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels: Array<"card" | "mobile_money">;
}

export async function initializePaystackTransaction(params: InitializePaystackParams) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      channels: params.channels,
      metadata: params.metadata,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Failed to initialize Paystack transaction");
  }

  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
    },
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Failed to verify Paystack transaction");
  }
  return data.data as {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    paid_at?: string;
    customer?: { email?: string };
    metadata?: Record<string, unknown>;
  };
}
