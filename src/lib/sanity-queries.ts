import { sanityClient } from './sanity';
import { Meal } from './types';

// GROQ query to fetch all meals
// Includes meals where `available` is either true or not set (for older documents)
// and only meals with a defined image asset so menu cards always have an image
export const mealsQuery = `*[_type == "meal" && (!defined(available) || available == true) && defined(image.asset)] | order(order asc, name asc) {
  _id,
  name,
  description,
  price,
  calories,
  protein,
  carbs,
  fats,
  "image": image.asset->url,
  "imageAlt": image.alt,
  category,
  tags,
  featured,
  available,
  order
}`;

// Fetch all meals from Sanity
export async function getMeals(): Promise<Meal[]> {
  try {
    const meals = await sanityClient.fetch(mealsQuery);
    
    // Transform Sanity data to match Meal interface
    return meals.map((meal: any) => ({
      id: meal._id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      image: meal.image || '',
      category: meal.category as Meal['category'],
      tags: meal.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching meals from Sanity:', error);
    return [];
  }
}

// Fetch featured meals (for homepage)
export async function getFeaturedMeals(limit: number = 3): Promise<Meal[]> {
  try {
    // Always return the most recently created available meals
    const query = `*[_type == "meal" && (!defined(available) || available == true) && defined(image.asset)]
      | order(_createdAt desc) [0...${limit}] {
        _id,
        name,
        description,
        price,
        calories,
        protein,
        carbs,
        fats,
        "image": image.asset->url,
        "imageAlt": image.alt,
        category,
        tags,
        featured,
        available,
        order
      }`;

    const meals = await sanityClient.fetch(query);

    return meals.map((meal: any) => ({
      id: meal._id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      image: meal.image || '',
      category: meal.category as Meal['category'],
      tags: meal.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching featured meals from Sanity:', error);
    return [];
  }
}

// Fetch meals by category
export async function getMealsByCategory(category: string): Promise<Meal[]> {
  try {
    const query = `*[_type == "meal" && category == $category && (!defined(available) || available == true) && defined(image.asset)] | order(order asc, name asc) {
      _id,
      name,
      description,
      price,
      calories,
      protein,
      carbs,
      fats,
      "image": image.asset->url,
      "imageAlt": image.alt,
      category,
      tags,
      featured,
      available,
      order
    }`;
    
    const meals = await sanityClient.fetch(query, { category });
    
    return meals.map((meal: any) => ({
      id: meal._id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      image: meal.image || '',
      category: meal.category as Meal['category'],
      tags: meal.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching meals by category from Sanity:', error);
    return [];
  }
}



