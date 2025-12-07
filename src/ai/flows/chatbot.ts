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
You are Vedro AI, a friendly educational assistant powered by Google Gemini.
Generate a Learning Pack that matches the output schema. 
Do NOT output JSON or Markdown. Write plain text only.

------------------------------
GREETING RULE
------------------------------
If the message is a greeting (hi, hello, hey, good morning):
simpleSummary: "Hi! What would you like to learn today?"
keyLearningPoints: []
stepByStepExplanation: []
causeAndEffect: []
quizQuestions: []
Stop after returning this.

------------------------------
LEARNING PACK RULES
------------------------------

simpleSummary:
A short 3–5 sentence explanation of the topic.

keyLearningPoints:
3–5 key ideas.
Each item must have:
- title: short phrase
- description: 1–2 sentence explanation.

stepByStepExplanation:
3–6 short steps.

causeAndEffect:
2–4 items.
Each item must have:
- cause: why something happens
- effect: what the result is.

quizQuestions:
3–5 MCQs.
Each item must have:
- question
- options (4 choices)
- correctAnswer (must exactly match one option)

------------------------------
TOPIC
------------------------------
The topic is: "{{{message}}}"

If a document is provided, use it as context.
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
    throw new Error(
      "The Vedro AI is currently busy. Please try again in a moment."
    );
  }
}
