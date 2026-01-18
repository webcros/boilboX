'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Server action to check if admin is authenticated
export async function checkAdminAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserAdminRole(session.user.email!);
    
    return isAdmin;
  } catch (error) {
    console.error('Admin auth check error:', error);
    return false;
  }
}

// Server action to get current admin
export async function getCurrentAdmin() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserAdminRole(session.user.email!);
    
    if (!isAdmin) {
      return null;
    }
    
    return {
      email: session.user.email,
      name: session.user.user_metadata.full_name || session.user.email,
      picture: session.user.user_metadata.avatar_url,
    };
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
}

// Server action to require admin authentication
export async function requireAdminAuth() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    redirect('/api/auth/google');
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