import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get("trackingId");

    if (!trackingId) {
      return NextResponse.json(
        { error: "Tracking ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ trackingId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return safe data
    const safeData = {
      orderId: order.orderId,
      trackingId: order.trackingId,
      orderStatus: order.orderStatus,
      paymentStatus: order.payment.paymentStatus,
      items: order.items,
      amounts: order.amounts,
      shipping: order.shipping,
      trackingTimeline: order.trackingTimeline,
      createdAt: order.createdAt,
    };

    return NextResponse.json(safeData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}