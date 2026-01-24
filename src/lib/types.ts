export interface Meal {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: string;
  carbs: string;
  fats?: string;
  image: string;
  imageAlt?: string;
  category: 'High Protein' | 'Vegan' | 'Low Carb' | 'Heart Healthy' | 'Balanced';
  tags?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating?: number;
  featuredMealId?: string;
}

export interface KioskLocation {
  id: string;
  name: string;
  address: string;
  status: 'Open Now' | 'Closing Soon' | 'Opens 10 AM' | 'Closed' | 'Opening Soon';
  closingTime?: string;
  distance: string;
  lat: number;
  lng: number;
  wheelchairAccessible?: boolean;
  ebtAccepted?: boolean;
  operator?: {
    name: string;
    avatar: string;
    quote: string;
  };
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary?: string;
  heroImage: string;
  heroImageAlt?: string;
  chapters: Array<{
    title: string;
    image?: string;
    content?: any;
    order?: number;
  }>;
  keyMoments: Array<{
    year: number;
    title: string;
    description?: string;
    image?: string;
  }>;
  publishedAt: string;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  slug: string;
  reportYear: number;
  summary: string;
  coverImage: string;
  coverImageAlt?: string;
  metrics: Array<{
    title: string;
    value: string;
    description?: string;
  }>;
  sections: Array<{
    title: string;
    content?: any;
    image?: string;
  }>;
  publishedAt: string;
  isFeatured?: boolean;
  downloadUrl?: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo: string;
  type: string;
  description: string;
  website?: string;
  featured?: boolean;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
  }>;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface BlogAuthor {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  bio?: any;
}

export interface BlogCategory {
  id: string;
  title: string;
  slug?: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage: string;
  mainImageAlt?: string;
  mainImageCaption?: string;
  author: BlogAuthor;
  categories: BlogCategory[];
  tags?: string[];
  publishedAt: string;
  readingTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  body: any;
}



