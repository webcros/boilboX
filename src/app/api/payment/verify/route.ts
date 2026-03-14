import { NextResponse } from "next/server";
import {
  buildOrderTracking,
  normalizeStoredOrder,
  ORDER_SELECT_FIELDS,
} from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import {
  AuthenticationError,
  requireAuthenticatedRequest,
} from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => null);
    const razorpayOrderId =
      typeof body?.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const razorpayPaymentId =
      typeof body?.razorpay_payment_id === "string"
        ? body.razorpay_payment_id
        : "";
    const razorpaySignature =
      typeof body?.razorpay_signature === "string"
        ? body.razorpay_signature
        : "";
    const orderId = typeof body?.orderId === "string" ? body.orderId : "";

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 },
      );
    }

    const { data: orderRecord, error: orderError } = await supabase
      .from("orders")
      .select(ORDER_SELECT_FIELDS)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError) {
      throw new Error(orderError.message || "Failed to load order.");
    }

    const stored = normalizeStoredOrder(orderRecord);
    if (!stored) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (stored.razorpayOrderId && stored.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 },
      );
    }

    const paidAt = stored.paidAt ?? new Date().toISOString();

    const { data: updatedRecord, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        fulfillment_status: "payment_confirmed",
        paid_at: paidAt,
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .select(ORDER_SELECT_FIELDS)
      .single();

    if (updateError) {
      throw new Error(updateError.message || "Failed to update order.");
    }

    const updatedOrder = normalizeStoredOrder(updatedRecord);
    if (!updatedOrder) {
      throw new Error("Failed to load updated order.");
    }

    const { error: cartError } = await supabase.from("user_carts").upsert(
      {
        user_id: user.id,
        items: [],
        updated_at: paidAt,
      },
      { onConflict: "user_id" },
    );

    if (cartError) {
      console.error("Error clearing saved cart after payment:", cartError);
    }

    return NextResponse.json({
      success: true,
      status: "paid",
      tracking: buildOrderTracking(updatedOrder),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
