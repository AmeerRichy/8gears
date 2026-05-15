import nodemailer from "nodemailer";

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
  const { customer, items, total }: OrderPayload = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // false for TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const itemsHtml = items
    .map((item) => `<li>${item.name} - ${item.quantity} × Rs. ${item.price}</li>`)
    .join("");

  const buyerMail = {
    from: `"8 GEARS" <${process.env.SMTP_USER}>`,
    to: customer.email,
    subject: "Your Order Confirmation",
    html: `
      <h2>Thank you for your order, ${customer.name}!</h2>
      <ul>${itemsHtml}</ul>
      <p>Total: Rs. ${total}</p>
      <p>Delivery Address: ${customer.address}</p>
      <p>Phone: ${customer.phone}</p>
    `,
  };

  const adminMail = {
    from: `"8 GEARS" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Order Received",
    html: `
      <h2>New Order from ${customer.name}</h2>
      <ul>${itemsHtml}</ul>
      <p>Total: Rs. ${total}</p>
      <p>Address: ${customer.address}</p>
      <p>Phone: ${customer.phone}</p>
    `,
  };

  try {
    await Promise.all([transporter.sendMail(buyerMail), transporter.sendMail(adminMail)]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Email sending failed:", error);
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}
