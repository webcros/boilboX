import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r21ib0qn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Set to false for write operations
  apiVersion: '2024-01-01',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, // Add this token to your environment variables
});




