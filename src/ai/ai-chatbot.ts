'use server';

/**
 * @fileOverview An AI chatbot for students to solve doubts, get explanations, receive summaries, and generate MCQs.
 *
 * - aiChatbot - A function that handles the chatbot functionality.
 * - AiChatbotInput - The input type for the aiChatbot function.
 * - AiChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotInputSchema = z.object({
  query: z.string().describe('The query from the user.'),
});
export type AiChatbotInput = z.infer<typeof AiChatbotInputSchema>;

const AiChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type AiChatbotOutput = z.infer<typeof AiChatbotOutputSchema>;

export async function aiChatbot(input: AiChatbotInput): Promise<AiChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AiChatbotInputSchema},
  output: {schema: AiChatbotOutputSchema},
  prompt: `You are Vedro AI, an AI chatbot designed to help students with their learning needs.

  You can solve doubts, provide explanations, generate summaries, and create MCQs based on the user's query.

  If the user asks a question, provide a clear and concise answer.
  If the user asks for an explanation, provide a detailed explanation.
  If the user asks for a summary, provide a comprehensive summary.
  If the user asks for MCQs, generate multiple-choice questions with options and the correct answer.

  Query: {{{query}}}`,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AiChatbotInputSchema,
    outputSchema: AiChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
