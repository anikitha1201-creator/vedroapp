'use server';
/**
 * @fileOverview Vedro AI Chatbot Flow
 * This file defines the Genkit flow for Vedro AI, a structured educational assistant.
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
  prompt: `
      You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.

      Your task is to take the user's message and generate a "Learning Pack" about that topic.

      You MUST return the response in the exact JSON format defined by the output schema.

      --- RESPONSE RULES ---
      1.  **NO MARKDOWN**: You MUST NOT use any Markdown formatting. This includes **bold**, *italics*, lists with '*', or '#'. All text should be plain.

      2.  **ACCURACY**: Be accurate and student-friendly.
      
      3.  **TONE**: Keep your tone helpful, clear, and supportive. Focus on helping the student understand.
      ---

      The topic to explain is:
      "{{{message}}}"
      
      {{#if fileDataUri}}
      Use the following document as the primary context for your explanation:
      {{media url=fileDataUri}}
      {{/if}}
    `,
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
        "I'm sorry, I was unable to generate a response for that. Please try another topic."
      );
    }
    return output;
  }
);

/**
 * An asynchronous function that takes a user's topic, sends it to the chatbot flow,
 * and returns a structured learning pack.
 *
 * @param {ChatbotInput} input - The user's topic/message.
 * @returns {Promise<LearningPack>} The structured learning pack.
 */
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
