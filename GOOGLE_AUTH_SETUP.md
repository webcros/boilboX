# Google OAuth Setup Notes

This project currently signs users in through Supabase Auth.

## Google Cloud Redirect URI

Use your Supabase callback URL in Google Cloud:

```text
https://sbcfczhwwtnuiqhgiiem.supabase.co/auth/v1/callback
```

Do not point Google Cloud directly at `/api/auth/google` or `/auth/callback`.

## Supabase URL Configuration

In Supabase **Authentication** > **URL Configuration**, allow the app routes used by this repo:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/api/auth/google`
- `https://boilox.com/auth/callback`
- `https://boilox.com/api/auth/google`

Using `http://localhost:3000/**` and `https://boilox.com/**` is also fine.

## Environment Variables

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

Notes:
- `NEXT_PUBLIC_BASE_URL` is not required for the current Supabase sign-in flow.
- `ADMIN_EMAILS` should be a comma-separated list.

## What Happens During Sign-In

1. The app asks Supabase to start Google OAuth.
2. Google sends the user back to the Supabase callback URL.
3. Supabase sends the user back to an allow-listed app URL such as `/auth/callback`.
4. The app restores the session and redirects the user to the next page.

If sign-in lands on `http://localhost:3000/#access_token=...`, the requested callback path is usually missing from Supabase's redirect allow list.
