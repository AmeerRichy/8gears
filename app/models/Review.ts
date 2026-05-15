import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userName: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userName: { type: String, required: true },
    userLocation: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'approved' },
  },
  { timestamps: true }
);

// Index for faster queries
ReviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
