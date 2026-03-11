import { NextResponse } from 'next/server';
import { getOrderTracking } from '@/lib/razorpay';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { orderId: string } }
) {
  let orderId = '';
  if (typeof params?.orderId === 'string') {
    try {
      orderId = decodeURIComponent(params.orderId);
    } catch {
      orderId = params.orderId;
    }
  }

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order id.' }, { status: 400 });
  }

  const tracking = getOrderTracking(orderId);
  if (!tracking) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json(tracking);
}
