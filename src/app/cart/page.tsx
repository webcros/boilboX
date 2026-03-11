import type { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Cart | BoilboX',
  description: 'Review your selected meals and continue to secure checkout.',
};

export default function CartPage() {
  return <CartClient />;
}

