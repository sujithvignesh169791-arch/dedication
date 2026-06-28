import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IResumeAnalysis extends Document {
  resumeId: Types.ObjectId;
  userId: Types.ObjectId;
  targetRole: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  skillGaps: string[];
  formattingIssues: string[];
  improvementPlan: Array<{
    step: number;
    action: string;
    impact: 'high' | 'medium' | 'low';
    timeEstimate: string;
  }>;
  sectionBreakdown: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
  };
  topKeywordsFound: string[];
  recommendedJobTitles: string[];
  estimatedExperienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  createdAt: Date;
}

const ResumeAnalysisSchema: Schema = new Schema(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    skillGaps: [{ type: String }],
    formattingIssues: [{ type: String }],
    improvementPlan: [
      {
        step: { type: Number },
        action: { type: String },
        impact: { type: String, enum: ['high', 'medium', 'low'] },
        timeEstimate: { type: String },
      }
    ],
    sectionBreakdown: {
      summary: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    topKeywordsFound: [{ type: String }],
    recommendedJobTitles: [{ type: String }],
    estimatedExperienceLevel: { type: String, enum: ['intern', 'junior', 'mid', 'senior', 'lead', 'executive'], required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ResumeAnalysis: Model<IResumeAnalysis> = mongoose.models.ResumeAnalysis || mongoose.model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);
