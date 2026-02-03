import { NextResponse } from 'next/server';
import { getMealBySlug } from '@/lib/sanity-queries';
import { attachRazorpayOrder, createInternalOrder, createRazorpayOrder } from '@/lib/razorpay';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const itemSlug = typeof body?.itemSlug === 'string' ? body.itemSlug : '';
    const quantityRaw = Number.parseInt(body?.quantity, 10);
    const quantity = Number.isFinite(quantityRaw) ? Math.max(1, Math.min(25, quantityRaw)) : 1;

    if (!itemSlug) {
      return NextResponse.json({ error: 'Missing item slug.' }, { status: 400 });
    }

    const meal = await getMealBySlug(itemSlug);
    if (!meal) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }

    const currency = 'INR';
    const amount = Math.round(meal.price * quantity * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    const internal = createInternalOrder({
      amount,
      currency,
      itemSlug: meal.slug,
      quantity,
    });

    const razorpayOrder = await createRazorpayOrder({
      amount,
      currency,
      receipt: internal.id,
      notes: {
        item: meal.slug,
        quantity: String(quantity),
      },
    });

    attachRazorpayOrder(internal.id, razorpayOrder.id);

    return NextResponse.json({
      orderId: internal.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      itemName: meal.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
