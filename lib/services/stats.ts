import connectDB from '@/db/connect';
import { Resume } from '@/models/Resume';
import { ResumeAnalysis } from '@/models/ResumeAnalysis';
import { InterviewSession } from '@/models/InterviewSession';
import { ActivityHistory } from '@/models/ActivityHistory';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function getUserStats(userId: string) {
  await connectDB();
  const uid = new mongoose.Types.ObjectId(userId);

  const [
    user,
    totalResumes,
    totalAnalyses,
    totalInterviews,
    analyses,
    sessions,
    recentActivity,
    resumesList
  ] = await Promise.all([
    User.findById(uid).lean(),
    Resume.countDocuments({ userId: uid }),
    ResumeAnalysis.countDocuments({ userId: uid }),
    InterviewSession.countDocuments({ userId: uid }),
    ResumeAnalysis.find({ userId: uid }).sort({ createdAt: 1 }).populate('resumeId', 'fileName').lean(),
    InterviewSession.find({ userId: uid, status: 'completed' }).sort({ completedAt: 1 }).lean(),
    ActivityHistory.find({ userId: uid }).sort({ createdAt: -1 }).limit(10).lean(),
    Resume.find({ userId: uid }).sort({ createdAt: -1 }).limit(4).lean()
  ]);

  let bestAtsScore = 0;
  let latestAtsScore = 0;
  let firstAtsScore = 0;
  let atsScoreImprovement = 0;
  let skillsIdentified = new Set<string>();
  const atsScoreHistory: any[] = [];

  if (analyses.length > 0) {
    firstAtsScore = analyses[0].score;
    latestAtsScore = analyses[analyses.length - 1].score;
    atsScoreImprovement = latestAtsScore - firstAtsScore;
    
    analyses.forEach((a: any) => {
      if (a.score > bestAtsScore) bestAtsScore = a.score;
      atsScoreHistory.push({
        date: a.createdAt.toISOString(),
        score: a.score,
        resumeName: a.resumeId?.fileName || 'Unknown'
      });
      a.skillGaps?.forEach((sg: string) => skillsIdentified.add(sg));
    });
  }

  let totalSessionScore = 0;
  const interviewScoreHistory: any[] = [];
  sessions.forEach((s: any) => {
    totalSessionScore += (s.totalScore || 0);
    interviewScoreHistory.push({
      date: s.completedAt.toISOString(),
      score: s.totalScore || 0,
      role: s.targetRole
    });
  });

  const averageInterviewScore = sessions.length > 0 ? Math.round(totalSessionScore / sessions.length) : 0;

  return {
    totalResumes,
    totalAnalyses,
    totalInterviews,
    bestAtsScore,
    latestAtsScore,
    atsScoreImprovement,
    averageInterviewScore,
    atsScoreHistory,
    interviewScoreHistory,
    skillsIdentified: Array.from(skillsIdentified),
    recentActivity: JSON.parse(JSON.stringify(recentActivity)),
    recentResumes: JSON.parse(JSON.stringify(resumesList)),
    isPremium: user?.isPremium || false,
    premiumExpiresAt: user?.premiumExpiresAt ? user.premiumExpiresAt.toISOString() : null,
    name: user?.name
  };
}
