import { NextResponse } from 'next/server';
import { getOrder, markOrderPaid, verifyRazorpaySignature } from '@/lib/razorpay';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const razorpayOrderId = typeof body?.razorpay_order_id === 'string' ? body.razorpay_order_id : '';
    const razorpayPaymentId = typeof body?.razorpay_payment_id === 'string' ? body.razorpay_payment_id : '';
    const razorpaySignature = typeof body?.razorpay_signature === 'string' ? body.razorpay_signature : '';
    const orderId = typeof body?.orderId === 'string' ? body.orderId : '';

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment verification fields.' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    if (orderId) {
      const stored = getOrder(orderId);
      if (stored?.razorpayOrderId && stored.razorpayOrderId !== razorpayOrderId) {
        return NextResponse.json({ error: 'Order mismatch.' }, { status: 400 });
      }
      markOrderPaid(orderId);
    }

    return NextResponse.json({ success: true, status: 'paid' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
