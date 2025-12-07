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
  prompt: `You are a helpful and creative AI assistant, powered by Gemini. 
  
  Your goal is to provide accurate, helpful, and engaging responses to the user's queries.
  
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
