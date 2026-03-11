import { NextResponse } from 'next/server';
import { getMealBySlug } from '@/lib/sanity-queries';
import {
  attachRazorpayOrder,
  createInternalOrder,
  createRazorpayOrder,
} from '@/lib/razorpay';

export const runtime = 'nodejs';

const parseQuantity = (value: unknown) => {
  const parsed =
    typeof value === 'number'
      ? value
      : Number.parseInt(
          typeof value === 'string' ? value : String(value ?? ''),
          10
        );

  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(25, parsed));
};

const parseRequestedItems = (
  body: any
): Array<{ slug: string; quantity: number }> => {
  if (Array.isArray(body?.items)) {
    const items = body.items
      .map((item: any) => ({
        slug: typeof item?.slug === 'string' ? item.slug.trim() : '',
        quantity: parseQuantity(item?.quantity),
      }))
      .filter((item: { slug: string; quantity: number }) => Boolean(item.slug));

    if (items.length > 0) return items;
  }

  const legacySlug =
    typeof body?.itemSlug === 'string' ? body.itemSlug.trim() : '';
  if (!legacySlug) return [];

  return [{ slug: legacySlug, quantity: parseQuantity(body?.quantity) }];
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const requestedItems = parseRequestedItems(body);

    if (requestedItems.length === 0) {
      return NextResponse.json({ error: 'Missing items.' }, { status: 400 });
    }

    const mergedBySlug = new Map<string, number>();
    for (const item of requestedItems) {
      mergedBySlug.set(
        item.slug,
        Math.max(1, Math.min(25, (mergedBySlug.get(item.slug) ?? 0) + item.quantity))
      );
    }

    const requestedEntries = Array.from(mergedBySlug.entries()).map(
      ([slug, quantity]) => ({
        slug,
        quantity,
      })
    );

    const mealLookups = await Promise.all(
      requestedEntries.map(async (entry) => ({
        ...entry,
        meal: await getMealBySlug(entry.slug),
      }))
    );

    const missingItems = mealLookups.filter((entry) => !entry.meal);
    if (missingItems.length > 0) {
      return NextResponse.json(
        { error: `Item not found: ${missingItems.map((item) => item.slug).join(', ')}` },
        { status: 404 }
      );
    }

    const lineItems = mealLookups.map((entry) => {
      const meal = entry.meal!;
      const unitPrice = Number(meal.price ?? 0);
      return {
        slug: meal.slug,
        name: meal.name,
        quantity: entry.quantity,
        unitPrice,
        lineTotal: unitPrice * entry.quantity,
      };
    });

    const currency = 'INR';
    const subtotalInRupees = lineItems.reduce(
      (total, item) => total + item.lineTotal,
      0
    );

    if (subtotalInRupees <= 0) {
      return NextResponse.json(
        {
          error:
            'One or more selected items have no price set. Please contact support.',
        },
        { status: 400 }
      );
    }

    // Razorpay expects amount in paise (smallest currency unit).
    // Minimum order is Rs 1 = 100 paise.
    const amount = Math.max(100, Math.round(subtotalInRupees * 100));
    if (!Number.isFinite(amount)) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    const customerFromBody =
      typeof body?.customer === 'object' && body.customer
        ? {
            name:
              typeof body.customer.name === 'string'
                ? body.customer.name.trim()
                : undefined,
            email:
              typeof body.customer.email === 'string'
                ? body.customer.email.trim()
                : undefined,
            phone:
              typeof body.customer.phone === 'string'
                ? body.customer.phone.trim()
                : undefined,
          }
        : undefined;

    const customer =
      customerFromBody &&
      (customerFromBody.name ||
        customerFromBody.email ||
        customerFromBody.phone)
        ? customerFromBody
        : undefined;

    const internal = createInternalOrder({
      amount,
      currency,
      items: lineItems,
      customer,
    });

    const razorpayOrder = await createRazorpayOrder({
      amount,
      currency,
      receipt: internal.id,
      notes: {
        itemCount: String(lineItems.length),
        items: lineItems.map((item) => `${item.slug}:${item.quantity}`).join(','),
      },
    });

    attachRazorpayOrder(internal.id, razorpayOrder.id);

    return NextResponse.json({
      orderId: internal.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      itemName:
        lineItems.length === 1 ? lineItems[0].name : `${lineItems.length} items`,
      items: lineItems,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

