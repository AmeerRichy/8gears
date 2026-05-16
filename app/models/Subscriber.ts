import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  phone?: string;
  source: 'checkout' | 'footer' | 'popup' | 'manual';
  subscribed: boolean;
  preferences: {
    blogUpdates: boolean;
    productUpdates: boolean;
    offers: boolean;
    phoneNotifications: boolean;
  };
  lastSubscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String },
    phone: { type: String },
    source: {
      type: String,
      enum: ['checkout', 'footer', 'popup', 'manual'],
      default: 'footer',
    },
    subscribed: { type: Boolean, default: true },
    preferences: {
      blogUpdates: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
      phoneNotifications: { type: Boolean, default: false },
    },
    lastSubscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

// Force refresh model to avoid schema caching issues
if (mongoose.models.Subscriber) {
  delete mongoose.models.Subscriber;
}

export default mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
