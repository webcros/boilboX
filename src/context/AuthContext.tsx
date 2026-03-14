"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: (nextPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (input: { name?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSessionUser = (sessionUser: User | null): AuthUser | null => {
  if (!sessionUser || typeof sessionUser.email !== "string") return null;

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name:
      sessionUser.user_metadata?.full_name ||
      sessionUser.user_metadata?.name ||
      sessionUser.email,
    picture:
      sessionUser.user_metadata?.avatar_url ||
      sessionUser.user_metadata?.picture ||
      undefined,
    phone:
      sessionUser.user_metadata?.phone ||
      (typeof sessionUser.phone === "string" ? sessionUser.phone : undefined),
    createdAt: sessionUser.created_at,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ? mapSessionUser(session.user) : null);
      } catch (error) {
        console.error("Error loading auth session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSessionUser(session.user) : null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(
    async (nextPath: string = "/profile") => {
      const safeNextPath =
        nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/profile";
      const redirectTo = new URL("/auth/callback", window.location.origin);
      redirectTo.searchParams.set("next", safeNextPath);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
        },
      });

      if (error) {
        throw error;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (input: { name?: string; phone?: string }) => {
      const name = input.name?.trim();
      const phone = input.phone?.trim();

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          phone,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(mapSessionUser(data.user));
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signInWithGoogle,
      signOut,
      updateProfile,
    }),
    [isLoading, signInWithGoogle, signOut, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
