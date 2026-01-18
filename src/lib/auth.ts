import { supabase } from './supabase';

// Check if user is authenticated as admin
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserAdminRole(session.user.email!);
    
    return isAdmin;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

// Check if user is admin and return user data
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
      email: session.user.email!,
      name: session.user.user_metadata.full_name || session.user.email,
      picture: session.user.user_metadata.avatar_url,
    };
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
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
    const { sanityClient } = await import('./sanity');
    
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