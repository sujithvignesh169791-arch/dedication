import 'server-only';
import OpenAI from 'openai';

// We are using Google Gemini via AI Studio by default using the OpenAI compatibility layer,
// but falling back to Groq or OpenAI if their keys are provided.
const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "dummy-key-to-prevent-build-crash";
const baseURL = process.env.GEMINI_API_KEY 
  ? "https://generativelanguage.googleapis.com/v1beta/openai/" 
  : process.env.GROQ_API_KEY 
    ? "https://api.groq.com/openai/v1" 
    : undefined;

const customFetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let retries = 3;
  let delay = 10000; // Start with 10 seconds for Gemini's 15 RPM limit
  while (retries > 0) {
    const response = await fetch(url, init);
    if (response.status === 429) {
      console.warn(`[OpenAI Rate Limit] 429 received. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries--;
      delay += 5000; // Increase delay
      continue;
    }
    return response;
  }
  return fetch(url, init);
};

const openai = new OpenAI({ 
  apiKey, 
  baseURL,
  maxRetries: 5, 
  timeout: 60000,
  fetch: customFetch as any
});

// Use gemini-1.5-flash by default for Gemini, or llama-3.3-70b-versatile for Groq
export const AI_MODEL = process.env.GEMINI_API_KEY 
  ? "gemini-2.5-flash" 
  : process.env.GROQ_API_KEY 
    ? "llama-3.3-70b-versatile" 
    : "gpt-4o";

export default openai;
