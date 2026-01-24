import { generatePageMetadata } from '@/lib/seo';
import { LocationsClient } from './LocationsClient';
import { getLocations } from '@/lib/sanity-queries';

export const metadata = generatePageMetadata({
  title: "Find a Location | BoilboX",
  description: "Find the nearest BoilboX kiosk. Order healthy, oil-free meals from our locations near you.",
  url: "https://boilox.com/locations",
  type: "website"
});

export default async function LocationsPage() {
  const locations = await getLocations();

  if (locations.length === 0) {
    return (
      <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">No locations available</h1>
          <p className="text-gray-500 dark:text-gray-300">
            Publish a location in Sanity to show it here.
          </p>
        </div>
      </div>
    );
  }

  return <LocationsClient locations={locations} />;
}



