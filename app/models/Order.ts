import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: string;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    variantId: string;
    title: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  paymentMethod: 'Stripe' | 'PayPal';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId: string;
  orderStatus: 'received' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingTimeline: Array<{
    status: string;
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: String, required: true },
        title: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Stripe', 'PayPal'], required: true },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending' 
    },
    paymentId: { type: String },
    orderStatus: { 
      type: String, 
      enum: ['received', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'received' 
    },
    trackingTimeline: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
