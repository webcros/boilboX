import Link from 'next/link';
import { getMeals } from '@/lib/sanity-queries';

export const metadata = {
  title: 'Subscription Plans | BoilboX',
  description: 'Flexible meal subscriptions for daily, weekly, or monthly plans.',
};

const plans = [
  { name: 'Daily', price: 12, cadence: 'per meal', meals: 1 },
  { name: 'Weekly', price: 68, cadence: 'per week', meals: 6 },
  { name: 'Monthly', price: 260, cadence: 'per month', meals: 24 },
];

export default async function SubscriptionPage() {
  const meals = await getMeals().catch(() => []);

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Subscription Plans</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Lock in clean meals with flexible plans. Pause or change anytime.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">{plan.name}</p>
              <p className="text-4xl font-black text-primary mb-2">${plan.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{plan.cadence} • {plan.meals} meals</p>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-6">
                ${(plan.price / plan.meals).toFixed(2)} per meal
              </p>
              <Link href="/menu" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold">
                Subscribe
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-4">Meal rotation preview</h2>
          {meals.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-300">Menus update weekly. Check back for the latest rotation.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {meals.slice(0, 4).map((meal) => (
                <div key={meal.id} className="rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                  <img src={meal.image} alt={meal.imageAlt || meal.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-bold">{meal.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{meal.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-black mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/80">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">Step 1</p>
              <p>Select a plan that fits your schedule.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">Step 2</p>
              <p>Choose meals each week and review nutrition details.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">Step 3</p>
              <p>Pick up from your nearest kiosk or partner location.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/menu" className="h-11 px-5 rounded-xl border border-white/20 font-bold flex items-center justify-center">
              View Menu
            </Link>
            <Link href="/order-online" className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold flex items-center justify-center">
              Start Subscription
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
