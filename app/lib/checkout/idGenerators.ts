import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';

export function generateRandomString(length: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateOrderId(): Promise<string> {
  await connectDB();
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  let isUnique = false;
  let orderId = '';
  
  while (!isUnique) {
    const random = Math.floor(10000 + Math.random() * 90000);
    orderId = `ORD-${dateStr}-${random}`;
    const existing = await Order.findOne({ orderId });
    if (!existing) isUnique = true;
  }
  
  return orderId;
}

export async function generateTrackingId(): Promise<string> {
  await connectDB();
  let isUnique = false;
  let trackingId = '';
  
  while (!isUnique) {
    const random = generateRandomString(6);
    trackingId = `TRK-8G-${random}`;
    const existing = await Order.findOne({ trackingId });
    if (!existing) isUnique = true;
  }
  
  return trackingId;
}

export async function generateLeadId(): Promise<string> {
  await connectDB();
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  let isUnique = false;
  let leadId = '';
  
  while (!isUnique) {
    const random = Math.floor(10000 + Math.random() * 90000);
    leadId = `LEAD-${dateStr}-${random}`;
    const CheckoutLead = (await import('@/models/CheckoutLead')).default;
    const existing = await CheckoutLead.findOne({ leadId });
    if (!existing) isUnique = true;
  }
  
  return leadId;
}

