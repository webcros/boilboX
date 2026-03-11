'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const toFriendlyError = (message: string) => {
    if (message.toLowerCase().includes('invalid api key')) {
      return 'Invalid Supabase API key. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your .env and restart the dev server.';
    }
    return message;
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let unsubscribe: (() => void) | null = null;

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const nextPath = params.get('next') || '/profile';
        const oauthError =
          params.get('error_description') || params.get('error');

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!cancelled && session) {
            router.replace(nextPath);
          }
        });
        unsubscribe = () => subscription.unsubscribe();

        const tryRedirectIfSession = async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!cancelled && session) {
            router.replace(nextPath);
            return true;
          }
          return false;
        };

        if (oauthError) {
          setError(toFriendlyError(decodeURIComponent(oauthError)));
          return;
        }

        if (await tryRedirectIfSession()) return;

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            if (!cancelled) {
              setError(
                toFriendlyError(
                  exchangeError.message || 'Failed to complete sign in.'
                )
              );
            }
            return;
          }

          if (await tryRedirectIfSession()) return;
        }

        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (setSessionError) {
              if (!cancelled) {
                setError(
                  toFriendlyError(
                    setSessionError.message || 'Failed to complete sign in.'
                  )
                );
              }
              return;
            }

            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search
            );

            if (await tryRedirectIfSession()) return;
          }
        }

        for (let i = 0; i < 10; i += 1) {
          if (await tryRedirectIfSession()) return;
          await new Promise((resolve) => window.setTimeout(resolve, 200));
        }

        if (!cancelled) {
          setError('Could not complete sign in. Please try again.');
        }
      } catch (unknownError) {
        if (!cancelled) {
          setError(
            toFriendlyError(
              unknownError instanceof Error
                ? unknownError.message
                : 'Failed to complete sign in.'
            )
          );
        }
      } finally {
        if (unsubscribe) unsubscribe();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-lg mx-auto bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-black mb-3">
          Completing Sign In
        </h1>
        {!error ? (
          <p className="text-gray-500 dark:text-gray-300">
            Please wait while we connect your Google account...
          </p>
        ) : (
          <>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signin"
                className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold flex items-center justify-center"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="h-11 px-5 rounded-xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Back Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
