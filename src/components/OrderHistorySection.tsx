"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  buildOrderTracking,
  normalizeStoredOrder,
  ORDER_SELECT_FIELDS,
  type StoredOrder,
} from "@/lib/orders";
import { supabase } from "@/lib/supabase";
import { getReadableSupabaseErrorMessage } from "@/lib/supabase-errors";

type OrderHistoryVariant = "embedded" | "page";
type OrderFilter = "all" | "active" | "completed";

interface OrderHistorySectionProps {
  variant?: OrderHistoryVariant;
  limit?: number;
}

const formatDateTime = (value?: string) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value?: string) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (currency: string, amountInPaise: number) => {
  const amount = amountInPaise / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const formatPrice = (value: number) => `INR ${value.toFixed(2)}`;

const formatStatus = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const filterOptions: Array<{ id: OrderFilter; label: string }> = [
  { id: "all", label: "All Orders" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export default function OrderHistorySection({
  variant = "embedded",
  limit,
}: OrderHistorySectionProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilter>("all");

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setOrders([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(ORDER_SELECT_FIELDS)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (ordersError) {
        setOrders([]);
        setError(
          getReadableSupabaseErrorMessage(
            ordersError,
            "Failed to load order history.",
          ),
        );
        setIsLoading(false);
        return;
      }

      const parsedOrders = (data ?? [])
        .map((record) => normalizeStoredOrder(record))
        .filter((record): record is StoredOrder => Boolean(record));

      setOrders(parsedOrders);
      setIsLoading(false);
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, user]);

  if (isAuthLoading) {
    return variant === "page" ? (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-300">
          Loading your order history...
        </div>
      </div>
    ) : (
      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Loading order history...
        </p>
      </div>
    );
  }

  if (!user) {
    if (variant !== "page") {
      return (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Sign in to view your order history.
          </p>
        </div>
      );
    }

    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Sign in to view order history
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Your past purchases and live kitchen updates are saved to the
            account used at checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/signin?next=${encodeURIComponent("/orders")}`}
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/track-order"
              className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Track an Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderEntries = orders.map((order) => ({
    order,
    tracking: buildOrderTracking(order),
  }));

  let activeOrdersCount = 0;
  let completedOrdersCount = 0;
  let totalSpent = 0;

  for (const entry of orderEntries) {
    if (entry.tracking.fulfillmentStatus === "completed") {
      completedOrdersCount += 1;
    } else {
      activeOrdersCount += 1;
    }

    if (entry.order.status === "paid") {
      totalSpent += entry.order.amount;
    }
  }

  const filteredEntries = orderEntries.filter((entry) => {
    if (filter === "active") {
      return entry.tracking.fulfillmentStatus !== "completed";
    }

    if (filter === "completed") {
      return entry.tracking.fulfillmentStatus === "completed";
    }

    return true;
  });

  const visibleEntries =
    typeof limit === "number"
      ? filteredEntries.slice(0, limit)
      : filteredEntries;
  const hasMoreOrders =
    typeof limit === "number" && orderEntries.length > limit;
  const shouldShowAllLink =
    (variant === "embedded" && orderEntries.length > 0) || hasMoreOrders;
  const summaryCurrency = orderEntries[0]?.order.currency || "INR";
  const latestOrderDate = orderEntries[0]?.order.createdAt;

  const headerContent =
    variant === "page" ? (
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Your Account
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            Order History
          </h1>
          <p className="text-gray-500 dark:text-gray-300 max-w-3xl">
            Review past purchases, keep tabs on active orders, and jump straight
            into tracking whenever you need a status update.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
            Signed In As
          </p>
          <p className="font-black">{user.name || user.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {user.email}
          </p>
        </div>
      </header>
    ) : null;

  const emptyStateTitle =
    orderEntries.length === 0
      ? "No orders yet"
      : filter === "active"
        ? "No active orders right now"
        : "No completed orders yet";
  const emptyStateMessage =
    orderEntries.length === 0
      ? "Your order history will start filling up as soon as you complete checkout."
      : filter === "active"
        ? "Everything in your account is already completed."
        : "Completed purchases will appear here once your meals are finished.";

  const content = (
    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
        <div>
          <h2 className="text-2xl font-black">
            {variant === "page" ? "Saved Orders" : "Order History"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
            {typeof limit === "number" && orderEntries.length > 0
              ? `Showing your latest ${Math.min(limit, orderEntries.length)} of ${orderEntries.length} orders.`
              : "Every order placed with this account is stored here."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {shouldShowAllLink && (
            <Link
              href="/orders"
              className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              View All
            </Link>
          )}
          <Link
            href="/track-order"
            className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Track an Order
          </Link>
        </div>
      </div>

      {variant === "page" && orderEntries.length > 0 && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                className={`h-11 px-4 rounded-xl text-sm font-bold transition-colors ${
                  filter === option.id
                    ? "bg-primary text-bg-dark"
                    : "border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link href="/profile" className="text-sm font-bold text-primary">
            Manage Profile
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200 border border-red-200 dark:border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Loading orders...
        </p>
      ) : visibleEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-black mb-2">{emptyStateTitle}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {emptyStateMessage}
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/menu"
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
            >
              Browse Menu
            </Link>
            {orderEntries.length > 0 && filter !== "all" ? (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5"
              >
                View All Orders
              </button>
            ) : (
              <Link
                href="/track-order"
                className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Track an Order
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleEntries.map(({ order, tracking }) => {
            const totalItems = order.items.reduce(
              (count, item) => count + item.quantity,
              0,
            );
            const browseHref =
              order.items.length === 1
                ? `/menu/${order.items[0].slug}`
                : "/menu";
            const browseLabel =
              order.items.length === 1 ? "View Meal" : "Browse Menu";
            const latestStep =
              [...tracking.steps]
                .reverse()
                .find((step) => step.status !== "upcoming") ||
              tracking.steps[0];

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-100 dark:border-white/10 p-5 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
                      Order ID
                    </p>
                    <p className="font-black break-all">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                      Placed on {formatDateTime(order.createdAt)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                      {order.status === "paid" && order.paidAt
                        ? ` - Paid ${formatDateTime(order.paidAt)}`
                        : " - Awaiting payment confirmation"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-200">
                      Payment: {order.status === "paid" ? "Paid" : "Pending"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                      {formatStatus(tracking.fulfillmentStatus)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.slug}`}
                      className="flex justify-between gap-4"
                    >
                      <span className="text-gray-500 dark:text-gray-300">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-bold">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Total
                    </p>
                    <p className="text-lg font-black text-primary">
                      {formatAmount(order.currency, order.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Latest update: {formatDate(latestStep?.timestamp)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={browseHref}
                      className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      {browseLabel}
                    </Link>
                    <Link
                      href={`/track-order?orderId=${encodeURIComponent(order.id)}`}
                      className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (variant !== "page") {
    return content;
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        {headerContent}

        {orderEntries.length > 0 && !isLoading && (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                Total Orders
              </p>
              <p className="text-3xl font-black">{orderEntries.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                Every purchase saved to this account.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                Active Orders
              </p>
              <p className="text-3xl font-black">{activeOrdersCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                Orders still moving through the kitchen.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                Completed
              </p>
              <p className="text-3xl font-black">{completedOrdersCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                Orders that already reached pickup complete.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                Lifetime Spend
              </p>
              <p className="text-3xl font-black">
                {formatAmount(summaryCurrency, totalSpent)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                Latest order on {formatDate(latestOrderDate)}.
              </p>
            </div>
          </section>
        )}

        {content}
      </div>
    </div>
  );
}
