import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { requireAdminApi } from '@/lib/adminAuth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi('/admin/orders');
    if ('error' in auth) return auth.error;
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi('/admin/orders');
    if ('error' in auth) return auth.error;
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (existingOrder.archived) {
      return NextResponse.json(
        { error: 'Archived orders are read-only. Restore this order before editing it.' },
        { status: 409 }
      );
    }

    const order = await Order.findByIdAndUpdate(id, body, { 
      new: true,
      returnDocument: 'after' 
    });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
