import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckoutLead extends Document {
  leadId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    productId: mongoose.Types.ObjectId;
    variantId: string;
    sku: string;
    title: string;
    slug: string;
    color: string;
    colorHex?: string;
    size: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    image: string;
  }>;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  selectedPaymentMethod: 'Stripe' | 'PayPal' | 'COD' | 'unknown';
  status: 'started' | 'payment_started' | 'paid' | 'abandoned' | 'recovered';
  linkedOrderId?: string;
  stripeSessionId?: string;
  paypalOrderId?: string;
  source: string;
  subscribe: boolean;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CheckoutLeadSchema: Schema = new Schema(
  {
    leadId: { type: String, required: true, unique: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: String, required: true },
        sku: { type: String, required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        color: { type: String, required: true },
        colorHex: { type: String },
        size: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    selectedPaymentMethod: {
      type: String,
      enum: ['Stripe', 'PayPal', 'COD', 'unknown'],
      default: 'unknown',
    },
    status: {
      type: String,
      enum: ['started', 'payment_started', 'paid', 'abandoned', 'recovered'],
      default: 'started',
    },
    linkedOrderId: { type: String },
    stripeSessionId: { type: String },
    paypalOrderId: { type: String },
    source: { type: String, default: 'checkout' },
    subscribe: { type: Boolean, default: false },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Force refresh model to avoid schema caching issues
if (mongoose.models.CheckoutLead) {
  delete mongoose.models.CheckoutLead;
}

export default mongoose.models.CheckoutLead ||
  mongoose.model<ICheckoutLead>('CheckoutLead', CheckoutLeadSchema);
