import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServerSecretKey =
  process.env.SUPABASE_SECRET_DEFAULT_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const isPublishableKey = (value: string) => value.startsWith("sb_publishable_");

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabasePublicKey) {
  throw new Error(
    "Missing Supabase public key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

const getSupabaseServerSecretKey = () => {
  if (!supabaseServerSecretKey) {
    throw new Error(
      "Missing Supabase server secret key. Set SUPABASE_SECRET_DEFAULT_KEY, SUPABASE_SECRET_KEY, or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (
    isPublishableKey(supabaseServerSecretKey) ||
    supabaseServerSecretKey === supabasePublicKey
  ) {
    throw new Error(
      "Supabase server secret key is misconfigured. Use a secret/service-role key, not a publishable or anon key.",
    );
  }

  return supabaseServerSecretKey;
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabasePublicKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const createAuthenticatedServerSupabaseClient = (accessToken: string) =>
  createClient(supabaseUrl, supabasePublicKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

// For server-side operations, you can create a server client with the service role key
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, getSupabaseServerSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
