'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Meal } from '@/lib/types';

interface AddToCartButtonProps {
  meal: Pick<Meal, 'slug' | 'name' | 'image' | 'imageAlt' | 'price' | 'category'>;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  meal,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(meal, quantity);
        setIsAdded(true);
        window.setTimeout(() => setIsAdded(false), 1200);
      }}
      className={className}
    >
      {isAdded ? 'Added to Cart' : 'Add to Cart'}
      <span className="material-symbols-outlined text-lg">
        {isAdded ? 'check_circle' : 'add_circle'}
      </span>
    </button>
  );
}

