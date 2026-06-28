import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInterviewAnswer extends Document {
  sessionId: Types.ObjectId;
  questionId: string;
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'culture';
  userAnswer: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  feedback: string;
  idealAnswer: string;
  followUpQuestion?: string;
  keywordsUsed: string[];
  missedPoints: string[];
  toneAnalysis: 'confident' | 'nervous' | 'vague' | 'strong' | 'excellent';
  improvementTip: string;
  timeSpentSeconds: number;
  answeredAt: Date;
}

const InterviewAnswerSchema: Schema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    category: { type: String, enum: ['behavioral', 'technical', 'situational', 'culture'], required: true },
    userAnswer: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
    feedback: { type: String, required: true },
    idealAnswer: { type: String, required: true },
    followUpQuestion: { type: String },
    keywordsUsed: [{ type: String }],
    missedPoints: [{ type: String }],
    toneAnalysis: { type: String, enum: ['confident', 'nervous', 'vague', 'strong', 'excellent'] },
    improvementTip: { type: String },
    timeSpentSeconds: { type: Number, required: true },
    answeredAt: { type: Date, default: Date.now },
  }
);

export const InterviewAnswer: Model<IInterviewAnswer> = mongoose.models.InterviewAnswer || mongoose.model<IInterviewAnswer>('InterviewAnswer', InterviewAnswerSchema);
