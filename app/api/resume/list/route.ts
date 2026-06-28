import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/db/connect';
import { Resume } from '@/models/Resume';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(token.id as string);

    const resumes = await Resume.aggregate([
      { $match: { userId, isActive: true } },
      { $sort: { uploadedAt: -1 } },
      {
        $lookup: {
          from: 'resumeanalyses',
          let: { rId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$resumeId', '$$rId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { score: 1, targetRole: 1 } }
          ],
          as: 'latestAnalysis'
        }
      },
      {
        $addFields: {
          latestAnalysis: { $arrayElemAt: ['$latestAnalysis', 0] }
        }
      }
    ]);

    return NextResponse.json({ success: true, resumes });
  } catch (error: any) {
    console.error('List resumes error:', error);
    return NextResponse.json({ error: 'server_error', message: 'Internal Server Error' }, { status: 500 });
  }
}
