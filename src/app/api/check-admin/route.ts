import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check if user has admin role
    const isAdmin = await checkUserAdminRole(email);
    
    return new Response(JSON.stringify({ isAdmin }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking admin role:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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