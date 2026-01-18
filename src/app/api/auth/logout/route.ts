import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Create a response that redirects to home
  const response = NextResponse.redirect(new URL('/', request.url));
  
  return response;
}