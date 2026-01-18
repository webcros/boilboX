# Supabase Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth with Supabase for admin authentication.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for an account
2. Create a new project
3. Wait for the database to be provisioned (this may take a minute)

## Step 2: Configure Google OAuth Provider

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Scroll down to **External OAuth providers**
3. Find "Google" and click the "Enable" toggle
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
   - **Redirect URL**: `http://localhost:3000/api/auth/google` (for development)

## Step 3: Set Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google People API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. For "Application type", select "Web application"
7. In "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/google` (for development)
   - Your production URL if applicable

## Step 4: Update Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Admin emails (comma-separated list of emails that have admin access)
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

To find your Supabase keys:
1. Go to your Supabase project dashboard
2. Go to **Project Settings** > **API**
3. Copy the "Project URL" as your `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the " anon key" as your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the "service_role key" as your `SUPABASE_SERVICE_ROLE_KEY`

## Step 5: Database Schema (Optional)

If you want to store additional user information in Supabase, you can create a users table:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 6: Test the Setup

1. Restart your development server
2. Navigate to `/login` in your application
3. Try signing in with Google
4. If everything is configured correctly, you should be able to sign in

## Troubleshooting

**Issue**: `redirect_uri_mismatch` error
- Solution: Make sure the redirect URI in Google Cloud Console exactly matches the one used in the application (`http://localhost:3000/api/auth/google`)

**Issue**: User can sign in but doesn't have admin access
- Solution: Make sure the user's email is in the `ADMIN_EMAILS` environment variable, or that they exist in Sanity CMS with the 'admin' role

**Issue**: Supabase connection fails
- Solution: Verify your Supabase URL and API keys are correct in the environment variables