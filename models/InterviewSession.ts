import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInterviewSession extends Document {
  userId: Types.ObjectId;
  resumeId: Types.ObjectId;
  targetRole: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalScore?: number;
  questionsCount: number;
  completedAt?: Date;
  status: 'active' | 'completed';
}

const InterviewSessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    targetRole: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    totalScore: { type: Number },
    questionsCount: { type: Number, default: 0 },
    completedAt: { type: Date },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  }
);

export const InterviewSession: Model<IInterviewSession> = mongoose.models.InterviewSession || mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
