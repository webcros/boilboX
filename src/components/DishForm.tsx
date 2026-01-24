'use client';

import { useState } from 'react';
import { sanityClient } from '@/lib/sanity';

interface DishFormData {
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: string;
  carbs: string;
  fats?: string;
  category: string;
  image?: string;
}

interface DishFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DishForm({ onClose, onSuccess }: DishFormProps) {
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    description: '',
    price: 0,
    calories: 0,
    protein: '',
    carbs: '',
    fats: '',
    category: 'High Protein',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['High Protein', 'Vegan', 'Low Carb', 'Heart Healthy', 'Balanced'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'calories' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.calories || 
          !formData.protein || !formData.carbs || !formData.category) {
        throw new Error('All required fields must be filled');
      }

      // Check if we have a write token
      if (!process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN) {
        throw new Error('Missing Sanity write token. Please configure NEXT_PUBLIC_SANITY_WRITE_TOKEN in your environment variables.');
      }

      const slugValue = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Create the dish document in Sanity
      const newDish = {
        _type: 'meal',
        name: formData.name,
        slug: {
          _type: 'slug',
          current: slugValue,
        },
        description: formData.description,
        price: formData.price,
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fats: formData.fats || undefined,
        category: formData.category,
        image: formData.image ? { _type: 'image', asset: { _ref: formData.image } } : undefined
      };

      await sanityClient.create(newDish);
      
      // Reset form and notify parent
      setFormData({
        name: '',
        description: '',
        price: 0,
        calories: 0,
        protein: '',
        carbs: '',
        fats: '',
        category: 'High Protein',
      });
      
      onSuccess();
    } catch (err: any) {
      let errorMessage = 'Failed to create dish. Please try again.';
      
      if (err.message.includes('write token')) {
        errorMessage = err.message;
      } else if (err.message.includes('required fields')) {
        errorMessage = err.message;
      } else if (err.message.includes('Unauthorized')) {
        errorMessage = 'Unauthorized access. Please check your Sanity write token.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black">Add New Dish</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Dish Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Price ($)*
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Calories *
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Protein *
                </label>
                <input
                  type="text"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 32g"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Carbs *
                </label>
                <input
                  type="text"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 12g"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Fats (Optional)
                </label>
                <input
                  type="text"
                  name="fats"
                  value={formData.fats}
                  onChange={handleChange}
                  placeholder="e.g., 5g"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary text-bg-dark font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Dish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}