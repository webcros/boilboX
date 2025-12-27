'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { getMeals } from '@/lib/sanity-queries';
import { Meal } from '@/lib/types';
import DishForm from '@/components/DishForm';

interface AnalyticsData {
  _id: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  pageViews?: number;
  uniqueVisitors?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  [key: string]: unknown;
}

export default function ClientAdmin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'content'>('dashboard');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [menuItems, setMenuItems] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch analytics data (you may need to adjust this based on your Sanity schema)
      // For now, we'll just set an empty array
      setAnalyticsData([]);
      
      // Fetch menu items
      const meals = await getMeals();
      setMenuItems(meals);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDishCreated = () => {
    setShowDishForm(false);
    // Refresh the menu items to show the new dish
    fetchInitialData();
  };

  const totalPageViews = analyticsData.reduce((sum, item) => sum + (item.pageViews || 0), 0);
  const totalUniqueVisitors = analyticsData.reduce((sum, item) => sum + (item.uniqueVisitors || 0), 0);
  const avgBounceRate = analyticsData.length > 0
    ? analyticsData.reduce((sum, item) => sum + (item.bounceRate || 0), 0) / analyticsData.length
    : 0;
  const avgSessionDuration = analyticsData.length > 0
    ? analyticsData.reduce((sum, item) => sum + (item.avgSessionDuration || 0), 0) / analyticsData.length
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Loading admin dashboard...
            </div>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-full w-1/3 animate-pulse bg-primary" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Admin Header */}
        <div className="px-4 md:px-10 lg:px-40 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4">Admin Dashboard</h1>
            <p className="text-gray-500 text-lg">Manage your BoilboX website content and analytics</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-white/10 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-bold text-sm ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 font-bold text-sm ${
                activeTab === 'menu'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-bold text-sm ${
                activeTab === 'content'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Content Management
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Page Views</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {totalPageViews.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Unique Visitors</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {totalUniqueVisitors.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Avg Bounce Rate</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {avgBounceRate.toFixed(1)}%
                  </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Avg Session</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {Math.round(avgSessionDuration)}s
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="/studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-bg-dark dark:bg-white text-white dark:text-bg-dark p-6 rounded-xl font-black hover:opacity-90 transition-opacity text-center"
                  >
                    Open Sanity Studio
                  </a>
                  <button className="border border-gray-200 dark:border-white/10 p-6 rounded-xl font-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-center">
                    Manage Orders
                  </button>
                  <button className="border border-gray-200 dark:border-white/10 p-6 rounded-xl font-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-center">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black">Menu Management</h2>
                <button
                  onClick={() => setShowDishForm(true)}
                  className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-black hover:bg-primary-hover transition-colors"
                >
                  Add New Dish
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.length > 0 ? (
                  menuItems.map((meal) => (
                    <div key={meal.id} className="bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all group">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-5 left-5 z-10 flex gap-2">
                          <span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary">
                            {meal.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{meal.name}</h3>
                          <span className="text-primary font-black text-2xl">${meal.price.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">{meal.description}</p>
                        
                        {/* Macros Breakdown */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-dashed border-gray-100 dark:border-white/10 mb-8">
                          <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Calories</p>
                            <p className="text-xl font-black">{meal.calories}</p>
                          </div>
                          <div className="text-center border-x border-gray-100 dark:border-white/10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protein</p>
                            <p className="text-xl font-black">{meal.protein}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Carbs</p>
                            <p className="text-xl font-black">{meal.carbs}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <a 
                            href="/studio" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                          >
                            Edit in Sanity
                          </a>
                          <button className="w-14 h-14 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No menu items found. Add dishes using the form.</p>
                    <button
                      onClick={() => setShowDishForm(true)}
                      className="inline-block mt-4 bg-primary text-bg-dark px-6 py-3 rounded-xl font-black hover:bg-primary-hover transition-colors"
                    >
                      Add Your First Dish
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black">Content Management</h2>
                <a 
                  href="/studio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-black hover:bg-primary-hover transition-colors"
                >
                  Open Content Studio
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">restaurant_menu</span>
                    </div>
                    <h3 className="text-xl font-black">Menu Content</h3>
                  </div>
                  <p className="text-gray-500 mb-6">Manage your menu items, categories, and descriptions.</p>
                  <a 
                    href="/studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-bg-dark dark:bg-white text-white dark:text-bg-dark px-6 py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
                  >
                    Manage Menu
                  </a>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">article</span>
                    </div>
                    <h3 className="text-xl font-black">Blog & Stories</h3>
                  </div>
                  <p className="text-gray-500 mb-6">Create and manage blog posts, stories, and impact reports.</p>
                  <a 
                    href="/studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-bg-dark dark:bg-white text-white dark:text-bg-dark px-6 py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
                  >
                    Manage Content
                  </a>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                    </div>
                    <h3 className="text-xl font-black">Location Data</h3>
                  </div>
                  <p className="text-gray-500 mb-6">Manage location information and kiosk details.</p>
                  <a 
                    href="/studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-bg-dark dark:bg-white text-white dark:text-bg-dark px-6 py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
                  >
                    Manage Locations
                  </a>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">people</span>
                    </div>
                    <h3 className="text-xl font-black">Team & Partners</h3>
                  </div>
                  <p className="text-gray-500 mb-6">Manage team members, partners, and testimonials.</p>
                  <a 
                    href="/studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-bg-dark dark:bg-white text-white dark:text-bg-dark px-6 py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
                  >
                    Manage Team
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dish Form Modal */}
      {showDishForm && (
        <DishForm 
          onClose={() => setShowDishForm(false)} 
          onSuccess={handleDishCreated} 
        />
      )}
    </Layout>
  );
}