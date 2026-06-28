import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/db/connect';
import { User } from '@/models/User';
import { Resume } from '@/models/Resume';
import openai, { AI_MODEL } from '@/lib/openai';
import { RebuildResponseSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(token.id);
    if (!user || !user.isPremium) {
      return NextResponse.json({ error: "premium_required", upgradeUrl: "/premium" }, { status: 403 });
    }

    const { resumeId, targetRole, templateStyle, jobDescription = "" } = await req.json();

    if (!resumeId || !targetRole) {
      return NextResponse.json({ error: 'invalid_request', message: 'Missing required fields' }, { status: 400 });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume || resume.userId.toString() !== token.id) {
      return NextResponse.json({ error: 'not_found', message: 'Resume not found' }, { status: 404 });
    }

    const systemPrompt = `You are a professional resume writer and ATS optimization expert.
Rewrite the provided resume into a powerful, ATS-optimized version targeting the specified role. Rules:
- Every bullet point must start with a strong action verb
- Quantify ALL achievements (add realistic estimates if none given)
- Include industry-specific keywords for the target role
- Remove weak phrases: "responsible for", "helped with", "worked on"
- Summary must be 3-4 sentences, keyword-rich, role-specific
- Skills section must list 15-20 relevant technical skills
- Return ONLY valid JSON matching this exact structure:
{
  "rebuiltResume": { /* the complete ResumeJSON object */ },
  "analysisImprovements": ["Specific improvement 1", "Specific improvement 2"]
}
`;

    const userMessage = `Target Role: ${targetRole}\nJob Description (if provided): ${jobDescription}\nOriginal Resume:\n${resume.extractedText}`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      response_format: { type: 'json_object' },
      max_tokens: 8192,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    const validated = RebuildResponseSchema.parse(parsed);

    return NextResponse.json({ 
      success: true, 
      rebuiltResume: validated.rebuiltResume, 
      analysisImprovements: validated.analysisImprovements 
    });
  } catch (error: any) {
    console.error('Rebuild resume error:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return NextResponse.json({ error: 'rate_limit', message: 'AI Rate Limit Exceeded. Please wait 1 minute before trying again.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'server_error', message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
