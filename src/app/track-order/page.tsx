import type { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Order | BoilboX',
  description: 'Track your BoilboX order status in real time.',
};

export default function TrackOrderPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const orderId =
    typeof searchParams?.orderId === 'string' ? searchParams.orderId : '';

  return <TrackOrderClient initialOrderId={orderId} />;
}

