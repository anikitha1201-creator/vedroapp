'use server';
/**
 * @fileOverview An AI chatbot that acts as a helpful assistant, powered by Gemini.
 *
 * - getChatbotResponse - A function that handles the chatbot functionality.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  prompt: z.string().describe("The user's latest message or topic."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(
  input: ChatbotInput
): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an expert educational assistant, powered by Gemini. Your mission is to help users learn and understand a wide variety of academic subjects.

  Adopt the persona of a helpful, patient, and engaging tutor. When a user asks a question, provide answers that are not only accurate but also clear, well-structured, and easy to comprehend.

  - If a user asks for an explanation, break down complex topics into simple, digestible parts. Use analogies and real-world examples where appropriate.
  - If a user has a problem to solve, guide them through the steps rather than just giving the final answer, unless they ask for it directly.
  - Maintain a creative, encouraging, and slightly formal tone, like a wise scholar.

  Your goal is to make learning an enlightening and enjoyable experience.

  Conversation History:
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}

  User's new query:
  "{{prompt}}"`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        return { response: "I'm sorry, I seem to be at a loss for words. Could you please rephrase your question?" };
    }
    return output;
  }
);
