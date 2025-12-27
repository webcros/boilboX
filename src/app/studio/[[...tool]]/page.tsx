/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path are handled by this file using Next.js catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * Learn more about next-sanity:
 * https://github.com/sanity-io/next-sanity
 */

// Force dynamic rendering for Sanity Studio
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-only exports (allowed here)
export { metadata, viewport } from 'next-sanity/studio';

import StudioClient from './StudioClient';

export default function StudioPage() {
  return <StudioClient />;
}
