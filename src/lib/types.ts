export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: string;
  carbs: string;
  fats?: string;
  image: string;
  category: 'High Protein' | 'Vegan' | 'Low Carb' | 'Heart Healthy' | 'Balanced';
  tags?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface KioskLocation {
  id: string;
  name: string;
  address: string;
  status: 'Open Now' | 'Closing Soon' | 'Opens 10 AM';
  closingTime?: string;
  distance: string;
  operator?: {
    name: string;
    avatar: string;
    quote: string;
  };
}



