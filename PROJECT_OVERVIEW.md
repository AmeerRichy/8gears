# 8Gears – Project Overview

Next.js 14 (App Router) e-commerce store for automotive accessories. MongoDB + Mongoose for data, Stripe + PayPal for payments, Nodemailer for emails.

---

## Tech Stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router, TypeScript) |
| Database    | MongoDB via Mongoose           |
| Payments    | Stripe (redirect), PayPal (popup buttons) |
| Email       | Nodemailer (SMTP)              |
| Styling     | Tailwind CSS                   |
| Auth        | NextAuth (admin only)          |

---

## Environment Variables (`.env.local`)

```
MONGODB_URI            – MongoDB connection string
STRIPE_SECRET_KEY      – Stripe secret key
STRIPE_WEBHOOK_SECRET  – Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS  – Nodemailer SMTP
ADMIN_EMAIL            – Where admin order-alert emails go
NEXT_PUBLIC_SITE_URL   – Full domain (e.g. https://yourdomain.com)
NEXTAUTH_SECRET / NEXTAUTH_URL
```

---

## Folder Structure

```
app/
├── page.tsx                        – Home page
├── layout.tsx                      – Root layout (wraps all pages)
├── globals.css                     – Global styles
│
├── checkout/
│   ├── page.tsx                    – Renders <CheckoutForm />
│   └── success/page.tsx            – Stripe post-payment success page
│                                     Calls /api/payment/stripe/verify,
│                                     clears cart from localStorage
│
├── product/[slug]/page.tsx         – Product detail page
├── category/[slug]/page.tsx        – Category listing page
├── track-order/page.tsx            – Order tracking page
├── contact/page.tsx                – Contact form page
├── admin/                          – Admin dashboard (protected)
│
├── components/
│   ├── sections/
│   │   ├── CheckoutForm.tsx        ← MAIN CHECKOUT LOGIC (see below)
│   │   ├── CheckoutHero.tsx        – Hero banner for checkout
│   │   ├── hero.tsx                – Homepage hero
│   │   ├── LatestProducts.tsx      – Home featured products
│   │   ├── CategoryListing.tsx     – Category page product grid
│   │   └── ProductReviews.tsx      – Product reviews
│   ├── navbar.tsx                  – Top navigation bar
│   ├── footer.tsx                  – Footer
│   ├── cartdrawer.tsx              – Slide-out cart drawer
│   ├── productcard.tsx             – Product card used in listings
│   └── ProductForm.tsx             – Admin: add/edit product form
│
├── context/
│   └── CartContext.tsx             – React context: cart state, addToCart,
│                                     removeFromCart, clearCart, total
│
├── models/
│   ├── Order.ts                    – Mongoose Order schema (orderId,
│   │                                 trackingId, customerInfo,
│   │                                 shippingAddress, items, amounts,
│   │                                 payment, orderStatus, trackingTimeline)
│   ├── Product.ts                  – Mongoose Product schema (variants
│   │                                 with stockQuantity, price, images)
│   ├── Category.ts                 – Mongoose Category schema
│   ├── CheckoutLead.ts             – Tracks partial checkout attempts
│   │                                 (leadId, status, customer snapshot)
│   ├── Subscriber.ts               – Email subscribers
│   └── Review.ts                   – Product reviews
│
├── lib/
│   ├── db/mongodb.ts               – Mongoose connect singleton
│   ├── stripe.ts                   – Stripe client (new Stripe(...))
│   ├── paypal.ts                   – PayPal REST API client helpers
│   ├── utils.ts                    – Shared utility functions
│   ├── checkout/
│   │   ├── buildCheckoutOrderItems.ts  – Fetches products from DB,
│   │   │                                validates stock, builds line items
│   │   ├── idGenerators.ts             – generateOrderId(), generateTrackingId()
│   │   └── constants.ts                – Shipping rates, currency, etc.
│   └── email/
│       └── sendOrderConfirmationEmail.ts  – Sends TWO emails on success:
│                                            1. Customer: order receipt HTML
│                                            2. Admin: new-order alert HTML
│                                            Called by Stripe webhook & PayPal
│                                            capture after payment confirmed
│
└── api/
    ├── auth/[...nextauth]/route.ts  – NextAuth admin login
    │
    ├── payment/
    │   ├── stripe/route.ts          – POST: creates Order in DB → creates
    │   │                              Stripe Checkout Session → returns URL
    │   ├── stripe/verify/route.ts   – POST: verifies session_id after redirect,
    │   │                              returns order data to success page
    │   ├── paypal/create/route.ts   – POST: creates PayPal order, returns id
    │   ├── paypal/capture/route.ts  – POST: captures PayPal payment,
    │   │                              saves order, sends emails
    │   └── test-confirm/route.ts    – POST: simulates paid order (dev only)
    │
    ├── webhooks/
    │   └── stripe/route.ts          – Stripe webhook listener:
    │                                  on checkout.session.completed →
    │                                  marks order paid, reduces stock,
    │                                  sends customer + admin emails
    │
    ├── orders/route.ts              – GET all orders (admin)
    ├── products/route.ts            – GET/POST products
    ├── categories/route.ts          – GET/POST categories
    ├── reviews/route.ts             – POST product review
    ├── subscribers/route.ts         – POST subscribe (newsletter)
    ├── checkout/leads/route.ts      – POST: saves partial checkout as lead
    ├── sendOrderEmail/route.ts      – Legacy simple order email endpoint
    │                                  (older, not used by main flow)
    └── admin/route.ts               – Admin-specific data endpoints
```

---

## Checkout Flow (Step by Step)

### User Journey: 3 steps in `CheckoutForm.tsx`

```
Step 1: personal   → User fills name, email, address, phone
                     → "Proceed to Payment" saves lead to /api/checkout/leads

Step 2: payment    → User picks Stripe (card) or PayPal
                     → PayPal SDK loaded here if PayPal selected

Step 3: confirm    → User reviews info
                     → Clicks "Continue to Stripe" OR PayPal button renders here
```

---

### Stripe Payment Flow

```
1. User clicks "Continue to Stripe"
2. handleStripeCheckout() → POST /api/payment/stripe
3. API: builds items from DB, creates Order (status=pending_payment),
         creates Stripe Checkout Session, returns { url }
4. Browser: window.onbeforeunload = null → window.location.href = url
5. User pays on Stripe's hosted page
6. Stripe redirects to /checkout/success?session_id=...
7. Success page → POST /api/payment/stripe/verify → shows order details
8. Stripe webhook → POST /api/webhooks/stripe
   - Marks order paid, reduces stock, sends customer + admin emails
```

### PayPal Payment Flow

```
1. PayPal SDK buttons render inside confirm step
2. User clicks PayPal button (popup opens)
3. createOrder() → POST /api/payment/paypal/create → returns PayPal order id
4. User approves in popup
5. onApprove() → POST /api/payment/paypal/capture
   - Saves order to DB, marks paid, sends customer + admin emails
6. Success modal shown in-page (no redirect)
```

---

## Email Flow

**File:** `app/lib/email/sendOrderConfirmationEmail.ts`

Called after payment confirmed (webhook for Stripe, capture route for PayPal).

Sends **two emails in parallel**:
- **Customer** → `order.customerInfo.email` — branded HTML with items, totals, tracking link
- **Admin** → `ADMIN_EMAIL` env var — alert email with customer info, ship address, items, total, tracking ID

Subject lines:
- Customer: `Order Confirmed – #8G-XXXXX 🎉`
- Admin: `🛒 New Order: #8G-XXXXX from [Customer Name]`

---

## Order Status Values

`orderStatus`: `pending_payment` → `payment_confirmed` → `processing` → `shipped` → `delivered`

`payment.paymentStatus`: `pending` → `paid` / `failed`

`fulfillmentStatus`: `pending` → `fulfilled`

---

## Key Models: Order Fields

```
orderId          – human-readable e.g. "8G-12345"
trackingId       – e.g. "TRK-ABCDE"
customerInfo     – { name, email, phone }
shippingAddress  – { address, apartment, city, state, zip, country }
items[]          – { productId, variantId, title, color, size, quantity,
                     unitPrice, lineTotal, image }
amounts          – { subtotal, shippingAmount, totalAmount, currency }
payment          – { paymentMethod, paymentStatus, stripeSessionId,
                     paymentProviderId }
orderStatus      – see above
trackingTimeline – array of { status, message, timestamp, updatedBy }
stockReduced     – boolean (set true after stock deducted to prevent double-deduct)
linkedCheckoutLeadId – links back to the lead that created this order
```

---

## Admin Panel

Route: `/admin` — protected by NextAuth session.  
Manages: products, categories, orders, leads, subscribers.  
Key component: `ProductForm.tsx` — full product create/edit with variants, images, stock.

---

## Making Changes (Quick Reference)

| What to change                       | File                                              |
|--------------------------------------|---------------------------------------------------|
| Checkout form UI / steps             | `app/components/sections/CheckoutForm.tsx`        |
| Stripe payment session creation      | `app/api/payment/stripe/route.ts`                 |
| Stripe webhook (post-payment logic)  | `app/api/webhooks/stripe/route.ts`                |
| PayPal order create                  | `app/api/payment/paypal/create/route.ts`          |
| PayPal capture + order save          | `app/api/payment/paypal/capture/route.ts`         |
| Email templates (customer + admin)   | `app/lib/email/sendOrderConfirmationEmail.ts`     |
| Order model / schema                 | `app/models/Order.ts`                             |
| Product model / schema               | `app/models/Product.ts`                           |
| Cart logic                           | `app/context/CartContext.tsx`                     |
| Success page after Stripe            | `app/checkout/success/page.tsx`                   |
| Order tracking page                  | `app/track-order/page.tsx`                        |
| Build order line items from DB       | `app/lib/checkout/buildCheckoutOrderItems.ts`     |
| Generate order/tracking IDs          | `app/lib/checkout/idGenerators.ts`                |
