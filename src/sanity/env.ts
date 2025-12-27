// Make sure to set up your .env.local file with your Sanity project credentials
// See SETUP.md for instructions on how to configure your Sanity project

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '' // IMPORTANT: Set your Sanity Project ID in .env.local