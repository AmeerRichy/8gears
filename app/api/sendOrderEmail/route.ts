import { MICROSOFT_MAILBOX, sendMicrosoftMail } from '@/lib/email/microsoftGraph';
import { requireAdminApi } from '@/lib/adminAuth';
import { DISPLAY_CURRENCY } from '@/lib/checkout/constants';

interface CartItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface OrderPayload {
  customer: Customer;
  items: CartItem[];
  total: number;
}

export async function POST(req: Request) {
  const auth = await requireAdminApi('/admin/orders');
  if ('error' in auth) return auth.error;
  const { customer, items, total }: OrderPayload = await req.json();

  const itemsHtml = items
    .map((item) => `<li>${item.name} - ${item.quantity} × ${DISPLAY_CURRENCY} ${item.price}</li>`)
    .join("");

  const buyerMail = {
    senderName: '8 GEARS',
    to: customer.email,
    subject: "Your Order Confirmation",
    html: `
      <h2>Thank you for your order, ${customer.name}!</h2>
      <ul>${itemsHtml}</ul>
      <p>Total: ${DISPLAY_CURRENCY} ${total}</p>
      <p>Delivery Address: ${customer.address}</p>
      <p>Phone: ${customer.phone}</p>
    `,
  };

  const adminMail = {
    senderName: '8 GEARS',
    to: process.env.ADMIN_EMAIL || MICROSOFT_MAILBOX,
    subject: "New Order Received",
    html: `
      <h2>New Order from ${customer.name}</h2>
      <ul>${itemsHtml}</ul>
      <p>Total: ${DISPLAY_CURRENCY} ${total}</p>
      <p>Address: ${customer.address}</p>
      <p>Phone: ${customer.phone}</p>
    `,
  };

  try {
    await Promise.all([sendMicrosoftMail(buyerMail), sendMicrosoftMail(adminMail)]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    console.error("Order email sending failed");
    return new Response(JSON.stringify({ success: false, error: "Email sending failed" }), { status: 500 });
  }
}
