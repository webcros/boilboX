"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Meal } from "@/lib/types";

const STORAGE_KEY = "boilox-cart-v1";
const MAX_QTY_PER_ITEM = 25;

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  imageAlt?: string;
  price: number;
  category: Meal["category"];
  quantity: number;
}

type CartMealInput = Pick<
  Meal,
  "slug" | "name" | "image" | "imageAlt" | "price" | "category"
>;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
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
          typeof item.slug !== "string" ||
          typeof item.name !== "string" ||
          typeof item.price !== "number" ||
          typeof item.quantity !== "number" ||
          typeof item.category !== "string"
        ) {
          return null;
        }

        return {
          slug: item.slug,
          name: item.name,
          image: typeof item.image === "string" ? item.image : "",
          imageAlt:
            typeof item.imageAlt === "string" ? item.imageAlt : undefined,
          price: item.price,
          category: item.category as Meal["category"],
          quantity: clampQuantity(item.quantity),
        } as CartItem;
      })
      .filter((item): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
};

const mergeCartItems = (...groups: CartItem[][]) => {
  const merged = new Map<string, CartItem>();

  for (const group of groups) {
    for (const item of group) {
      const existing = merged.get(item.slug);
      if (!existing) {
        merged.set(item.slug, {
          ...item,
          quantity: clampQuantity(item.quantity),
        });
        continue;
      }

      merged.set(item.slug, {
        ...existing,
        ...item,
        quantity: clampQuantity(existing.quantity + item.quantity),
      });
    }
  }

  return Array.from(merged.values());
};

const normalizeCartItems = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return parseStoredCart(JSON.stringify(value));
};

const saveGuestCart = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const saveRemoteCart = async (userId: string, items: CartItem[]) => {
  const { error } = await supabase.from("user_carts").upsert(
    {
      user_id: userId,
      items,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw error;
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    let cancelled = false;

    const loadCart = async () => {
      setIsLoading(true);
      const guestItems = parseStoredCart(localStorage.getItem(STORAGE_KEY));

      if (!user?.id) {
        if (!cancelled) {
          setItems(guestItems);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_carts")
          .select("items")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        const savedItems = normalizeCartItems(data?.items);
        const mergedItems = mergeCartItems(savedItems, guestItems);

        if (!cancelled) {
          setItems(mergedItems);
        }

        if (
          guestItems.length > 0 ||
          JSON.stringify(savedItems) !== JSON.stringify(mergedItems)
        ) {
          await saveRemoteCart(user.id, mergedItems);
        }

        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error loading saved cart:", error);
        if (!cancelled) {
          setItems(guestItems);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, user?.id]);

  useEffect(() => {
    if (isAuthLoading || isLoading) return;

    const persistCart = async () => {
      try {
        if (user?.id) {
          await saveRemoteCart(user.id, items);
          return;
        }

        saveGuestCart(items);
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    persistCart();
  }, [isAuthLoading, isLoading, items, user?.id]);

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
          : item,
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
        item.slug === slug
          ? { ...item, quantity: clampQuantity(quantity) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      isLoading,
      itemCount,
      items,
      removeItem,
      subtotal,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
