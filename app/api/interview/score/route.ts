import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/db/connect';
import { InterviewSession } from '@/models/InterviewSession';
import { InterviewAnswer } from '@/models/InterviewAnswer';
import openai, { AI_MODEL } from '@/lib/openai';
import { AnswerScoreSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, questionId, question, answer, resumeContext, category, timeSpentSeconds } = await req.json();

    if (!sessionId || !question || !answer || !category) {
      return NextResponse.json({ error: 'invalid_request', message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const session = await InterviewSession.findById(sessionId);

    if (!session || session.userId.toString() !== token.id) {
      return NextResponse.json({ error: 'not_found', message: 'Session not found' }, { status: 404 });
    }

    const systemPrompt = `You are an expert interview coach evaluating a candidate's answer.
Score objectively based on: relevance, completeness, use of examples, communication clarity, and keyword usage.
Return ONLY valid JSON:
{
  "score": <0-100>,
  "grade": "A|B|C|D|F",
  "feedback": "<2-3 sentence specific feedback on THIS answer>",
  "idealAnswer": "<what a perfect answer would include>",
  "followUpQuestion": "<a natural follow-up an interviewer would ask>",
  "keywordsUsed": ["<keywords the candidate used well>"],
  "missedPoints": ["<important points the candidate missed>"],
  "toneAnalysis": "confident|nervous|vague|strong|excellent",
  "improvementTip": "<one specific actionable tip>"
}`;

    const safeResumeContext = resumeContext ? resumeContext.substring(0, 500) : "Not provided.";
    const userMessage = `Question: ${question}\nCategory: ${category}\nCandidate Answer: ${answer}\nResume Context: ${safeResumeContext}`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      response_format: { type: 'json_object' },
      max_tokens: 8192,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    const validatedScore = AnswerScoreSchema.parse(parsed);

    const interviewAnswer = await InterviewAnswer.create({
      sessionId: session._id,
      questionId,
      question,
      category,
      userAnswer: answer,
      timeSpentSeconds,
      ...validatedScore
    });

    // Update running average
    const allAnswers = await InterviewAnswer.find({ sessionId: session._id });
    const totalScoreSum = allAnswers.reduce((sum, a) => sum + a.score, 0);
    const newAverage = Math.round(totalScoreSum / allAnswers.length);

    session.totalScore = newAverage;
    
    // Check if finished
    if (allAnswers.length >= session.questionsCount) {
      session.status = 'completed';
      session.completedAt = new Date();
    }
    
    await session.save();

    return NextResponse.json({ 
      success: true, 
      score: validatedScore,
      isComplete: session.status === 'completed',
      totalScore: newAverage
    });
  } catch (error: any) {
    console.error('Score answer error:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return NextResponse.json({ error: 'rate_limit', message: 'AI Rate Limit Exceeded. Please wait 1 minute before trying again.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'server_error', message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
