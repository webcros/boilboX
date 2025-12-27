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

      {/* Error State - simplified since this is server rendered */}
      {meals.length === 0 && selectedCategory !== 'All' && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No meals found</p>
          <p className="text-gray-400 text-sm">
            {`No meals available in the ${selectedCategory} category.`}
          </p>
        </div>
      )}

      {/* Grid */}
      {meals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.map((meal) => (
          <article key={meal.id} className="bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500 group">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-5 left-5 z-10 flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary">
                  {meal.category}
                </span>
                {meal.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-orange-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{meal.name}</h3>
                <span className="text-primary font-black text-2xl">${meal.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">{meal.description}</p>
              
              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-dashed border-gray-100 dark:border-white/10 mb-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Calories</p>
                  <p className="text-xl font-black">{meal.calories}</p>
                </div>
                <div className="text-center border-x border-gray-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protein</p>
                  <p className="text-xl font-black">{meal.protein}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Carbs</p>
                  <p className="text-xl font-black">{meal.carbs}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                  Add to Order
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <button className="w-14 h-14 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined">qr_code_scanner</span>
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