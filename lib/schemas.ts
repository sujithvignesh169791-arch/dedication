import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  strengths: z.array(z.string()).min(1).max(10),
  weaknesses: z.array(z.string()).min(1).max(10),
  missingKeywords: z.array(z.string()),
  skillGaps: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  improvementPlan: z.array(z.object({
    step: z.number(),
    action: z.string(),
    impact: z.enum(["high", "medium", "low"]),
    timeEstimate: z.string()
  })),
  sectionBreakdown: z.object({
    summary: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    formatting: z.number().min(0).max(100)
  }),
  topKeywordsFound: z.array(z.string()),
  recommendedJobTitles: z.array(z.string()),
  estimatedExperienceLevel: z.enum([
    "intern", "junior", "mid", "senior", "lead", "executive"
  ])
});

export const InterviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.enum(["behavioral","technical","situational","culture"]),
  difficulty: z.enum(["easy","medium","hard"]),
  hints: z.array(z.string()).max(10),
  keyConceptsToAddress: z.array(z.string())
});

export const InterviewQuestionsSchema = z.object({
  questions: z.array(InterviewQuestionSchema).min(5).max(15),
  sessionContext: z.object({
    targetRole: z.string(),
    focusAreas: z.array(z.string()),
    estimatedDuration: z.string()
  })
});

export const AnswerScoreSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(["A","B","C","D","F"]),
  feedback: z.string(),
  idealAnswer: z.string(),
  followUpQuestion: z.string(),
  keywordsUsed: z.array(z.string()),
  missedPoints: z.array(z.string()),
  toneAnalysis: z.enum([
    "confident","nervous","vague","strong","excellent"
  ]),
  improvementTip: z.string()
});

export const ResumeJSONSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedIn: z.string().optional(),
    website: z.string().optional()
  }),
  summary: z.string(),
  experience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    current: z.boolean(),
    location: z.string(),
    achievements: z.array(z.string())
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    tools: z.array(z.string())
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationYear: z.string(),
    gpa: z.string().optional()
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string()
  })).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string())
  })).optional()
});

export const RebuildResponseSchema = z.object({
  rebuiltResume: ResumeJSONSchema,
  analysisImprovements: z.array(z.string())
});
