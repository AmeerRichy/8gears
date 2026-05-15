import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await context.params;

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}