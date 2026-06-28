import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPremiumSubscription extends Document {
  userId: Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: 'monthly' | 'annual';
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PremiumSubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['monthly', 'annual'], required: true },
    status: { type: String, required: true },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PremiumSubscription: Model<IPremiumSubscription> = mongoose.models.PremiumSubscription || mongoose.model<IPremiumSubscription>('PremiumSubscription', PremiumSubscriptionSchema);
