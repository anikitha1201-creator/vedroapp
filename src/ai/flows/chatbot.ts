'use server';

import { ai } from "@/ai/genkit";
import {
  ChatbotInputSchema,
  LearningPackSchema,
  type ChatbotInput,
  type LearningPack,
} from "./chatbot.types";

/**
 * Main Prompt — Clean, Error-Proof, No JSON, No Markdown
 */
const chatbotPrompt = ai.definePrompt({
  name: "chatbotPrompt",
  input: { schema: ChatbotInputSchema },
  output: { schema: LearningPackSchema },

  prompt: `
You are Vedro AI, an educational assistant powered by Google Gemini.
Your job is to fill the LearningPack fields EXACTLY as listed below.
Do NOT output JSON. Do NOT output markdown. Use plain text only.
Always return ALL fields unless it is a greeting.

------------------------------------
GREETING RULE
------------------------------------
If the message is a greeting (hi, hello, hey, good morning, good afternoon):
simpleSummary: Hi! What would you like to learn today?
keyLearningPoints:
stepByStepExplanation:
causeAndEffect:
quizQuestions:
Stop here.

------------------------------------
LEARNING PACK FORMAT (STRICT)
------------------------------------
You MUST return the answer in this EXACT structure:

simpleSummary: <3–5 sentence explanation>

keyLearningPoints:
- title: <short phrase>
  description: <1–2 sentences>
- title: <short phrase>
  description: <1–2 sentences>
- title: <short phrase>
  description: <1–2 sentences>

stepByStepExplanation:
- <short step>
- <short step>
- <short step>

causeAndEffect:
- cause: <text>
  effect: <text>
- cause: <text>
  effect: <text>

quizQuestions:
- question: <text>
  options: [A, B, C, D]
  correctAnswer: <must match exactly one of the options>

------------------------------------
TOPIC
------------------------------------
The topic is: "{{{message}}}"

If a document is provided, use it as additional context.
`,
});

/**
 * Chatbot Flow
 */
export const chatbotFlow = ai.defineFlow(
  {
    name: "chatbotFlow",
    inputSchema: ChatbotInputSchema,
    outputSchema: LearningPackSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);

    if (!output) {
      throw new Error(
        "The Vedro AI is currently busy. Please try again in a moment."
      );
    }

    return output;
  }
);

/**
 * Main handler for frontend
 */
export async function getChatbotResponse(
  input: ChatbotInput
): Promise<LearningPack> {
  try {
    return await chatbotFlow(input);
  } catch (error) {
    console.error("Vedro AI Error:", error);
    // Create a user-friendly error structure that matches the expected schema
    // to prevent the UI from breaking.
    const errorPack: LearningPack = {
      simpleSummary:
        "The Vedro AI is currently pondering... It seems I've hit a snag. Please try your question again in a moment.",
      keyLearningPoints: [],
      stepByStepExplanation: [],
      causeAndEffect: [],
      quizQuestions: [],
    };
    return errorPack;
  }
}
