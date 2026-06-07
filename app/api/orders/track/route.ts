import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get("trackingId")?.trim();

    if (!trackingId) {
      return NextResponse.json(
        { error: "Tracking ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      trackingId: new RegExp(`^${escapeRegex(trackingId)}$`, "i"),
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const safeData = {
      orderId: order.orderId,
      trackingId: order.trackingId,
      orderStatus: order.orderStatus,
      paymentStatus: order.payment?.paymentStatus,

      customer: {
        name: order.customerInfo?.name || "",
      },

      shippingAddress: {
        address: order.shippingAddress?.address || "",
        apartment: order.shippingAddress?.apartment || "",
        city: order.shippingAddress?.city || "",
        state: order.shippingAddress?.state || "",
        zip: order.shippingAddress?.zip || "",
        country: order.shippingAddress?.country || "",
      },

      items: (order.items || []).map((item: any) => ({
        title: item.title,
        image: item.image,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),

      amounts: {
        subtotal: order.amounts?.subtotal || 0,
        shippingAmount: order.amounts?.shippingAmount || 0,
        totalAmount: order.amounts?.totalAmount || 0,
        currency: order.amounts?.currency || "USD",
      },

      shipping: {
        courierName: order.shipping?.courierName || "",
        trackingNumber: order.shipping?.trackingNumber || "",
        trackingUrl: order.shipping?.trackingUrl || "",
      },

      trackingTimeline: (order.trackingTimeline || []).map((step: any) => ({
        status: step.status,
        message: step.message,
        timestamp: step.timestamp,
        updatedBy: step.updatedBy,
      })),

      createdAt: order.createdAt,
    };

    return NextResponse.json(safeData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while tracking the order";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}