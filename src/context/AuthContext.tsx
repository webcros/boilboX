'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin role
          const isAdmin = await checkUserAdminRole(session.user.email!);
          if (isAdmin) {
            setUser({
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.email,
              picture: session.user.user_metadata.avatar_url,
            });
          } else {
            // User doesn't have admin role, sign them out
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user has admin role
          const isAdmin = await checkUserAdminRole(session.user.email!);
          if (isAdmin) {
            setUser({
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.email,
              picture: session.user.user_metadata.avatar_url,
            });
          } else {
            // User doesn't have admin role, sign them out
            await supabase.auth.signOut();
            window.location.href = '/login?error=access_denied';
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/google`,
      }
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkUserAdminRole = async (email: string): Promise<boolean> => {
    try {
      // Check if user is in the admin emails list from environment variables
      // Since we're on the client, we can't access env vars directly
      // We'll rely on the server-side check in the API route
      
      // For now, just return true if we have a session and let the server handle the admin check
      // In a real implementation, you might fetch this from an API endpoint
      const response = await fetch(`/api/check-admin?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.isAdmin;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}