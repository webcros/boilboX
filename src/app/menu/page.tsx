// Remove the client directive since we'll fetch data server-side
import { getMeals, getMealsByCategory } from '@/lib/sanity-queries';
import { Meal } from '@/lib/types';

// We'll export generateMetadata for dynamic metadata generation
export async function generateMetadata() {
  // You could fetch specific data here to customize metadata
  return {
    title: "Menu | BoilboX",
    description: "Explore our healthy, oil-free menu. 100% boiled meals for clean eating and optimal nutrition.",
    openGraph: {
      title: "Menu | BoilboX",
      description: "Explore our healthy, oil-free menu. 100% boiled meals for clean eating and optimal nutrition.",
      type: "website",
      url: "https://boilox.com/menu",
    },
    twitter: {
      card: "summary_large_image",
      title: "Menu | BoilboX",
      description: "Explore our healthy, oil-free menu. 100% boiled meals for clean eating and optimal nutrition.",
    },
  };
}

// Make the component async to fetch data server-side
export default async function MenuPage({ 
  searchParams 
}: { 
  searchParams?: { [key: string]: string | string[] | undefined } 
}) {
  const selectedCategory = searchParams?.category?.toString() || 'All';
  
  // Fetch meals server-side
  let meals: Meal[] = [];
  try {
    if (selectedCategory === 'All' || !selectedCategory) {
      meals = await getMeals();
    } else {
      meals = await getMealsByCategory(selectedCategory);
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    // Handle error appropriately
  }
  
  const categories = ['All', 'High Protein', 'Vegan', 'Low Carb', 'Heart Healthy'];

  return (
    <div className="px-4 md:px-10 lg:px-40 py-12 animate-fade-in">
      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Our Menu</h1>
          <p className="text-gray-500 text-lg">Clean eating made simple. Precision boiled, zero oil added.</p>
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`?category=${cat}`}
              className={`flex h-11 shrink-0 items-center justify-center px-6 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                ? 'bg-bg-dark dark:bg-primary text-white dark:text-bg-dark' 
                : 'bg-white border border-gray-200 dark:bg-surface-dark dark:border-white/10 hover:border-primary'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Empty/Error State */}
      {meals.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No meals found</p>
          <p className="text-gray-400 text-sm">
            {selectedCategory === 'All'
              ? 'No meals are available yet. Please add meals in Sanity and publish them.'
              : `No meals available in the ${selectedCategory} category.`}
          </p>
        </div>
      )}

      {/* Grid */}
      {meals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.map((meal) => (
            <article
              key={meal.id}
              className="flex flex-col bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
                  <h3 className="text-lg md:text-xl font-extrabold leading-snug group-hover:text-primary transition-colors">
                    {meal.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
                    ${meal.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {meal.description}
                </p>

                {/* Macros Breakdown */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-dashed border-gray-100 dark:border-white/10 mb-6">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">
                      Calories
                    </p>
                    <p className="text-base md:text-lg font-extrabold">{meal.calories}</p>
                  </div>
                  <div className="text-center border-x border-gray-100 dark:border-white/10 px-2">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">
                      Protein
                    </p>
                    <p className="text-base md:text-lg font-extrabold">{meal.protein}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-1">
                      Carbs
                    </p>
                    <p className="text-base md:text-lg font-extrabold">{meal.carbs}</p>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 h-12 md:h-13 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold text-sm md:text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-md shadow-primary/20">
                    Add to Order
                    <span className="material-symbols-outlined text-base md:text-lg">add_circle</span>
                  </button>
                  <button className="w-12 h-12 md:w-13 md:h-13 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-base md:text-lg">qr_code_scanner</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      
      {/* Notice */}
      <div className="mt-20 p-10 rounded-3xl bg-bg-dark text-white text-center max-w-4xl mx-auto border-2 border-primary/30">
        <h4 className="text-2xl font-black mb-4">Pure Nutrition. Zero Secrets.</h4>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Every meal is prepared in our central Mother Kitchen following strict hygiene standards. We track every nutrient so you don't have to worry about what's in your bowl.
        </p>
      </div>
    </div>
  );
}