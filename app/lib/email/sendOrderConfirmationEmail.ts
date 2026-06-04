import nodemailer from 'nodemailer';
import { IOrder } from '@/models/Order';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildEmailHTML(order: IOrder): string {
  const {
    orderId,
    trackingId,
    customerInfo,
    shippingAddress,
    items,
    amounts,
    payment,
  } = order;

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track-order?trackingId=${trackingId}`;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: middle;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.title}" width="60" height="60"
                    style="border-radius: 8px; object-fit: cover; border: 1px solid #eee;" />`
                : ''
            }
            <div>
              <div style="font-weight: 600; color: #1a1a2e; font-size: 14px;">${item.title}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">
                ${item.color} &bull; ${item.size}
              </div>
            </div>
          </div>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #555; font-size: 14px;">
          &times;${item.quantity}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 600; color: #1a1a2e; font-size: 14px;">
          ${amounts.currency} ${item.lineTotal.toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  const methodLabel =
    payment.paymentMethod === 'Stripe'
      ? 'Credit / Debit Card (Stripe)'
      : payment.paymentMethod === 'PayPal'
      ? 'PayPal'
      : payment.paymentMethod;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed – 8Gears</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6fb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6fb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 40px 32px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 2px; margin-bottom: 4px;">
                8GEARS
              </div>
              <div style="font-size: 13px; color: #a0aec0; letter-spacing: 1px; text-transform: uppercase;">
                Premium Automotive Accessories
              </div>
              <div style="margin-top: 24px; width: 56px; height: 56px; background: rgba(255,255,255,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">
                ✅
              </div>
              <h1 style="margin: 12px 0 4px; font-size: 24px; font-weight: 700; color: #ffffff;">
                Order Confirmed!
              </h1>
              <p style="margin: 0; font-size: 15px; color: #a0c4ff;">
                Thanks, ${customerInfo.name.split(' ')[0]}! Your payment was successful.
              </p>
            </td>
          </tr>

          <!-- Order Meta -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 8px;">
                    <div style="background: #f8f9ff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e8eaf6;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8892b0; margin-bottom: 4px;">Order ID</div>
                      <div style="font-size: 16px; font-weight: 700; color: #1a1a2e;">${orderId}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 8px;">
                    <div style="background: #f8f9ff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e8eaf6;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8892b0; margin-bottom: 4px;">Tracking ID</div>
                      <div style="font-size: 16px; font-weight: 700; color: #1a1a2e;">${trackingId}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8892b0; margin-bottom: 12px;">
                Order Items
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #1a1a2e;">
                <thead>
                  <tr>
                    <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #8892b0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                    <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #8892b0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                    <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #8892b0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; color: #555; font-size: 14px;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; color: #555; font-size: 14px;">${amounts.currency} ${amounts.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #555; font-size: 14px;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; color: #555; font-size: 14px;">
                    ${amounts.shippingAmount === 0 ? '<span style="color: #22c55e; font-weight: 600;">FREE</span>' : `${amounts.currency} ${amounts.shippingAmount.toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" /></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #1a1a2e; font-size: 17px; font-weight: 700;">Total</td>
                  <td style="padding: 6px 0; text-align: right; color: #1a1a2e; font-size: 17px; font-weight: 700;">${amounts.currency} ${amounts.totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #8892b0; font-size: 13px;">Payment Method</td>
                  <td style="padding: 4px 0; text-align: right; color: #8892b0; font-size: 13px;">${methodLabel}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8892b0; margin-bottom: 10px;">
                Shipping Address
              </div>
              <div style="background: #f8f9ff; border-radius: 10px; padding: 16px; border: 1px solid #e8eaf6; font-size: 14px; color: #333; line-height: 1.6;">
                <strong>${customerInfo.name}</strong><br/>
                ${shippingAddress.address}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}<br/>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br/>
                ${shippingAddress.country}
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <a href="${trackingUrl}"
                style="display: inline-block; background: linear-gradient(135deg, #1a1a2e, #0f3460); color: #ffffff;
                  text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 15px;
                  font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(15,52,96,0.35);">
                📦 Track Your Order
              </a>
              <p style="margin: 16px 0 0; font-size: 13px; color: #8892b0;">
                Order updates will be sent to <strong>${customerInfo.email}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8f9ff; padding: 24px 40px; text-align: center; border-top: 1px solid #e8eaf6;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #8892b0;">
                Questions? Email us at
                <a href="mailto:${process.env.SMTP_USER}" style="color: #0f3460; text-decoration: none;">${process.env.SMTP_USER}</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #c0c8d8;">
                &copy; ${new Date().getFullYear()} 8Gears. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function buildAdminEmailHTML(order: IOrder): string {
  const { orderId, trackingId, customerInfo, shippingAddress, items, amounts, payment } = order;

  const methodLabel =
    payment.paymentMethod === 'Stripe'
      ? 'Credit / Debit Card (Stripe)'
      : payment.paymentMethod === 'PayPal'
      ? 'PayPal'
      : payment.paymentMethod;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 14px; color: #1a1a2e;">
          ${item.title}<br/>
          <span style="font-size: 12px; color: #888;">${item.color} / ${item.size}</span>
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px; color: #555;">×${item.quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; font-weight: 600; color: #1a1a2e;">
          ${amounts.currency} ${item.lineTotal.toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Order – ${orderId}</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%);padding:32px 40px;text-align:center;">
            <div style="font-size:11px;letter-spacing:2px;color:#a0aec0;text-transform:uppercase;margin-bottom:6px;">8Gears Admin Alert</div>
            <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">🛒 New Order Received!</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#a0c4ff;">Order <strong>${orderId}</strong> just came in.</p>
          </td>
        </tr>

        <!-- Customer Info -->
        <tr>
          <td style="padding:28px 40px 0;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8892b0;margin-bottom:10px;">Customer</div>
            <div style="background:#f8f9ff;border-radius:10px;padding:16px;border:1px solid #e8eaf6;font-size:14px;color:#333;line-height:1.7;">
              <strong>${customerInfo.name}</strong><br/>
              📧 ${customerInfo.email}<br/>
              📞 ${customerInfo.phone || '—'}
            </div>
          </td>
        </tr>

        <!-- Shipping Address -->
        <tr>
          <td style="padding:20px 40px 0;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8892b0;margin-bottom:10px;">Ship To</div>
            <div style="background:#f8f9ff;border-radius:10px;padding:16px;border:1px solid #e8eaf6;font-size:14px;color:#333;line-height:1.7;">
              ${shippingAddress.address}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}<br/>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br/>
              ${shippingAddress.country}
            </div>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:20px 40px 0;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8892b0;margin-bottom:10px;">Items Ordered</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1a1a2e;">
              <thead>
                <tr>
                  <th style="padding:8px;text-align:left;font-size:11px;color:#8892b0;font-weight:600;text-transform:uppercase;">Product</th>
                  <th style="padding:8px;text-align:center;font-size:11px;color:#8892b0;font-weight:600;text-transform:uppercase;">Qty</th>
                  <th style="padding:8px;text-align:right;font-size:11px;color:#8892b0;font-weight:600;text-transform:uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:16px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Subtotal</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#555;">${amounts.currency} ${amounts.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Shipping</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#555;">${amounts.shippingAmount === 0 ? 'FREE' : `${amounts.currency} ${amounts.shippingAmount.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td colspan="2"><hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;"/></td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:16px;font-weight:700;color:#1a1a2e;">Total</td>
                <td style="padding:4px 0;text-align:right;font-size:16px;font-weight:700;color:#1a1a2e;">${amounts.currency} ${amounts.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#8892b0;">Payment</td>
                <td style="padding:4px 0;text-align:right;font-size:13px;color:#8892b0;">${methodLabel}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#8892b0;">Tracking ID</td>
                <td style="padding:4px 0;text-align:right;font-size:13px;color:#1a1a2e;font-weight:600;">${trackingId}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 40px;text-align:center;border-top:1px solid #e8eaf6;margin-top:24px;">
            <p style="margin:0;font-size:12px;color:#c0c8d8;">© ${new Date().getFullYear()} 8Gears Admin Notification — Do not reply to this email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(order: IOrder): Promise<void> {
  const customerHtml = buildEmailHTML(order);
  const adminHtml = buildAdminEmailHTML(order);

  const ADMIN_EMAIL_DEST = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;

  // Send both emails in parallel
  await Promise.all([
    transporter.sendMail({
      from: `"8Gears" <${process.env.SMTP_USER}>`,
      to: order.customerInfo.email,
      subject: `Order Confirmed – ${order.orderId} 🎉`,
      html: customerHtml,
    }),
    transporter.sendMail({
      from: `"8Gears Orders" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL_DEST,
      subject: `🛒 New Order: ${order.orderId} from ${order.customerInfo.name}`,
      html: adminHtml,
    }),
  ]);

  console.log(`[Email] Customer confirmation → ${order.customerInfo.email}`);
  console.log(`[Email] Admin notification → ${ADMIN_EMAIL_DEST} (order ${order.orderId})`);
}
