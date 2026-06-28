import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IActivityHistory extends Document {
  userId: Types.ObjectId;
  action: 'upload' | 'analyze' | 'interview' | 'rebuild' | 'export' | 'payment';
  resourceId: Types.ObjectId;
  resourceType: string;
  metadata?: any;
  createdAt: Date;
}

const ActivityHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['upload', 'analyze', 'interview', 'rebuild', 'export', 'payment'], required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    resourceType: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityHistory: Model<IActivityHistory> = mongoose.models.ActivityHistory || mongoose.model<IActivityHistory>('ActivityHistory', ActivityHistorySchema);
