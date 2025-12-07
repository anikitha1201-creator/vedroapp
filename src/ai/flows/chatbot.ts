'use server';
/**
 * @fileOverview Vedro AI Chatbot Flow
 * This file defines the Genkit flow for Vedro AI, a structured educational assistant.
 */
import { ai } from '@/ai/genkit';
import {
  ChatbotInputSchema,
  ChatbotOutputSchema,
  type ChatbotInput,
  type ChatbotOutput,
  LearningPackSchema,
} from './chatbot.types';

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: LearningPackSchema },
  prompt: `
      You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.

      Your task is to take the user's message and generate a "Learning Pack" about that topic.

      You MUST return the response in the exact JSON format defined by the output schema.

      The topic to explain is:
      "{{{message}}}"
      
      {{#if fileDataUri}}
      Use the following document as the primary context for your explanation:
      {{media url=fileDataUri}}
      {{/if}}

      All 'LearningPack' explanations must follow these rules:
      - Be accurate and student-friendly.
      - Avoid long, complex paragraphs.
      - Use simple English.
      - Never refuse any educational topic.
      - Never go off-topic.
      - Focus on helping the student understand.
      - Keep your tone helpful, clear, and supportive.

      Your role is ONLY education. Never produce entertainment content, jokes, or unrelated information.
    `,
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
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
 * @returns {Promise<ChatbotOutput>} The structured learning pack.
 */
export async function getChatbotResponse(
  input: ChatbotInput
): Promise<ChatbotOutput> {
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
