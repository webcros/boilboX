'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useCart } from '@/context/CartContext';

const formatPrice = (value: number) => `INR ${value.toFixed(2)}`;

export default function CartClient() {
  const router = useRouter();
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const serializedItems = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        }))
      ),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">Your cart is empty</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Add meals from the menu to start building your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
            >
              Browse Menu
            </Link>
            <Link
              href="/track-order"
              className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Track Existing Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-black">Your Cart</h1>
            <span className="text-xs uppercase tracking-[0.18em] text-gray-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.slug}
                className="rounded-2xl border border-gray-100 dark:border-white/10 p-4 md:p-5"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-white/5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
                      {item.category}
                    </p>
                    <h2 className="text-lg font-black truncate">{item.name}</h2>
                    <p className="text-sm text-primary font-bold">{formatPrice(item.price)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="self-start text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 dark:border-white/10 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      -
                    </button>
                    <span className="text-lg font-black w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black"
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-black text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-300">Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-300">
              <span>Estimated tax</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-300">
              <span>Pickup</span>
              <span>Free</span>
            </div>
            <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex justify-between text-lg font-black">
              <span>Total</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-8 w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            onClick={() => {
              const params = new URLSearchParams({
                items: serializedItems,
              });
              router.push(`/checkout/payment?${params.toString()}`);
            }}
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <button
            type="button"
            className="mt-3 w-full h-12 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            onClick={clearCart}
          >
            Clear Cart
          </button>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/menu"
              className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Add More Items
            </Link>
            <Link
              href="/track-order"
              className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
