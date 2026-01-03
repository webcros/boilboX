'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold text-primary dark:text-primary-light">
            Admin Dashboard
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

const AdminFooter = () => (
  <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/10 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © 2024 BoilboX Admin Panel. Manage your content efficiently.
      </p>
    </div>
  </footer>
);

export const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AdminHeader />
    <main className="flex-1 py-8">
      {children}
    </main>
    <AdminFooter />
  </div>
);