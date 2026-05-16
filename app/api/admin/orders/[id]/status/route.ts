import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const {
      orderStatus,
      fulfillmentStatus,
      courierName,
      trackingNumber,
      trackingUrl,
      adminNotes,
      timelineMessage,
    } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
    if (courierName !== undefined) {
      if (!order.shipping) order.shipping = {};
      order.shipping.courierName = courierName;
    }
    if (trackingNumber !== undefined) {
      if (!order.shipping) order.shipping = {};
      order.shipping.trackingNumber = trackingNumber;
    }
    if (trackingUrl !== undefined) {
      if (!order.shipping) order.shipping = {};
      order.shipping.trackingUrl = trackingUrl;
    }
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    if (orderStatus) {
      order.trackingTimeline.push({
        status: orderStatus,
        message: timelineMessage || `Order status updated to ${orderStatus.replace(/_/g, ' ')}.`,
        timestamp: new Date(),
        updatedBy: 'admin',
      });
    }

    await order.save();
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}