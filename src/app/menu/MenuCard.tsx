'use client';

import { useRouter } from 'next/navigation';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useCart } from '@/context/CartContext';
import type { Meal } from '@/lib/types';

interface MenuCardProps {
  meal: Meal;
}

export default function MenuCard({ meal }: MenuCardProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleNavigate = () => {
    router.push(`/menu/${meal.slug}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addItem(meal, 1);
  };

  const handleQuickView = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(`/menu/${meal.slug}`);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View details for ${meal.name}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="relative flex flex-col bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-500 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.99]"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.imageAlt || meal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 text-xs font-semibold uppercase tracking-[0.18em]">
            Image coming soon
          </div>
        )}
        <div className="absolute inset-x-5 top-5 z-10 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            {meal.category}
          </span>
          {meal.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7 lg:p-8">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg md:text-xl font-extrabold leading-snug text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {meal.name}
          </h3>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
            ${meal.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">
          {meal.description}
        </p>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-dashed border-gray-100 dark:border-white/10 mb-6">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-[0.18em] mb-1">
              Calories
            </p>
            <p className="text-base md:text-lg font-extrabold text-white">{meal.calories}</p>
          </div>
          <div className="text-center border-x border-gray-100 dark:border-white/10 px-2">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-[0.18em] mb-1">
              Protein
            </p>
            <p className="text-base md:text-lg font-extrabold text-white">{meal.protein}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-[0.18em] mb-1">
              Carbs
            </p>
            <p className="text-base md:text-lg font-extrabold text-white">{meal.carbs}</p>
          </div>
        </div>

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-12 md:h-13 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Add to Cart
            <span className="material-symbols-outlined text-base md:text-lg">add_circle</span>
          </button>
          <button
            type="button"
            onClick={handleQuickView}
            className="w-12 h-12 md:w-13 md:h-13 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={`View ${meal.name} details`}
          >
            <span className="material-symbols-outlined text-base md:text-lg text-white">qr_code_scanner</span>
          </button>
        </div>
      </div>
    </article>
  );
}
