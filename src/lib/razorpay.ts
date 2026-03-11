import crypto from 'crypto';

export interface StoredOrderItem {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface StoredOrderCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

export interface StoredOrder {
  id: string;
  status: 'created' | 'paid';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  items: StoredOrderItem[];
  customer?: StoredOrderCustomer;
  createdAt: string;
  paidAt?: string;
}

export type FulfillmentStatus =
  | 'payment_pending'
  | 'payment_confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'completed';

export interface OrderTrackingStep {
  id: 'placed' | 'paid' | 'preparing' | 'ready' | 'completed';
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
}

export interface OrderTrackingSnapshot {
  orderId: string;
  paymentStatus: StoredOrder['status'];
  fulfillmentStatus: FulfillmentStatus;
  amount: number;
  currency: string;
  items: StoredOrderItem[];
  customer?: StoredOrderCustomer;
  createdAt: string;
  paidAt?: string;
  etaMinutes: number | null;
  steps: OrderTrackingStep[];
}

const orderStore = new Map<string, StoredOrder>();

const getRazorpayEnv = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Missing Razorpay environment variables.');
  }

  return { keyId, keySecret };
};

export const createInternalOrder = (input: Omit<StoredOrder, 'id' | 'status' | 'createdAt'>) => {
  const id = crypto.randomUUID();
  const stored: StoredOrder = {
    id,
    status: 'created',
    createdAt: new Date().toISOString(),
    ...input,
  };
  orderStore.set(id, stored);
  return stored;
};

export const attachRazorpayOrder = (internalId: string, razorpayOrderId: string) => {
  const existing = orderStore.get(internalId);
  if (!existing) return null;
  const updated: StoredOrder = { ...existing, razorpayOrderId };
  orderStore.set(internalId, updated);
  return updated;
};

export const markOrderPaid = (internalId: string, razorpayPaymentId?: string) => {
  const existing = orderStore.get(internalId);
  if (!existing) return null;
  const updated: StoredOrder = {
    ...existing,
    status: 'paid',
    paidAt: existing.paidAt ?? new Date().toISOString(),
    razorpayPaymentId: razorpayPaymentId ?? existing.razorpayPaymentId,
  };
  orderStore.set(internalId, updated);
  return updated;
};

export const getOrder = (internalId: string) => orderStore.get(internalId);

export const getOrderTracking = (
  internalId: string
): OrderTrackingSnapshot | null => {
  const order = getOrder(internalId);
  if (!order) return null;

  const transitionMinutes = {
    preparing: 2,
    ready: 15,
    completed: 35,
  };

  const paidAtTime = order.paidAt ? new Date(order.paidAt).getTime() : null;
  const elapsedMinutes =
    paidAtTime === null
      ? null
      : Math.max(0, (Date.now() - paidAtTime) / (1000 * 60));

  let fulfillmentStatus: FulfillmentStatus = 'payment_pending';
  let currentStepIndex = 0;
  let etaMinutes: number | null = null;

  if (order.status === 'paid' && elapsedMinutes !== null) {
    if (elapsedMinutes < transitionMinutes.preparing) {
      fulfillmentStatus = 'payment_confirmed';
      currentStepIndex = 1;
      etaMinutes = Math.max(
        1,
        Math.ceil(transitionMinutes.ready - elapsedMinutes)
      );
    } else if (elapsedMinutes < transitionMinutes.ready) {
      fulfillmentStatus = 'preparing';
      currentStepIndex = 2;
      etaMinutes = Math.max(
        1,
        Math.ceil(transitionMinutes.ready - elapsedMinutes)
      );
    } else if (elapsedMinutes < transitionMinutes.completed) {
      fulfillmentStatus = 'ready_for_pickup';
      currentStepIndex = 3;
      etaMinutes = 0;
    } else {
      fulfillmentStatus = 'completed';
      currentStepIndex = 4;
      etaMinutes = null;
    }
  }

  const formatIsoOffset = (baseIso: string, minutesToAdd: number) =>
    new Date(new Date(baseIso).getTime() + minutesToAdd * 60 * 1000).toISOString();

  const stepsTemplate = [
    {
      id: 'placed' as const,
      label: 'Order Placed',
      description: 'Order has been created.',
      timestamp: order.createdAt,
    },
    {
      id: 'paid' as const,
      label: 'Payment Confirmed',
      description: 'Payment has been verified.',
      timestamp: order.paidAt,
    },
    {
      id: 'preparing' as const,
      label: 'Preparing',
      description: 'Kitchen is preparing your meal.',
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.preparing)
        : undefined,
    },
    {
      id: 'ready' as const,
      label: 'Ready for Pickup',
      description: 'Meal is ready at your selected point.',
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.ready)
        : undefined,
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      description: 'Order has been marked complete.',
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.completed)
        : undefined,
    },
  ];

  const steps: OrderTrackingStep[] = stepsTemplate.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? 'completed'
        : index === currentStepIndex
          ? 'current'
          : 'upcoming',
  }));

  return {
    orderId: order.id,
    paymentStatus: order.status,
    fulfillmentStatus,
    amount: order.amount,
    currency: order.currency,
    items: order.items,
    customer: order.customer,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    etaMinutes,
    steps,
  };
};

export const createRazorpayOrder = async (payload: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) => {
  const { keyId, keySecret } = getRazorpayEnv();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
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
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  return expected === payload.signature;
};
