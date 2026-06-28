import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/db/connect';
import { Resume } from '@/models/Resume';
import { ActivityHistory } from '@/models/ActivityHistory';
import { extractPdfText, extractDocxText } from '@/lib/extract';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'invalid_file', message: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'invalid_file', message: 'Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'invalid_file', message: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text
    let extractedText = '';
    try {
      if (file.type === 'application/pdf') {
        extractedText = await extractPdfText(buffer);
      } else {
        extractedText = await extractDocxText(buffer);
      }
    } catch (error: any) {
      return NextResponse.json({ error: 'extraction_failed', message: error.message }, { status: 400 });
    }

    // Clean text
    extractedText = extractedText.replace(/\s+/g, ' ').trim();
    const wordCount = extractedText.split(' ').filter(word => word.length > 0).length;

    if (wordCount < 50) {
       return NextResponse.json({ error: 'invalid_file', message: 'Resume text is too short. Could not extract meaningful content.' }, { status: 400 });
    }

    // Storage
    const ext = file.type === 'application/pdf' ? 'pdf' : 'docx';
    const uuid = crypto.randomUUID();
    const userId = token.id as string;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, `${uuid}.${ext}`);
    fs.writeFileSync(filePath, buffer);
    const storagePath = `/uploads/${userId}/${uuid}.${ext}`;

    await connectDB();

    const resume = await Resume.create({
      userId,
      fileName: file.name,
      fileType: ext,
      fileSize: file.size,
      storagePath,
      extractedText,
      wordCount,
    });

    await ActivityHistory.create({
      userId,
      action: 'upload',
      resourceId: resume._id,
      resourceType: 'Resume',
      metadata: { fileName: file.name, ext },
    });

    const extractedTextPreview = extractedText.substring(0, 300);

    return NextResponse.json({
      success: true,
      resumeId: resume._id,
      fileName: file.name,
      wordCount,
      extractedTextPreview,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'server_error', message: 'Internal Server Error' }, { status: 500 });
  }
}
