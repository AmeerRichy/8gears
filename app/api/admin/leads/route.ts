import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import CheckoutLead from '@/models/CheckoutLead';
import { requireAdminApi } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/leads');
    if ('error' in auth) return auth.error;
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query: any = {};

    if (search) {
      query.$or = [
        { leadId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const leads = await CheckoutLead.find(query).sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
