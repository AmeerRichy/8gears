import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { items, customer, shippingAddress } = await req.json();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: `${item.title} (${item.color} / ${item.size})`,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents/paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: customer.email,
      metadata: {
        customerName: customer.name,
        customerPhone: customer.phone,
        shippingAddress,
        items: JSON.stringify(items.map((i: any) => ({
          productId: i.productId,
          variantId: i.variantId,
          title: i.title,
          color: i.color,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })))
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
