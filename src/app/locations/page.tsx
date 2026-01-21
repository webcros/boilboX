import { LOCATIONS } from '@/lib/constants';
import { generatePageMetadata } from '@/lib/seo';
import { LocationsClient } from './LocationsClient';

export const metadata = generatePageMetadata({
  title: "Find a Location | BoilboX",
  description: "Find the nearest BoilboX kiosk. Order healthy, oil-free meals from our locations near you.",
  url: "https://boilox.com/locations",
  type: "website"
});

export default function LocationsPage() {
  return <LocationsClient locations={LOCATIONS} />;
}



