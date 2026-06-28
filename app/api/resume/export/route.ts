import { NextRequest, NextResponse } from 'next/server';
import { generateTemplate } from '@/lib/templates';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function POST(req: NextRequest) {
  try {
    const { resumeJSON, templateStyle, format } = await req.json();

    if (!resumeJSON || !templateStyle || !format) {
      return NextResponse.json({ error: 'invalid_request', message: 'Missing fields' }, { status: 400 });
    }

    if (format === 'pdf') {
      const html = generateTemplate(resumeJSON, templateStyle);
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdfBuffer = await page.pdf({ 
        format: "A4", 
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
        printBackground: true
      });
      await browser.close();

      return new NextResponse(pdfBuffer as any, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume-${templateStyle}.pdf"`
        }
      });
    }

    if (format === 'docx') {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: resumeJSON.personalInfo.name,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: `${resumeJSON.personalInfo.email} | ${resumeJSON.personalInfo.phone} | ${resumeJSON.personalInfo.location}`,
            }),
            new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: resumeJSON.summary }),
            
            new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
            ...(resumeJSON.experience || []).map((exp: any) => [
              new Paragraph({
                text: `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`,
                heading: HeadingLevel.HEADING_3,
              }),
              ...(exp.achievements || []).map((ach: string) => new Paragraph({
                text: ach,
                bullet: { level: 0 }
              }))
            ]).flat(),
            
            new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
            ...(resumeJSON.education || []).map((edu: any) => new Paragraph({
              text: `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationYear})`
            })),
            
            new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: `Technical: ${(resumeJSON.skills?.technical || []).join(', ')}` }),
            new Paragraph({ text: `Tools: ${(resumeJSON.skills?.tools || []).join(', ')}` }),
            new Paragraph({ text: `Soft Skills: ${(resumeJSON.skills?.soft || []).join(', ')}` })
          ],
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer as any, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="resume-${templateStyle}.docx"`
        }
      });
    }

    return NextResponse.json({ error: 'invalid_format' }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500 });
  }
}
