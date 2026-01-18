import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // Handle the OAuth callback
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Supabase OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/login?error=no_user', request.url));
    }

    // Check if user has admin role
    const isAdmin = await checkUserAdminRole(user.email!);
    
    if (!isAdmin) {
      // Sign out the user if they don't have admin access
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
    }

    // Redirect to admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  } else {
    // Initiate Google OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.nextUrl.origin}/api/auth/google`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Supabase OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=init_error', request.url));
    }

    // Redirect to Google OAuth consent screen
    return NextResponse.redirect(data.url);
  }
}

// Function to check if user has admin role
async function checkUserAdminRole(email: string): Promise<boolean> {
  try {
    // Check if user is in the admin emails list from environment variables
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const normalizedAdminEmails = adminEmails.map(email => email.trim().toLowerCase());
    
    if (normalizedAdminEmails.includes(email.toLowerCase())) {
      return true;
    }
    
    // Check if user exists in Sanity with admin role
    const { sanityClient } = await import('@/lib/sanity');
    
    const query = `*[_type == 'user' && email == $email][0]{
      role
    }`;
    
    const user = await sanityClient.fetch(query, { email });
    
    return user && user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

