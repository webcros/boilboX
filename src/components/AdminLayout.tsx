'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

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

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: User;
}

export const AdminLayout = ({ children, user: serverUser }: AdminLayoutProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(serverUser || null);
  const [isLoading, setIsLoading] = useState(!serverUser);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // If we received user from server, use it
    if (serverUser) {
      setCurrentUser(serverUser);
      setIsLoading(false);
      return;
    }

    // Otherwise, get user from Supabase
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser({
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.email,
            picture: session.user.user_metadata.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser({
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email,
          picture: session.user.user_metadata.avatar_url,
        });
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        // Redirect to login if user signs out on admin page
        window.location.href = '/api/auth/google';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-xl font-bold text-primary dark:text-primary-light">
              Admin Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  {currentUser.picture && (
                    <img 
                      src={currentUser.picture} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="hidden md:inline text-sm font-medium">{currentUser.name}</span>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <a 
                  href="/api/auth/google" 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Sign in with Google
                </a>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 BoilboX Admin Panel. Manage your content efficiently.
          </p>
        </div>
      </footer>
    </div>
  );
};