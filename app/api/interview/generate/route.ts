import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/db/connect';
import { Resume } from '@/models/Resume';
import { InterviewSession } from '@/models/InterviewSession';
import openai, { AI_MODEL } from '@/lib/openai';
import { InterviewQuestionsSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    const { resumeId, targetRole, difficulty, questionCount = 10 } = await req.json();

    if (!resumeId || !targetRole || !difficulty) {
      return NextResponse.json({ error: 'invalid_request', message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const resume = await Resume.findById(resumeId);

    if (!resume || resume.userId.toString() !== token.id) {
      return NextResponse.json({ error: 'not_found', message: 'Resume not found' }, { status: 404 });
    }

    const systemPrompt = `You are a senior HR interviewer and technical recruiter at a top tech company. Generate exactly ${questionCount} interview questions for a ${targetRole} candidate. Base questions on their actual resume content.
Mix categories: 40% behavioral, 30% technical/role-specific, 20% situational, 10% culture fit.
Return ONLY valid JSON — no markdown. CRITICAL: Ensure the JSON structure is complete, properly closed, and valid! Do not stop halfway.
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "category": "behavioral|technical|situational|culture",
      "difficulty": "easy|medium|hard",
      "hints": ["hint1", "hint2"],
      "keyConceptsToAddress": ["concept1", "concept2"]
    }
  ],
  "sessionContext": {
    "targetRole": "...",
    "focusAreas": ["area1", "area2"],
    "estimatedDuration": "45-60 minutes"
  }
}`;

    const resumeContext = resume.extractedText.substring(0, 2000);
    const userMessage = `Target Role: ${targetRole}\nDifficulty: ${difficulty}\nResume Summary: ${resumeContext}`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      response_format: { type: 'json_object' },
      max_tokens: 8192,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    const validated = InterviewQuestionsSchema.parse(parsed);

    const session = await InterviewSession.create({
      userId: token.id,
      resumeId: resume._id,
      targetRole,
      difficulty,
      questionsCount: validated.questions.length,
      status: 'active'
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: session._id, 
      questions: validated.questions, 
      sessionContext: validated.sessionContext 
    });
  } catch (error: any) {
    console.error('Generate questions error:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return NextResponse.json({ error: 'rate_limit', message: 'AI Rate Limit Exceeded. Please wait 1 minute before trying again.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'server_error', message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
