if (typeof global !== 'undefined') {
  if (!global.DOMMatrix) (global as any).DOMMatrix = class DOMMatrix {};
  if (!global.ImageData) (global as any).ImageData = class ImageData {};
  if (!global.Path2D) (global as any).Path2D = class Path2D {};
}

const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export class ExtractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExtractError';
  }
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new ExtractError('Failed to extract text from PDF. The file might be corrupted or password protected.');
  }
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new ExtractError('Failed to extract text from DOCX. The file might be corrupted.');
  }
}
