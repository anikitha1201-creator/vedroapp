import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY!;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

// You can change this later if needed, but keep it valid for a v1 API.
// "gemini-1.5-flash" is a good, fast, and balanced choice.
export const MODEL_ID = "gemini-1.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig: GenerationConfig = {
    // The model will generate JSON format
    responseMimeType: "application/json",
};

const textModel = genAI.getGenerativeModel({ model: MODEL_ID });
const jsonModel = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig });


/**
 * Runs a prompt against the Gemini API with error handling.
 * @param prompt The text prompt to send to the model.
 * @param asJson If true, instructs the model to return a JSON string.
 * @returns The generated text from the model.
 */
export async function runGemini(prompt: string, asJson: boolean = false): Promise<string> {
  const modelToUse = asJson ? jsonModel : textModel;
  try {
    const result = await modelToUse.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (err: any) {
    console.error("Gemini API error:", err);
    // Instead of crashing, return a safe fallback message that can be handled by the UI.
    // The flows calling this function have their own try/catch blocks to provide more context-specific fallbacks.
    throw new Error("The AI library is currently busy or unavailable. Please try again in a little while.");
  }
}
