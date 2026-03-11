'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const formatDate = (value?: string) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
  }, [user]);

  if (isLoading) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center text-gray-500 dark:text-gray-300">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Sign in to view your profile
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Your Google account details and saved profile info will appear here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-black text-xl flex items-center justify-center">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsSigningOut(true);
                setError(null);
                setStatus(null);
                try {
                  await signOut();
                  router.push('/');
                } catch (signOutError) {
                  const message =
                    signOutError instanceof Error
                      ? signOutError.message
                      : 'Failed to sign out.';
                  setError(message);
                } finally {
                  setIsSigningOut(false);
                }
              }}
              disabled={isSigningOut}
              className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-6">Profile Details</h2>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200 border border-red-200 dark:border-red-500/30 text-sm">
              {error}
            </div>
          )}

          {status && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200 border border-green-200 dark:border-green-500/30 text-sm">
              {status}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setIsSaving(true);
              setError(null);
              setStatus(null);

              try {
                await updateProfile({
                  name,
                  phone,
                });
                setStatus('Profile updated successfully.');
              } catch (saveError) {
                const message =
                  saveError instanceof Error
                    ? saveError.message
                    : 'Failed to update profile.';
                setError(message);
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="profile-name"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
                >
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="profile-phone"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
                >
                  Phone
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Email
                </p>
                <div className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-500 dark:text-gray-300 flex items-center">
                  {user.email}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Member Since
                </p>
                <div className="h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm font-bold text-gray-500 dark:text-gray-300 flex items-center">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

