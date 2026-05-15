import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { status, message } = await req.json();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.orderStatus = status;

    order.trackingTimeline.push({
      status,
      message: message || `Order status updated to ${status}.`,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}