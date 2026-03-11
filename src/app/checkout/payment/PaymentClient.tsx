'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CheckoutItem {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface PaymentClientProps {
  items: CheckoutItem[];
  total: number;
  currency: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };
  razorpayKeyId: string;
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.getElementById(
      'razorpay-checkout-js'
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const formatCurrency = (currency: string, value: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

export default function PaymentClient({
  items,
  total,
  currency,
  customer,
  razorpayKeyId,
}: PaymentClientProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPayingRef = useRef(false);

  const summaryRows = useMemo(() => {
    return [
      ...items.map((item) => ({
        label: `${item.name} x ${item.quantity}`,
        value: formatCurrency(currency, item.lineTotal),
      })),
      { label: 'Estimated tax', value: formatCurrency(currency, 0) },
      { label: 'Pickup', value: 'Free' },
    ];
  }, [currency, items]);

  const [custName, setCustName] = useState(customer.name || '');
  const [custEmail, setCustEmail] = useState(customer.email || '');
  const [custPhone, setCustPhone] = useState(customer.phone || '');

  const handlePayNow = async () => {
    if (items.length === 0 || isPayingRef.current) return;
    if (!razorpayKeyId) {
      setError('Payment configuration is missing. Please try again later.');
      return;
    }

    setError(null);
    setIsLoading(true);
    isPayingRef.current = true;

    try {
      const createOrderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
          customer: {
            name: custName || undefined,
            email: custEmail || undefined,
            phone: custPhone || undefined,
          },
        }),
      });

      const createOrderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(createOrderData?.error || 'Failed to create payment order.');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Failed to load Razorpay checkout.');
      }

      const options = {
        key: razorpayKeyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        name: 'BoilboX',
        description:
          createOrderData.itemName ||
          (items.length === 1 ? items[0].name : `${items.length} items`),
        order_id: createOrderData.razorpayOrderId,
        prefill: {
          name: custName || undefined,
          email: custEmail || undefined,
          contact: custPhone || undefined,
        },
        notes: {
          orderId: createOrderData.orderId,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                orderId: createOrderData.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData?.error || 'Payment verification failed.');
            }

            clearCart();
            router.push(
              `/order/success?orderId=${encodeURIComponent(createOrderData.orderId)}`
            );
          } catch (verifyError) {
            const message =
              verifyError instanceof Error
                ? verifyError.message
                : 'Payment verification failed.';
            setError(message);
            setIsLoading(false);
            isPayingRef.current = false;
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            isPayingRef.current = false;
          },
        },
        theme: {
          color: '#F4D03F',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on(
        'payment.failed',
        (response: { error?: { description?: string } }) => {
          const message =
            response?.error?.description || 'Payment failed. Please try again.';
          setError(message);
          setIsLoading(false);
          isPayingRef.current = false;
        }
      );
      razorpay.open();
    } catch (payError) {
      const message =
        payError instanceof Error ? payError.message : 'Payment failed. Please try again.';
      setError(message);
      setIsLoading(false);
      isPayingRef.current = false;
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">Your order is empty</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Add meals to your cart before continuing to payment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/menu"
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold inline-flex items-center justify-center"
            >
              Browse Menu
            </Link>
            <Link
              href="/cart"
              className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold inline-flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h1 className="text-2xl md:text-3xl font-black mb-6">Order Summary</h1>
          <div className="space-y-4 text-sm">
            {summaryRows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-300">{row.label}</span>
                <span className="font-bold text-right">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex justify-between text-lg font-black">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(currency, total)}</span>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-black mb-4">Customer info</h2>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pay-name"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
                >
                  Name
                </label>
                <input
                  id="pay-name"
                  type="text"
                  placeholder="Full name"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pay-email"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
                >
                  Email
                </label>
                <input
                  id="pay-email"
                  type="email"
                  placeholder="you@email.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pay-phone"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
                >
                  Phone
                </label>
                <input
                  id="pay-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-4">Payment</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            Complete your purchase securely via Razorpay. Your payment is processed on
            a secure gateway.
          </p>
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}
          <button
            type="button"
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handlePayNow}
            disabled={isLoading}
          >
            {isLoading ? 'Processing Payment...' : 'Pay Now'}
            <span className="material-symbols-outlined text-lg">lock</span>
          </button>
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-300">
            By continuing you agree to the payment terms and confirmation will be sent
            after success.
          </div>
        </div>
      </div>
    </div>
  );
}

