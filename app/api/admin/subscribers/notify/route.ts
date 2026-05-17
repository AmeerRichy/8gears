import nodemailer from "nodemailer";
import connectDB from '@/lib/db/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, sendToAll, templateType, subject, message, product, discountCode, buttonText } = body;

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: "Message content is required" }), { status: 400 });
    }

    if (!sendToAll && !email) {
      return new Response(JSON.stringify({ success: false, error: "Email is required for single notification" }), { status: 400 });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
      console.warn("SMTP_HOST or SMTP_PORT is not defined. Email will not be sent.");
      return new Response(JSON.stringify({ success: false, error: "SMTP credentials not configured in environment variables" }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // false for TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let recipients: string[] = [];
    if (sendToAll) {
      await connectDB();
      const subscribers = await Subscriber.find({ subscribed: true }, 'email');
      recipients = subscribers.map(s => s.email);
    } else {
      recipients = [email];
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No active subscribers found" }), { status: 404 });
    }

    const renderHtml = () => {
      let heroSection = '';
      if (product && product.image) {
        heroSection = `
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${product.image}" alt="${product.title}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);" />
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 900; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">${product.title}</h2>
          </div>
        `;
      }

      let discountSection = '';
      if (templateType === 'discount' && discountCode) {
        discountSection = `
          <div style="background-color: #fff7ed; border: 2px dashed #fdba74; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #c2410c; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Use Code at Checkout</p>
            <div style="font-family: monospace; font-size: 28px; font-weight: 900; color: #ea580c; letter-spacing: 4px;">${discountCode}</div>
          </div>
        `;
      }

      let buttonSection = '';
      if (buttonText) {
        const link = product?.url || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        buttonSection = `
          <div style="text-align: center; margin-top: 32px;">
            <a href="${link}" style="display: inline-block; background-color: #f97316; color: #ffffff; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">${buttonText}</a>
          </div>
        `;
      }

      return `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <div style="background-color: #0f172a; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">8 GEARS</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px; color: #334155;">
              ${heroSection}
              
              <div style="font-size: 16px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${message}</div>
              
              ${discountSection}
              ${buttonSection}
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 24px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                You are receiving this email because you subscribed to updates from 8 GEARS.<br/>
                If you wish to unsubscribe, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `;
    };

    const finalHtml = renderHtml();

    const mailPromises = recipients.map(recipientEmail => {
      const mailOptions = {
        from: `"8 GEARS" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: subject || "Update from 8 GEARS",
        html: finalHtml,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(mailPromises);

    return new Response(JSON.stringify({ success: true, count: recipients.length }), { status: 200 });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Email sending failed" }), { status: 500 });
  }
}
