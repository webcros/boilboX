import { Meal, KioskLocation, Testimonial } from './types';

export const MEALS: Meal[] = [
  {
    id: '1',
    name: 'Poached Chicken & Greens',
    description: 'Tender chicken breast poached in ginger broth, served with bok choy and broccoli.',
    price: 12.50,
    calories: 340,
    protein: '32g',
    carbs: '12g',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    category: 'High Protein'
  },
  {
    id: '2',
    name: 'Tofu & Mushroom Broth',
    description: 'Silken tofu and shiitake mushrooms in a 12-hour vegetable reduction.',
    price: 10.00,
    calories: 180,
    protein: '14g',
    carbs: '22g',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    category: 'Vegan'
  },
  {
    id: '3',
    name: 'Harvest Bowl',
    description: 'Boiled sweet potato mash, corn, peas, and a hint of cracked black pepper.',
    price: 11.00,
    calories: 290,
    protein: '8g',
    carbs: '45g',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Low Carb',
    tags: ['Fiber Rich']
  },
  {
    id: '4',
    name: 'Steamed Salmon & Quinoa',
    description: 'Fresh Atlantic salmon, quinoa, steamed kale, carrots, lemon zest.',
    price: 14.50,
    calories: 420,
    protein: '32g',
    carbs: '28g',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    category: 'Heart Healthy'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Marketing Executive',
    quote: "I never thought boiled food could taste this good. I've lost 5kg in two months just by switching my lunch to BoilboX.",
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Fitness Coach',
    quote: "Finally, a fast food option that doesn't make me feel guilty. The transparency is total peace of mind.",
    avatar: 'https://i.pravatar.cc/150?u=david'
  }
];

export const LOCATIONS: KioskLocation[] = [
  {
    id: '1',
    name: 'BoilboX Downtown',
    address: '842 W Taylor St, San Francisco',
    status: 'Open Now',
    closingTime: '8 PM',
    distance: '0.8 mi',
    lat: 37.7749,
    lng: -122.4194,
    wheelchairAccessible: true,
    ebtAccepted: true,
    operator: {
      name: 'Operator Sarah',
      avatar: 'https://i.pravatar.cc/150?u=op_sarah',
      quote: "Try the steamed sweet potato bowl, it's my favorite!"
    }
  },
  {
    id: '2',
    name: 'BoilboX Mission District',
    address: '234 Valencia St, San Francisco',
    status: 'Closing Soon',
    closingTime: '5 PM',
    distance: '2.4 mi',
    lat: 37.7599,
    lng: -122.4148,
    wheelchairAccessible: true,
    ebtAccepted: false,
    operator: {
      name: 'Operator David',
      avatar: 'https://i.pravatar.cc/150?u=op_david',
      quote: "We've just restocked the spicy kale mix. Come say hi!"
    }
  }
];



