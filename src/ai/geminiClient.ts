'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY!;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}

// You can change this later if needed, but keep it valid for v1:
export const MODEL_ID = 'gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_ID });

export async function runGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (err: any) {
    console.error('Gemini error:', err);
    // Return a safe fallback message instead of crashing
    return 'The AI library is currently busy or unavailable. Please try again in a little while.';
  }
}
