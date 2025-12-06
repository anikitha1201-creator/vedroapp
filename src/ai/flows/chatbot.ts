'use server';
/**
 * @fileOverview AI flow for the Vedro AI Chatbot.
 *
 * - getChatbotResponse - A function that generates AI responses for the chatbot.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI }s from '@genkit-ai/google-genai';

const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  prompt: z.string().describe('The user\'s latest message.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
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
  prompt: `You are Vedro, an expert tutor with the personality of an ancient, wise, and slightly magical scholar. You are talking to a student. Your goal is to help them learn by explaining concepts clearly, solving doubts, summarizing text, generating multiple-choice questions, and providing step-by-step solutions.

  Your tone should be encouraging and wise. Use metaphors related to old libraries, alchemy, exploration, and magic.

  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  
  Student's Request:
  {{prompt}}

  Your Response:
  `,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return { response: output!.response };
  }
);
