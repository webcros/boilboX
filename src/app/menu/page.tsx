// Remove the client directive since we'll fetch data server-side
import { getMeals, getMealsByCategory } from '@/lib/sanity-queries';
import type { Meal } from '@/lib/types';
import FiltersClient from './FiltersClient';
import MenuCard from './MenuCard';

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
  let errorMessage: string | null = null;
  if (selectedCategory === 'All' || !selectedCategory) {
    try {
      meals = await getMeals();
    } catch (error) {
      errorMessage = 'We could not load the menu right now. Please try again shortly.';
    }
  } else {
    try {
      meals = await getMealsByCategory(selectedCategory);
    } catch (error) {
      errorMessage = 'We could not load this category right now. Please try again shortly.';
    }
  }

  const categories = ['All', 'High Protein', 'Vegan', 'Low Carb', 'Heart Healthy', 'Balanced'];

  return (
    <div className="px-4 md:px-10 lg:px-40 py-12 animate-fade-in">
      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Our Menu</h1>
          <p className="text-gray-500 dark:text-gray-300 text-lg">Clean eating made simple. Precision boiled, zero oil added.</p>
        </div>
        
        {/* Category Filters */}
        <FiltersClient categories={categories} selectedCategory={selectedCategory} />
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">Menu unavailable</p>
          <p className="text-gray-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Empty State */}
      {!errorMessage && meals.length === 0 && (
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
      {!errorMessage && meals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.map((meal) => (
            <MenuCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
      
      {/* Notice */}
      <div className="mt-20 p-10 rounded-3xl bg-surface-dark text-white text-center max-w-4xl mx-auto border-2 border-primary/30">
        <h4 className="text-2xl font-black mb-4">Pure Nutrition. Zero Secrets.</h4>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          Every meal is prepared in our central Mother Kitchen following strict hygiene standards. We track every nutrient so you don't have to worry about what's in your bowl.
        </p>
      </div>
    </div>
  );
}