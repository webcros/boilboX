'use client';

import { useEffect, useState } from 'react';
import type { OrderTracking } from '@/lib/types';

interface TrackOrderClientProps {
  initialOrderId?: string;
}

const fulfillmentLabels: Record<OrderTracking['fulfillmentStatus'], string> = {
  payment_pending: 'Payment Pending',
  payment_confirmed: 'Payment Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
};

const formatCurrency = (currency: string, amountInPaise: number) => {
  const amount = amountInPaise / 100;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const formatDateTime = (value?: string) => {
  if (!value) return 'Pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending';
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default function TrackOrderClient({
  initialOrderId = '',
}: TrackOrderClientProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const loadTracking = async (requestedOrderId: string) => {
    const trimmed = requestedOrderId.trim();
    if (!trimmed) {
      setError('Please enter an order ID.');
      setTracking(null);
      return;
    }

    setError(null);
    setIsLoading(true);
    setHasFetched(true);

    try {
      const response = await fetch(`/api/order/${encodeURIComponent(trimmed)}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to fetch order status.');
      }

      setTracking(data as OrderTracking);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to fetch order status.';
      setError(message);
      setTracking(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialOrderId) return;
    loadTracking(initialOrderId);
  }, [initialOrderId]);

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-3">Track Order</h1>
          <p className="text-gray-500 dark:text-gray-300">
            Enter your order ID to view payment confirmation and kitchen status.
          </p>
        </header>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
          <form
            className="flex flex-col md:flex-row gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              loadTracking(orderId);
            }}
          >
            <input
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter order ID (example: 123e4567...)"
              className="flex-1 h-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Track'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-300">{error}</p>
          )}
        </section>

        {!tracking && hasFetched && !error && (
          <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-center text-gray-500 dark:text-gray-300">
            No tracking data found for this order ID.
          </section>
        )}

        {tracking && (
          <>
            <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                    Order ID
                  </p>
                  <p className="text-lg font-black break-all">{tracking.orderId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    Placed on {formatDateTime(tracking.createdAt)}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                    Current Status
                  </p>
                  <p className="text-xl font-black text-primary">
                    {fulfillmentLabels[tracking.fulfillmentStatus]}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    Payment: {tracking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </p>
                  {tracking.etaMinutes !== null && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      ETA: {tracking.etaMinutes} min
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6">
              <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-black mb-5">Timeline</h2>
                <div className="space-y-4">
                  {tracking.steps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-2xl border border-gray-100 dark:border-white/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black">{step.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            {step.description}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full font-bold ${
                            step.status === 'completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                              : step.status === 'current'
                                ? 'bg-primary/15 text-primary'
                                : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-gray-400">
                        {formatDateTime(step.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-black mb-5">Order Items</h2>
                <div className="space-y-3">
                  {tracking.items.map((item) => (
                    <div key={`${item.slug}-${item.quantity}`} className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500 dark:text-gray-300">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(tracking.currency, Math.round(item.lineTotal * 100))}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex justify-between text-lg font-black">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(tracking.currency, tracking.amount)}
                    </span>
                  </div>
                </div>

                {tracking.customer && (
                  <div className="mt-6 text-sm text-gray-500 dark:text-gray-300 space-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                      Customer
                    </p>
                    {tracking.customer.name && <p>Name: {tracking.customer.name}</p>}
                    {tracking.customer.email && <p>Email: {tracking.customer.email}</p>}
                    {tracking.customer.phone && <p>Phone: {tracking.customer.phone}</p>}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

