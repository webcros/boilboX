import type { OrderTracking } from "./types";

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

export type PaymentStatus = "created" | "paid";

export type FulfillmentStatus =
  | "payment_pending"
  | "payment_confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "completed";

export interface StoredOrder {
  id: string;
  userId: string;
  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  items: StoredOrderItem[];
  customer?: StoredOrderCustomer;
  createdAt: string;
  paidAt?: string;
}

export interface OrderTrackingStep {
  id: "placed" | "paid" | "preparing" | "ready" | "completed";
  label: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  timestamp?: string;
}

export interface OrderTrackingSnapshot extends OrderTracking {}

const FULFILLMENT_STATUS_SEQUENCE: FulfillmentStatus[] = [
  "payment_pending",
  "payment_confirmed",
  "preparing",
  "ready_for_pickup",
  "completed",
];

export const ORDER_SELECT_FIELDS = [
  "id",
  "user_id",
  "payment_status",
  "fulfillment_status",
  "razorpay_order_id",
  "razorpay_payment_id",
  "amount",
  "currency",
  "items",
  "customer",
  "created_at",
  "paid_at",
].join(",");

const getFulfillmentStatusIndex = (status: FulfillmentStatus) => {
  const index = FULFILLMENT_STATUS_SEQUENCE.indexOf(status);
  return index >= 0 ? index : 0;
};

const parseNumber = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseOrderItem = (value: unknown): StoredOrderItem | null => {
  if (!value || typeof value !== "object") return null;

  const item = value as Record<string, unknown>;
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const quantity = Math.max(1, Math.floor(parseNumber(item.quantity)) || 1);
  const unitPrice = parseNumber(item.unitPrice);
  const lineTotal = parseNumber(item.lineTotal);

  if (!slug || !name) return null;

  return {
    slug,
    name,
    quantity,
    unitPrice,
    lineTotal,
  };
};

const parseCustomer = (value: unknown): StoredOrderCustomer | undefined => {
  if (!value || typeof value !== "object") return undefined;

  const customer = value as Record<string, unknown>;
  const parsed = {
    name: typeof customer.name === "string" ? customer.name.trim() : undefined,
    email:
      typeof customer.email === "string" ? customer.email.trim() : undefined,
    phone:
      typeof customer.phone === "string" ? customer.phone.trim() : undefined,
  };

  if (!parsed.name && !parsed.email && !parsed.phone) {
    return undefined;
  }

  return parsed;
};

export const normalizeStoredOrder = (value: unknown): StoredOrder | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : "";
  const userId = typeof record.user_id === "string" ? record.user_id : "";
  const status: PaymentStatus =
    record.payment_status === "paid" ? "paid" : "created";
  const fulfillmentStatus: FulfillmentStatus =
    record.fulfillment_status === "payment_confirmed" ||
    record.fulfillment_status === "preparing" ||
    record.fulfillment_status === "ready_for_pickup" ||
    record.fulfillment_status === "completed"
      ? record.fulfillment_status
      : "payment_pending";
  const currency =
    typeof record.currency === "string" ? record.currency : "INR";
  const createdAt =
    typeof record.created_at === "string" ? record.created_at : "";
  const paidAt =
    typeof record.paid_at === "string" ? record.paid_at : undefined;
  const items = Array.isArray(record.items)
    ? record.items
        .map((item) => parseOrderItem(item))
        .filter((item): item is StoredOrderItem => Boolean(item))
    : [];

  if (!id || !userId || !createdAt || items.length === 0) {
    return null;
  }

  return {
    id,
    userId,
    status,
    fulfillmentStatus,
    razorpayOrderId:
      typeof record.razorpay_order_id === "string"
        ? record.razorpay_order_id
        : undefined,
    razorpayPaymentId:
      typeof record.razorpay_payment_id === "string"
        ? record.razorpay_payment_id
        : undefined,
    amount: Math.max(0, Math.round(parseNumber(record.amount))),
    currency,
    items,
    customer: parseCustomer(record.customer),
    createdAt,
    paidAt,
  };
};

export const buildOrderTracking = (
  order: StoredOrder,
): OrderTrackingSnapshot => {
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

  let estimatedStatus: FulfillmentStatus =
    order.status === "paid" ? "payment_confirmed" : "payment_pending";

  if (order.status === "paid" && elapsedMinutes !== null) {
    if (elapsedMinutes < transitionMinutes.preparing) {
      estimatedStatus = "payment_confirmed";
    } else if (elapsedMinutes < transitionMinutes.ready) {
      estimatedStatus = "preparing";
    } else if (elapsedMinutes < transitionMinutes.completed) {
      estimatedStatus = "ready_for_pickup";
    } else {
      estimatedStatus = "completed";
    }
  }

  const fulfillmentStatus =
    getFulfillmentStatusIndex(order.fulfillmentStatus) >
    getFulfillmentStatusIndex(estimatedStatus)
      ? order.fulfillmentStatus
      : estimatedStatus;
  const currentStepIndex = getFulfillmentStatusIndex(fulfillmentStatus);

  let etaMinutes: number | null = null;
  if (fulfillmentStatus === "payment_confirmed" && elapsedMinutes !== null) {
    etaMinutes = Math.max(
      1,
      Math.ceil(transitionMinutes.ready - elapsedMinutes),
    );
  } else if (fulfillmentStatus === "preparing" && elapsedMinutes !== null) {
    etaMinutes = Math.max(
      1,
      Math.ceil(transitionMinutes.ready - elapsedMinutes),
    );
  } else if (fulfillmentStatus === "ready_for_pickup") {
    etaMinutes = 0;
  }

  const formatIsoOffset = (baseIso: string, minutesToAdd: number) =>
    new Date(
      new Date(baseIso).getTime() + minutesToAdd * 60 * 1000,
    ).toISOString();

  const stepsTemplate = [
    {
      id: "placed" as const,
      label: "Order Placed",
      description: "Order has been created.",
      timestamp: order.createdAt,
    },
    {
      id: "paid" as const,
      label: "Payment Confirmed",
      description: "Payment has been verified.",
      timestamp: order.paidAt,
    },
    {
      id: "preparing" as const,
      label: "Preparing",
      description: "Kitchen is preparing your meal.",
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.preparing)
        : undefined,
    },
    {
      id: "ready" as const,
      label: "Ready for Pickup",
      description: "Meal is ready at your selected point.",
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.ready)
        : undefined,
    },
    {
      id: "completed" as const,
      label: "Completed",
      description: "Order has been marked complete.",
      timestamp: order.paidAt
        ? formatIsoOffset(order.paidAt, transitionMinutes.completed)
        : undefined,
    },
  ];

  const steps: OrderTrackingStep[] = stepsTemplate.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? "completed"
        : index === currentStepIndex
          ? "current"
          : "upcoming",
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
