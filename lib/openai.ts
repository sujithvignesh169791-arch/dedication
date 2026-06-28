import 'server-only';
import OpenAI from 'openai';

// We are using Google Gemini via AI Studio by default using the OpenAI compatibility layer,
// but falling back to Groq or OpenAI if their keys are provided.
const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.GEMINI_API_KEY 
  ? "https://generativelanguage.googleapis.com/v1beta/openai/" 
  : process.env.GROQ_API_KEY 
    ? "https://api.groq.com/openai/v1" 
    : undefined;

const openai = new OpenAI({ 
  apiKey, 
  baseURL,
  maxRetries: 5, 
  timeout: 60000
});

// Use gemini-1.5-flash by default for Gemini, or llama-3.3-70b-versatile for Groq
export const AI_MODEL = process.env.GEMINI_API_KEY 
  ? "gemini-2.5-flash" 
  : process.env.GROQ_API_KEY 
    ? "llama-3.3-70b-versatile" 
    : "gpt-4o";

export default openai;
