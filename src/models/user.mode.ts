import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  photo?: string; // Optional field for user photo
  planeId?: string; // Optional field for Plane integration
  creditBalance?: number; // Optional field for credit balance
  clerkId?: string; // Optional field for Clerk integration
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: false, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  photo: { type: String, trim: true }, // Optional field for user photo
  planeId: { type: String, unique: true, sparse: true }, // Optional field for Plane integration
  creditBalance: { type: Number, default: 0 }, // Optional field for credit balance

  clerkId: { type: String, unique: true, sparse: true }, // Optional field for Clerk integration
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
