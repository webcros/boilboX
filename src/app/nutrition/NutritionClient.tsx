'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Meal } from '@/lib/types';

interface NutritionClientProps {
  meals: Meal[];
}

export default function NutritionClient({ meals }: NutritionClientProps) {
  const [selectedSlug, setSelectedSlug] = useState(meals[0]?.slug ?? '');

  const selectedMeal = useMemo(() => {
    if (!selectedSlug) return meals[0];
    return meals.find((meal) => meal.slug === selectedSlug) ?? meals[0];
  }, [meals, selectedSlug]);

  if (!selectedMeal) {
    return (
      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-black mb-2">No meals available</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Nutrition details will appear once meals are published.
        </p>
      </div>
    );
  }

  const ingredientsLabel = selectedMeal.tags?.length
    ? selectedMeal.tags.join(' • ')
    : 'Seasonal ingredients vary by recipe. See the full label in-store.';

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-300 mb-2">
              Select a meal
            </p>
            <h2 className="text-2xl md:text-3xl font-black">{selectedMeal.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              {selectedMeal.description}
            </p>
          </div>
          <select
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="h-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark px-4 text-sm font-bold"
          >
            {meals.map((meal) => (
              <option key={meal.id} value={meal.slug}>
                {meal.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black">Nutrition Summary</h3>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Verified</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">Calories</p>
            <p className="text-2xl font-black text-primary">{selectedMeal.calories}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">Protein</p>
            <p className="text-2xl font-black text-primary">{selectedMeal.protein}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">Carbs</p>
            <p className="text-2xl font-black text-primary">{selectedMeal.carbs}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">Fats</p>
            <p className="text-2xl font-black text-primary">{selectedMeal.fats ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6">
          <h4 className="text-lg font-black mb-3">Ingredients</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">{ingredientsLabel}</p>
          <div className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-400">Portion size</div>
          <p className="text-sm font-bold mt-1">Single serving bowl</p>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6">
          <h4 className="text-lg font-black mb-3">Allergens & Benefits</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Prepared in a kitchen that handles nuts, dairy, soy, and gluten.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              'Boiled with zero added oils.',
              'Nutrient retention through controlled cooking.',
              'Balanced macros for everyday energy.',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-lg font-black mb-1">Verified by BoilboX Kitchen</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Nutrition values are tested per batch and logged during production.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/menu"
            className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Browse Menu
          </Link>
          <Link
            href="/locations"
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
          >
            Find a Kiosk
          </Link>
        </div>
      </div>
    </div>
  );
}
