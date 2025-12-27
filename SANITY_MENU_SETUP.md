# Sanity CMS Menu Setup Guide

This guide will help you set up the Sanity CMS schema for the menu/meal items.

## Prerequisites

1. A Sanity account and project
2. Sanity Studio installed and configured

## Setup Steps

### 1. Install Sanity Studio (if not already installed)

If you don't have Sanity Studio set up, you can install it:

```bash
npm install -g @sanity/cli
sanity init
```

### 2. Add the Meal Schema

1. Copy the schema file `sanity-schemas/meal.js` to your Sanity Studio's `schemas` folder
2. Import it in your `schemas/index.js` (or `schemas/index.ts`):

```javascript
import meal from './meal';

export const schemaTypes = [
  meal,
  // ... other schemas
];
```

### 3. Configure Sanity Client

Make sure your `.env.local` file has the correct Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Add Sample Data

In your Sanity Studio, create meal documents with the following structure:

- **Name**: The meal name (e.g., "Poached Chicken & Greens")
- **Description**: A brief description of the meal
- **Price**: The price as a number (e.g., 12.50)
- **Calories**: Number of calories (e.g., 340)
- **Protein**: Protein content as string (e.g., "32g")
- **Carbs**: Carbohydrate content as string (e.g., "12g")
- **Fats**: (Optional) Fat content as string (e.g., "5g")
- **Image**: Upload an image for the meal
- **Category**: Select from: High Protein, Vegan, Low Carb, Heart Healthy, Balanced
- **Tags**: (Optional) Array of tags like "Fiber Rich", "Gluten Free", etc.
- **Featured**: Checkbox to feature on homepage
- **Available**: Checkbox to mark if meal is currently available
- **Display Order**: Number to control display order (lower = first)

### 5. Image Configuration

Make sure your Sanity project has image assets enabled. The schema uses Sanity's image type which will:
- Store images in Sanity's CDN
- Provide optimized image URLs
- Include alt text for accessibility

### 6. Query Functions

The following functions are available in `src/lib/sanity-queries.ts`:

- `getMeals()` - Fetch all available meals
- `getFeaturedMeals(limit)` - Fetch featured meals for homepage
- `getMealsByCategory(category)` - Fetch meals by category

### 7. Testing

1. Start your Next.js dev server: `npm run dev`
2. Navigate to `/menu` to see meals from Sanity
3. Navigate to `/` to see featured meals on homepage

## Schema Fields Explained

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Meal name |
| description | text | Yes | Meal description |
| price | number | Yes | Price in dollars |
| calories | number | Yes | Calorie count |
| protein | string | Yes | Protein content (e.g., "32g") |
| carbs | string | Yes | Carbohydrate content (e.g., "12g") |
| fats | string | No | Fat content (e.g., "5g") |
| image | image | Yes | Meal image |
| category | string | Yes | Meal category |
| tags | array | No | Additional tags |
| featured | boolean | No | Show on homepage |
| available | boolean | No | Currently available |
| order | number | No | Display order |

## Troubleshooting

### Images not showing
- Make sure images are uploaded to Sanity and published
- Check that `image.asset->url` is accessible
- Verify Sanity project permissions

### Meals not loading
- Check browser console for errors
- Verify Sanity Project ID and Dataset in `.env.local`
- Ensure meals are published in Sanity Studio
- Check that `available` is set to `true`

### Category filtering not working
- Verify category values match exactly (case-sensitive)
- Check that meals have the correct category assigned

## Next Steps

- Add more meal fields as needed (allergens, ingredients, etc.)
- Set up webhooks to rebuild on content changes
- Add image optimization settings
- Configure preview URLs for Sanity Studio



