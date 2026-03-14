"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Meal } from "@/lib/types";

interface OrderClientProps {
  meal: Meal | null;
}

const formatPrice = (value: number) => `INR ${value.toFixed(2)}`;

export default function OrderClient({ meal }: OrderClientProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const total = useMemo(() => {
    if (!meal) return 0;
    return meal.price * quantity;
  }, [meal, quantity]);

  if (!meal) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Your order is empty
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Choose a meal from the menu to start your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
            >
              Browse Menu
            </Link>
            <Link
              href="/"
              className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const checkoutPath = `/checkout/payment?item=${encodeURIComponent(meal.slug)}&qty=${quantity}`;
  const signInPath = `/signin?next=${encodeURIComponent(`/order?item=${meal.slug}`)}`;

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
              <img
                src={meal.image}
                alt={meal.imageAlt || meal.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
                {meal.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-black mb-2">
                {meal.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {meal.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 dark:border-white/10 px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black"
                >
                  -
                </button>
                <span className="text-lg font-black w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
                Item price
              </p>
              <p className="text-2xl font-black text-primary">
                {formatPrice(meal.price)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-300">
                {meal.name} x {quantity}
              </span>
              <span className="font-bold">
                {formatPrice(meal.price * quantity)}
              </span>
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
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-black">Account</h3>
            {isLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Checking your account...
              </p>
            ) : user ? (
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 text-sm space-y-2">
                <p className="font-black">{user.name}</p>
                <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
                <p className="text-gray-500 dark:text-gray-300">
                  Payment and order history will be saved to this account.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
                Sign in is required before you can place this order.
              </div>
            )}
          </div>

          {user ? (
            <button
              type="button"
              className="mt-6 w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              onClick={() => {
                router.push(checkoutPath);
              }}
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          ) : (
            <Link
              href={signInPath}
              className="mt-6 w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Sign In to Order
              <span className="material-symbols-outlined text-lg">login</span>
            </Link>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/menu"
              className="flex-1 h-12 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Back to Menu
            </Link>
            <Link
              href={`/menu/${meal.slug}`}
              className="flex-1 h-12 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              View Meal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
