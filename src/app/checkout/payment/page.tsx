import { generatePageMetadata } from '@/lib/seo';
import { getMealBySlug } from '@/lib/sanity-queries';
import PaymentClient from './PaymentClient';

export const metadata = generatePageMetadata({
  title: 'Payment | BoilboX',
  description: 'Complete your BoilboX order with a secure payment.',
  url: 'https://boilox.com/checkout/payment',
  type: 'website',
});

export default async function PaymentPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const item = typeof searchParams?.item === 'string' ? searchParams.item : '';
  const quantityRaw = typeof searchParams?.qty === 'string' ? Number.parseInt(searchParams.qty, 10) : 1;
  const quantity = Number.isFinite(quantityRaw) ? Math.max(1, Math.min(25, quantityRaw)) : 1;

  const meal = item ? await getMealBySlug(item) : null;
  const total = meal ? meal.price * quantity : 0;

  const customer = {
    name: typeof searchParams?.name === 'string' ? searchParams.name : '',
    email: typeof searchParams?.email === 'string' ? searchParams.email : '',
    phone: typeof searchParams?.phone === 'string' ? searchParams.phone : '',
  };

  return (
    <PaymentClient
      meal={meal}
      quantity={quantity}
      total={total}
      currency="INR"
      customer={customer}
      razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''}
    />
  );
}
