import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { requireAdminApi } from '@/lib/adminAuth';

const ARCHIVE_AFTER_DAYS = 30;
const terminalStatuses = new Set(['delivered', 'cancelled', 'refunded']);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi('/admin/orders');
    if ('error' in auth) return auth.error;

    await connectDB();
    const { id } = await params;
    const { archived } = await req.json();

    if (typeof archived !== 'boolean') {
      return NextResponse.json({ error: 'archived must be a boolean' }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (archived) {
      if (!terminalStatuses.has(order.orderStatus)) {
        return NextResponse.json(
          {
            error:
              'This order is not completed. Only delivered, cancelled, or refunded orders can be archived.',
          },
          { status: 409 }
        );
      }

      const archiveEligibleAt = new Date(order.createdAt);
      archiveEligibleAt.setDate(archiveEligibleAt.getDate() + ARCHIVE_AFTER_DAYS);
      if (archiveEligibleAt > new Date()) {
        return NextResponse.json(
          { error: `Orders can only be archived after ${ARCHIVE_AFTER_DAYS} days.` },
          { status: 409 }
        );
      }

      order.archived = true;
      order.archivedAt = new Date();
      order.archivedBy = auth.user.email || auth.user.name || 'admin';
    } else {
      order.archived = false;
      order.archivedAt = undefined;
      order.archivedBy = undefined;
    }

    await order.save();
    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error('Order archive update failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update archive status' },
      { status: 500 }
    );
  }
}
