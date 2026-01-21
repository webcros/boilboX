'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent } from 'react';

interface FiltersClientProps {
  categories: string[];
  selectedCategory: string;
}

export default function FiltersClient({ categories, selectedCategory }: FiltersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (event: MouseEvent<HTMLButtonElement>, category: string) => {
    event.preventDefault();
    event.stopPropagation();

    const params = new URLSearchParams(searchParams?.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/menu');
  };

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={(event) => handleClick(event, cat)}
          className={`flex h-11 shrink-0 items-center justify-center px-6 rounded-full text-sm font-bold transition-all text-white bg-primary hover:bg-primary-hover ${
            selectedCategory === cat 
            ? 'dark:bg-primary dark:text-bg-dark dark:hover:bg-primary' 
            : 'border border-gray-200 dark:bg-surface-dark dark:border-white/10 hover:border-primary dark:hover:bg-surface-dark'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
