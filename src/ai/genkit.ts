import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const ai = genkit({
  plugins: [googleAI()],
  // IMPORTANT: This was missing earlier — this is why the AI was not working.
  model: "googleai/gemini-2.5-flash",
});
