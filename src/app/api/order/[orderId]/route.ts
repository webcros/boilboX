import { NextResponse } from "next/server";
import {
  buildOrderTracking,
  normalizeStoredOrder,
  ORDER_SELECT_FIELDS,
} from "@/lib/orders";
import {
  AuthenticationError,
  requireAuthenticatedRequest,
} from "@/lib/server-auth";
import {
  getReadableSupabaseErrorMessage,
  isMissingSupabaseTableError,
} from "@/lib/supabase-errors";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const { supabase, user } = await requireAuthenticatedRequest(request);

    let orderId = "";
    if (typeof params?.orderId === "string") {
      try {
        orderId = decodeURIComponent(params.orderId);
      } catch {
        orderId = params.orderId;
      }
    }

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT_FIELDS)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Failed to load order.");
    }

    const order = normalizeStoredOrder(data);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(buildOrderTracking(order));
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    const message = getReadableSupabaseErrorMessage(
      error,
      "Failed to load order.",
    );
    return NextResponse.json(
      { error: message },
      { status: isMissingSupabaseTableError(error) ? 503 : 500 },
    );
  }
}
