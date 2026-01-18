import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// For server-side operations, you can create a server client with the service role key
export const createServerSupabaseClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! || 'https://sbcfczhwwtnuiqhgiiem.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY! || 'sb_publishable_HKnUsvILoBz1piN4majsvQ_r-Hzztjf',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};