'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Meal } from '@/lib/types';

const STORAGE_KEY = 'boilox-cart-v1';
const MAX_QTY_PER_ITEM = 25;

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  imageAlt?: string;
  price: number;
  category: Meal['category'];
  quantity: number;
}

type CartMealInput = Pick<
  Meal,
  'slug' | 'name' | 'image' | 'imageAlt' | 'price' | 'category'
>;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (meal: CartMealInput, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const clampQuantity = (value: number) =>
  Math.max(1, Math.min(MAX_QTY_PER_ITEM, Math.floor(value)));

const parseStoredCart = (raw: string | null): CartItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (
          !item ||
          typeof item.slug !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.price !== 'number' ||
          typeof item.quantity !== 'number' ||
          typeof item.category !== 'string'
        ) {
          return null;
        }

        return {
          slug: item.slug,
          name: item.name,
          image: typeof item.image === 'string' ? item.image : '',
          imageAlt: typeof item.imageAlt === 'string' ? item.imageAlt : undefined,
          price: item.price,
          category: item.category as Meal['category'],
          quantity: clampQuantity(item.quantity),
        } as CartItem;
      })
      .filter((item): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedItems = parseStoredCart(localStorage.getItem(STORAGE_KEY));
    setItems(storedItems);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const addItem = useCallback((meal: CartMealInput, quantity: number = 1) => {
    const qty = clampQuantity(quantity);
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === meal.slug);
      if (!existing) {
        return [
          ...prev,
          {
            slug: meal.slug,
            name: meal.name,
            image: meal.image,
            imageAlt: meal.imageAlt,
            price: meal.price,
            category: meal.category,
            quantity: qty,
          },
        ];
      }

      return prev.map((item) =>
        item.slug === meal.slug
          ? { ...item, quantity: clampQuantity(item.quantity + qty) }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.slug !== slug));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, itemCount, items, removeItem, subtotal, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

