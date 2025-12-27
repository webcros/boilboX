import { redirect } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: "Order | BoilboX",
  description: "Order healthy, oil-free meals from BoilboX. Find the nearest kiosk and enjoy 100% boiled, nutritious meals.",
  url: "https://boilox.com/order",
  type: "website"
});

export default function OrderPage() {
  redirect('/locations');
}



