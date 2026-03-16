import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getMealBySlug } from "@/lib/sanity-queries";
import {
  AuthenticationError,
  requireAuthenticatedRequest,
} from "@/lib/server-auth";
import {
  getReadableSupabaseErrorMessage,
  isMissingSupabaseTableError,
} from "@/lib/supabase-errors";

export const runtime = "nodejs";

interface CreateOrderRequestBody {
  items?: Array<{
    slug?: unknown;
    quantity?: unknown;
  }>;
  itemSlug?: unknown;
  quantity?: unknown;
  customer?: {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
  };
}

const parseQuantity = (value: unknown) => {
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseInt(
          typeof value === "string" ? value : String(value ?? ""),
          10,
        );

  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(25, parsed));
};

const parseRequestedItems = (
  body: CreateOrderRequestBody | null,
): Array<{ slug: string; quantity: number }> => {
  if (Array.isArray(body?.items)) {
    const items = body.items
      .map((item) => ({
        slug: typeof item?.slug === "string" ? item.slug.trim() : "",
        quantity: parseQuantity(item?.quantity),
      }))
      .filter((item: { slug: string; quantity: number }) => Boolean(item.slug));

    if (items.length > 0) return items;
  }

  const legacySlug =
    typeof body?.itemSlug === "string" ? body.itemSlug.trim() : "";
  if (!legacySlug) return [];

  return [{ slug: legacySlug, quantity: parseQuantity(body?.quantity) }];
};

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => null);
    const requestedItems = parseRequestedItems(body);

    if (requestedItems.length === 0) {
      return NextResponse.json({ error: "Missing items." }, { status: 400 });
    }

    const mergedBySlug = new Map<string, number>();
    for (const item of requestedItems) {
      mergedBySlug.set(
        item.slug,
        Math.max(
          1,
          Math.min(25, (mergedBySlug.get(item.slug) ?? 0) + item.quantity),
        ),
      );
    }

    const requestedEntries = Array.from(mergedBySlug.entries()).map(
      ([slug, quantity]) => ({
        slug,
        quantity,
      }),
    );

    const mealLookups = await Promise.all(
      requestedEntries.map(async (entry) => ({
        ...entry,
        meal: await getMealBySlug(entry.slug),
      })),
    );

    const missingItems = mealLookups.filter((entry) => !entry.meal);
    if (missingItems.length > 0) {
      return NextResponse.json(
        {
          error: `Item not found: ${missingItems.map((item) => item.slug).join(", ")}`,
        },
        { status: 404 },
      );
    }

    const lineItems = mealLookups
      .map((entry) => {
        const meal = entry.meal;
        if (!meal) {
          return null;
        }

        const unitPrice = Number(meal.price ?? 0);
        return {
          slug: meal.slug,
          name: meal.name,
          quantity: entry.quantity,
          unitPrice,
          lineTotal: unitPrice * entry.quantity,
        };
      })
      .filter(
        (
          item,
        ): item is {
          slug: string;
          name: string;
          quantity: number;
          unitPrice: number;
          lineTotal: number;
        } => Boolean(item),
      );

    const currency = "INR";
    const subtotalInRupees = lineItems.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    if (subtotalInRupees <= 0) {
      return NextResponse.json(
        {
          error:
            "One or more selected items have no price set. Please contact support.",
        },
        { status: 400 },
      );
    }

    const amount = Math.max(100, Math.round(subtotalInRupees * 100));
    if (!Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const customerFromBody =
      typeof body?.customer === "object" && body.customer
        ? {
            name:
              typeof body.customer.name === "string"
                ? body.customer.name.trim()
                : undefined,
            email:
              typeof body.customer.email === "string"
                ? body.customer.email.trim()
                : undefined,
            phone:
              typeof body.customer.phone === "string"
                ? body.customer.phone.trim()
                : undefined,
          }
        : undefined;

    const customer = {
      name:
        customerFromBody?.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        undefined,
      email: customerFromBody?.email || user.email || undefined,
      phone:
        customerFromBody?.phone ||
        (typeof user.phone === "string" ? user.phone : undefined) ||
        (typeof user.user_metadata?.phone === "string"
          ? user.user_metadata.phone
          : undefined),
    };

    const internalOrderId = crypto.randomUUID();

    const { error: insertError } = await supabase.from("orders").insert({
      id: internalOrderId,
      user_id: user.id,
      payment_status: "created",
      fulfillment_status: "payment_pending",
      amount,
      currency,
      items: lineItems,
      customer,
    });

    if (insertError) {
      throw new Error(insertError.message || "Failed to save order.");
    }

    try {
      const razorpayOrder = await createRazorpayOrder({
        amount,
        currency,
        receipt: internalOrderId,
        notes: {
          itemCount: String(lineItems.length),
          items: lineItems
            .map((item) => `${item.slug}:${item.quantity}`)
            .join(","),
        },
      });

      const { error: updateError } = await supabase
        .from("orders")
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq("id", internalOrderId)
        .eq("user_id", user.id);

      if (updateError) {
        throw new Error(
          updateError.message || "Failed to attach payment order.",
        );
      }

      return NextResponse.json({
        orderId: internalOrderId,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        itemName:
          lineItems.length === 1
            ? lineItems[0].name
            : `${lineItems.length} items`,
        items: lineItems,
      });
    } catch (razorpayError) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", internalOrderId)
        .eq("user_id", user.id);
      throw razorpayError;
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    const message = getReadableSupabaseErrorMessage(
      error,
      "Failed to create payment order.",
    );
    return NextResponse.json(
      { error: message },
      { status: isMissingSupabaseTableError(error) ? 503 : 500 },
    );
  }
}
