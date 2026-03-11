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

  const parseSerializedItems = (value: string) => {
    const tryParse = (raw: string) => {
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((item: any) => ({
            slug: typeof item?.slug === 'string' ? item.slug.trim() : '',
            quantity: parseQuantity(item?.quantity),
          }))
          .filter((item: { slug: string; quantity: number }) => Boolean(item.slug));
      } catch {
        return [];
      }
    };

    const direct = tryParse(value);
    if (direct.length > 0) return direct;

    try {
      return tryParse(decodeURIComponent(value));
    } catch {
      return [];
    }
  };

  const serializedItems =
    typeof searchParams?.items === 'string' ? searchParams.items : '';
  const legacyItem = typeof searchParams?.item === 'string' ? searchParams.item : '';
  const legacyQuantity =
    typeof searchParams?.qty === 'string' ? parseQuantity(searchParams.qty) : 1;

  const requestedItems =
    serializedItems.length > 0
      ? parseSerializedItems(serializedItems)
      : legacyItem
        ? [{ slug: legacyItem, quantity: legacyQuantity }]
        : [];

  const mergedBySlug = new Map<string, number>();
  for (const item of requestedItems) {
    mergedBySlug.set(
      item.slug,
      Math.max(1, Math.min(25, (mergedBySlug.get(item.slug) ?? 0) + item.quantity))
    );
  }

  const meals = await Promise.all(
    Array.from(mergedBySlug.entries()).map(async ([slug, quantity]) => ({
      quantity,
      meal: await getMealBySlug(slug),
    }))
  );

  const items = meals
    .filter((entry) => Boolean(entry.meal))
    .map((entry) => {
      const meal = entry.meal!;
      return {
        slug: meal.slug,
        name: meal.name,
        quantity: entry.quantity,
        unitPrice: meal.price,
        lineTotal: meal.price * entry.quantity,
      };
    });

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const customer = {
    name: typeof searchParams?.name === 'string' ? searchParams.name : '',
    email: typeof searchParams?.email === 'string' ? searchParams.email : '',
    phone: typeof searchParams?.phone === 'string' ? searchParams.phone : '',
  };

  return (
    <PaymentClient
      items={items}
      total={total}
      currency="INR"
      customer={customer}
      razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''}
    />
  );
}
