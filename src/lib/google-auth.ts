// Using require to match existing pattern and avoid potential type issues
const { google } = require('googleapis');

export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const getOAuth2Client = () => {
  const baseUrl = getBaseUrl();
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${baseUrl}/api/auth/google`
  );
};
