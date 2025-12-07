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
You are Vedro AI — an educational assistant powered by Google Gemini.
Your job is to generate a structured Learning Pack for any academic topic.

IMPORTANT RULES:
1. DO NOT output JSON. Genkit will map your output into fields.
2. DO NOT use markdown: no **bold**, no *, no #.
3. Always fill ALL fields clearly unless it is a greeting.
4. Be concise, friendly, accurate, and student-friendly.

GREETING RULE:
If the user message is a greeting such as:
hi, hello, hey, what's up, good morning, good afternoon
then:
- simpleSummary = a friendly greeting like:
  "Hi! What would you like to learn today?"
- keyLearningPoints = []
- stepByStepExplanation = []
- causeAndEffect = []
- quizQuestions = []
and STOP.

LEARNING PACK RULES:
When the student asks ANY academic topic:
Fill these fields:

simpleSummary:
  Explain the topic in 3–5 sentences.

keyLearningPoints:
  Provide 3–5 important points.
  Each point needs:
    title: short 2–4 word label
    description: 1–2 sentence explanation.

stepByStepExplanation:
  Provide 3–6 short steps explaining the topic in logical order.

causeAndEffect:
  Give 2–4 pairs:
    cause: explanation of why something happens
    effect: the result

quizQuestions:
  Provide 3–5 MCQs.
  Each must include:
    question
    4 options (A, B, C, D)
    correctAnswer (must match one option exactly)

Now generate the Learning Pack for:
"{{{message}}}"

{{#if fileDataUri}}
Use this document to support your explanation:
{{media url=fileDataUri}}
{{/if}}
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
