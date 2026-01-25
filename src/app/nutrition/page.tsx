import { generatePageMetadata } from '@/lib/seo';
import { getMeals } from '@/lib/sanity-queries';
import NutritionClient from './NutritionClient';
import { nutritionFaqSchema, nutritionPageSchema } from './faq-schema';

export const metadata = generatePageMetadata({
  title: "Nutrition Lookup | BoilboX",
  description: "Scan and verify meal nutrition details, ingredients, and allergens from BoilboX.",
  url: "https://boilox.com/nutrition",
  type: "website",
});

export default async function NutritionPage() {
  const meals = await getMeals().catch(() => []);

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">Nutrition Lookup</p>
          <h1 className="text-5xl md:text-7xl font-black mb-4">Scan. Verify. Trust.</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Use this page after scanning the QR code on your bowl to view a full nutrition breakdown, ingredients, and allergen guidance.
          </p>
        </header>

        <NutritionClient meals={meals} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionFaqSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionPageSchema) }}
        />
      </div>
    </div>
  );
}



