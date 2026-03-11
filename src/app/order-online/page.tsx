import Link from 'next/link';
import { getMeals } from '@/lib/sanity-queries';
import AddToCartButton from '@/components/AddToCartButton';

export const metadata = {
  title: 'Order Online | BoilboX',
  description: 'Browse meals and start your BoilboX order online.',
};

export default async function OrderOnlinePage() {
  const meals = await getMeals().catch(() => []);

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Order Online</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Choose a meal, review nutrition, and start your order for pickup.
          </p>
        </header>

        {meals.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 text-lg mb-2">No meals available</p>
            <p className="text-gray-400 text-sm">Publish meals in Sanity to enable online ordering.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {meals.slice(0, 6).map((meal) => (
              <div key={meal.id} className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={meal.image} alt={meal.imageAlt || meal.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black">{meal.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{meal.description}</p>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-primary">${meal.price.toFixed(2)}</span>
                    <Link href={`/menu/${meal.slug}`} className="text-primary">Nutrition</Link>
                  </div>
                  <AddToCartButton
                    meal={{
                      slug: meal.slug,
                      name: meal.name,
                      image: meal.image,
                      imageAlt: meal.imageAlt,
                      price: meal.price,
                      category: meal.category,
                    }}
                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-sm text-gray-600 dark:text-gray-300">
          <h2 className="text-2xl font-black mb-3">Delivery partner ready</h2>
          <p>
            Our ordering flow is structured for third-party delivery integration. Menu items, nutrition, and pickup windows are already standardized.
          </p>
        </section>

        <div className="text-center">
          <Link href="/menu" className="text-primary font-bold text-sm inline-flex items-center gap-2">
            View full menu <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
