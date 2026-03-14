import crypto from "node:crypto";

const getRazorpayEnv = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay environment variables.");
  }

  return { keyId, keySecret };
};

export const createRazorpayOrder = async (payload: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) => {
  const { keyId, keySecret } = getRazorpayEnv();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency,
      receipt: payload.receipt,
      payment_capture: 1,
      notes: payload.notes ?? {},
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to create Razorpay order: ${message}`);
  }

  return (await response.json()) as {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status: string;
  };
};

export const verifyRazorpaySignature = (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  const { keySecret } = getRazorpayEnv();
  const body = `${payload.orderId}|${payload.paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  return expected === payload.signature;
};
