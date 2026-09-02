import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'super_admin' | 'user';
  customRoleName: string;
  allowedPages: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['super_admin', 'user'], default: 'user' },
    customRoleName: { type: String, default: '', trim: true },
    allowedPages: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
