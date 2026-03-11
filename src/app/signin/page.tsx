'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { user, isLoading, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/profile');
    }
  }, [isLoading, router, user]);

  const handleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (signInError) {
      const message =
        signInError instanceof Error
          ? signInError.message
          : 'Failed to sign in with Google.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-lg mx-auto bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-3">Sign In</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-8">
          Continue with your Google account to access your profile and saved
          details.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200 border border-red-200 dark:border-red-500/30 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignIn}
          disabled={isSubmitting || isLoading}
          className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Redirecting...' : 'Sign in with Google'}
          <span className="material-symbols-outlined text-base">login</span>
        </button>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-300">
          Admin user? Use{' '}
          <Link href="/login" className="text-primary font-bold">
            admin login
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

