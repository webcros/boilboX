import { generatePageMetadata } from '@/lib/seo';
import { getMealBySlug } from '@/lib/sanity-queries';
import OrderClient from './OrderClient';

export const metadata = generatePageMetadata({
  title: "Order | BoilboX",
  description: "Order healthy, oil-free meals from BoilboX. Find the nearest kiosk and enjoy 100% boiled, nutritious meals.",
  url: "https://boilox.com/order",
  type: "website"
});

export default async function OrderPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const item = searchParams?.item?.toString();
  const meal = item ? await getMealBySlug(item) : null;

  return <OrderClient meal={meal} />;
}



