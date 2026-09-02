import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { requireAdminApi } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/orders');
    if ('error' in auth) return auth.error;
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search');
    const paymentStatus = searchParams.get('paymentStatus');
    const orderStatus = searchParams.get('orderStatus');
    const archive = searchParams.get('archive') || 'active';

    let query: any = {};

    if (archive === 'archived') {
      query.archived = true;
    } else if (archive !== 'all') {
      // $ne keeps orders created before the archive field was introduced visible.
      query.archived = { $ne: true };
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { trackingId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentStatus) {
      query['payment.paymentStatus'] = paymentStatus;
    }

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
