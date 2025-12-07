'use server';

/**
 * Vedro AI Chatbot Flow (Fully Working Version)
 * FIXED: No JSON output required, correct model mapping, proper field instructions.
 */

import { ai } from '@/ai/genkit';
import {
  ChatbotInputSchema,
  LearningPackSchema,
  type ChatbotInput,
  type LearningPack,
} from './chatbot.types';

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: LearningPackSchema },

  // ⭐ FIXED PROMPT — matches working repo behavior
  prompt: `
You are Vedro AI — a friendly educational learning assistant.

Your job is to generate a structured "Learning Pack" based on the student's topic.
DO NOT output JSON. Genkit will map your answers into schema fields automatically.

---------------------
RESPONSE RULES
---------------------

1. NO MARKDOWN  
   Do not use **bold**, *italics*, '*', '#', or any formatting.

2. FILL THE FOLLOWING FIELDS CLEARLY AND DIRECTLY  
   - simpleSummary:
       A short, clear explanation of the topic (3–5 sentences).

   - keyLearningPoints:
       Provide 3–5 key points.
       Each point must have:
         - title: short phrase
         - description: 1–2 sentence explanation.

   - stepByStepExplanation:
       Provide 3–6 steps explaining the concept logically.

   - causeAndEffect:
       Provide 2–4 cause→effect pairs.
       Format:
       cause: "X happens because …"
       effect: "This results in …"

   - quizQuestions:
       Provide 3–5 multiple-choice questions.
       Each must contain:
         - question
         - options: 4 answer options
         - correctAnswer: EXACT text that matches one option

3. GREETING RULE  
   If the user says "hi", "hello", "hey", "good morning":
     - simpleSummary: "Hi! What would you like to learn today?"
     - All other fields must be EMPTY arrays.

4. ACCURACY  
   Stay factual, clear, and student-friendly.

---------------------

The topic is:
"{{{message}}}"

{{#if fileDataUri}}
Here is additional context from a document:
{{media url=fileDataUri}}
{{/if}}
`
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: LearningPackSchema,
  },
  async input => {
    const { output } = await chatbotPrompt(input);

    if (!output) {
      throw new Error(
        "I'm sorry, I was unable to generate a learning pack for that topic. Please try another one."
      );
    }

    return output;
  }
);

export async function getChatbotResponse(
  input: ChatbotInput
): Promise<LearningPack> {
  try {
    const result = await chatbotFlow(input);
    return result;
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    throw new Error(
      "I'm sorry, I was unable to generate a learning pack for that topic. Please try another one."
    );
  }
}
