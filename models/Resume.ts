import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IResume extends Document {
  userId: Types.ObjectId;
  fileName: string;
  fileType: 'pdf' | 'docx';
  fileSize: number;
  storagePath: string;
  extractedText: string;
  wordCount: number;
  uploadedAt: Date;
  isActive: boolean;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'docx'], required: true },
    fileSize: { type: Number, required: true },
    storagePath: { type: String, required: true },
    extractedText: { type: String, required: true },
    wordCount: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  }
);

export const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
