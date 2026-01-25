export const nutritionFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How accurate is the nutrition data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each batch is tested and logged in the Mother Kitchen before distribution to kiosks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I scan the QR code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scan the QR label on your bowl or receipt to open the nutrition lookup page.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do meals contain allergens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Meals are prepared in a kitchen that handles common allergens. Check the allergen section for details.',
      },
    },
  ],
};

export const nutritionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'BoilboX Nutrition Lookup',
  description: 'Scan and verify meal nutrition details, ingredients, and allergens from BoilboX.',
  url: 'https://boilox.com/nutrition',
  about: {
    '@type': 'NutritionInformation',
    calories: 'Varies by meal',
    proteinContent: 'Varies by meal',
    carbohydrateContent: 'Varies by meal',
    fatContent: 'Varies by meal',
  },
};
