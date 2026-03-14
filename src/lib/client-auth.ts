import { supabase } from "./supabase";

export const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Please sign in to continue.");
  }

  return session.access_token;
};
