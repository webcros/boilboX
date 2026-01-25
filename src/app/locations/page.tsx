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

  return <LocationsClient locations={locations} />;
}



