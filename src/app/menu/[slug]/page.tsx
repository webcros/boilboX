import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMealBySlug } from '@/lib/sanity-queries';

interface MenuDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: MenuDetailPageProps) {
  const meal = await getMealBySlug(params.slug);
  if (!meal) {
    return {
      title: 'Meal Not Found | BoilboX',
    };
  }

  return {
    title: `${meal.name} | BoilboX`,
    description: meal.description,
    openGraph: {
      title: `${meal.name} | BoilboX`,
      description: meal.description,
      images: meal.image ? [meal.image] : [],
    },
  };
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const meal = await getMealBySlug(params.slug);

  if (!meal) {
    notFound();
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        <div className="space-y-6">
          <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl">
            <img
              src={meal.image}
              alt={meal.imageAlt || meal.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-black mb-4">Nutrition Breakdown</h2>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">Calories</p>
                <p className="text-2xl font-black text-primary">{meal.calories}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">Protein</p>
                <p className="text-2xl font-black text-primary">{meal.protein}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">Carbs</p>
                <p className="text-2xl font-black text-primary">{meal.carbs}</p>
              </div>
            </div>
            {meal.fats && (
              <div className="mt-6 text-center">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">Fats</p>
                <p className="text-xl font-black text-primary">{meal.fats}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            {meal.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black">{meal.name}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300 leading-relaxed">{meal.description}</p>
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meal.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-[0.18em]">Price</p>
              <p className="text-3xl font-black text-primary">${meal.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href={`/order?item=${meal.slug}`}
                className="h-14 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Add to Order
                <span className="material-symbols-outlined text-lg">add_circle</span>
              </Link>
              <Link
                href="/menu"
                className="h-12 rounded-2xl border border-gray-200 dark:border-white/10 text-sm font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
