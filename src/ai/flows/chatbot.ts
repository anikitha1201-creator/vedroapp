'use server';
/**
 * @fileOverview An AI chatbot for students to solve doubts, get explanations, receive summaries, and generate MCQs.
 *
 * - getChatbotResponse - A function that handles the chatbot functionality.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
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
  prompt: `You are Vedro AI, an AI chatbot designed to help students with their learning needs.

  You can solve doubts, provide explanations, generate summaries, and create MCQs based on the user's query.

  If the user asks a question, provide a clear and concise answer.
  If the user asks for an explanation, provide a detailed explanation.
  If the user asks for a summary, provide a comprehensive summary.
  If the user asks for MCQs, generate multiple-choice questions with options and the correct answer.
  
  Keep your tone helpful, clear, and supportive.

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
