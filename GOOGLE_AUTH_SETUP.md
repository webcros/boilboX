# Google OAuth Setup for Admin Authentication

To enable Google Sign-In for admins, you need to configure the following environment variables:

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google People API)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. For "Application type", select "Web application"
7. In "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/google` (for development)
   - `https://yourdomain.com/api/auth/google` (for production)

## 2. Add Environment Variables

Create or update your `.env.local` file with the following variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

Replace:
- `your_google_client_id_here` - Your Google OAuth client ID
- `your_google_client_secret_here` - Your Google OAuth client secret
- `http://localhost:3000` - Your application's base URL
- `admin@example.com,admin2@example.com` - Comma-separated list of admin email addresses

## 3. How It Works

1. When a user visits `/admin`, they are redirected to Google OAuth if not authenticated
2. Google OAuth verifies the user's email
3. The system checks if the user's email is in the `ADMIN_EMAILS` list
4. If authorized, a session is created and the user can access the admin panel
5. The user's information is displayed in the admin header
6. Users can sign out using the "Sign out" link

## 4. Security Notes

- Only emails listed in `ADMIN_EMAILS` can access the admin panel
- Session tokens are stored as HTTP-only cookies for security
- Sessions expire after 24 hours
- HTTPS is enforced in production