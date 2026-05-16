import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import CheckoutLead from '@/models/CheckoutLead';
import { buildCheckoutOrderItems } from '@/lib/checkout/buildCheckoutOrderItems';
import { generateLeadId } from '@/lib/checkout/idGenerators';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { items, customer, shippingAddress, selectedPaymentMethod, subscribe } = await req.json();

    if (!items || !customer || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Calculate items from MongoDB
    const checkoutData = await buildCheckoutOrderItems(items);

    // 2. Check for existing unpaid lead with same email
    const existingLead = await CheckoutLead.findOne({
      'customerInfo.email': customer.email,
      status: { $in: ['started', 'payment_started'] },
    });

    let lead;
    if (existingLead) {
      // Update existing lead
      existingLead.customerInfo = customer;
      existingLead.shippingAddress = shippingAddress;
      existingLead.items = checkoutData.items;
      existingLead.subtotal = checkoutData.subtotal;
      existingLead.shippingAmount = checkoutData.shippingAmount;
      existingLead.totalAmount = checkoutData.totalAmount;
      existingLead.currency = checkoutData.currency;
      existingLead.selectedPaymentMethod = selectedPaymentMethod || existingLead.selectedPaymentMethod;
      existingLead.subscribe = subscribe !== undefined ? subscribe : existingLead.subscribe;
      existingLead.lastActivityAt = new Date();
      
      // If payment started, update status
      if (selectedPaymentMethod && selectedPaymentMethod !== 'unknown') {
        existingLead.status = 'payment_started';
      }

      await existingLead.save();
      lead = existingLead;
    } else {
      // Create new lead
      const leadId = await generateLeadId();
      lead = await CheckoutLead.create({
        leadId,
        customerInfo: customer,
        shippingAddress,
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        shippingAmount: checkoutData.shippingAmount,
        totalAmount: checkoutData.totalAmount,
        currency: checkoutData.currency,
        selectedPaymentMethod: selectedPaymentMethod || 'unknown',
        subscribe: subscribe || false,
        status: selectedPaymentMethod ? 'payment_started' : 'started',
        lastActivityAt: new Date(),
      });
    }

    return NextResponse.json({ 
      leadId: lead.leadId, 
      id: lead._id.toString() 
    });
  } catch (error: any) {
    console.error('Checkout Lead Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
