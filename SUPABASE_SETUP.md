# Supabase Google OAuth Setup Guide

This project uses Supabase Auth for Google sign-in.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Wait for the database to finish provisioning.

## Step 2: Configure Google In Supabase

1. Open **Authentication** > **Providers** in the Supabase dashboard.
2. Enable **Google**.
3. Paste your Google OAuth **Client ID** and **Client Secret**.
4. Save the provider.

Important:
- The Google callback URI must point to Supabase, not directly to your Next.js app.
- The callback format is `https://<project-ref>.supabase.co/auth/v1/callback`.
- For the project currently referenced in `.env`, that callback is `https://sbcfczhwwtnuiqhgiiem.supabase.co/auth/v1/callback`.

## Step 3: Configure Supabase URL Settings

1. Open **Authentication** > **URL Configuration**.
2. Set **Site URL**:
   - `http://localhost:3000` for local development
   - `https://boilox.com` for production
3. Add **Redirect URLs** for the app routes used by this codebase:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/api/auth/google`
   - `https://boilox.com/auth/callback`
   - `https://boilox.com/api/auth/google`

Notes:
- A broader allow list such as `http://localhost:3000/**` and `https://boilox.com/**` also works.
- If sign-in lands on `http://localhost:3000/#access_token=...` instead of `/auth/callback`, Supabase is usually falling back to the **Site URL** because the requested callback URL is not allow-listed.

## Step 4: Configure Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Enable the Google People API.
4. Go to **Credentials**.
5. Create an **OAuth 2.0 Client ID** for a web application.
6. In **Authorized redirect URIs**, add:
   - `https://sbcfczhwwtnuiqhgiiem.supabase.co/auth/v1/callback`

Do not use `/auth/callback` or `/api/auth/google` in Google Cloud. Those are app URLs that belong in Supabase **URL Configuration**, not in Google Cloud redirect URIs.

## Step 5: Update Environment Variables

Add these variables to `.env.local`:

```env
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin emails
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

Notes:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` can be used instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SECRET_KEY` or `SUPABASE_SECRET_DEFAULT_KEY` can be used instead of `SUPABASE_SERVICE_ROLE_KEY`.
- Do not put a publishable or anon key into the server secret variable. The server secret must be a real Supabase secret or service-role key.

To find your Supabase keys:
1. Open **Project Settings** > **API** in Supabase.
2. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the **anon** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the **service_role** or secret key into `SUPABASE_SERVICE_ROLE_KEY`.

## Step 6: Test The Setup

1. Restart the dev server.
2. Visit `/signin` for customer auth or `/login` for admin auth.
3. Sign in with Google.
4. Confirm you return to the expected page instead of the bare site root.

## Troubleshooting

**Issue**: `redirect_uri_mismatch`
- Solution: Make the Google Cloud redirect URI exactly match your Supabase callback URL, for example `https://sbcfczhwwtnuiqhgiiem.supabase.co/auth/v1/callback`.

**Issue**: Sign-in returns to `http://localhost:3000/#access_token=...`
- Solution: Add `http://localhost:3000/auth/callback` to Supabase **Authentication** > **URL Configuration** > **Redirect URLs**, or allow `http://localhost:3000/**`. Do the same for production with `https://boilox.com/auth/callback` or `https://boilox.com/**`.

**Issue**: User can sign in but does not have admin access
- Solution: Make sure the email is listed in `ADMIN_EMAILS`, or that the user exists in Sanity with the `admin` role.

**Issue**: Supabase connection fails
- Solution: Verify `NEXT_PUBLIC_SUPABASE_URL`, the public key, and the server secret key in your environment variables.

## Cart And Orders Schema

To enable account-bound carts and order history, run the SQL in
`supabase_migration_auth_cart_orders.sql` from the Supabase SQL editor.

If checkout shows `Could not find the table 'public.orders' in the schema cache`,
the connected Supabase project is missing that migration. After running the SQL,
retry the request. If the error still appears immediately, run:

```sql
notify pgrst, 'reload schema';
```
