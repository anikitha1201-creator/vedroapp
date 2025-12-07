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
} from './chatbot.types';

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `
      You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.

      Your first task is to determine the user's intent.
      1. If the user's message is a simple greeting (e.g., "hello", "hi", "how are you"), you MUST respond with a 'SimpleResponse'.
      2. If the user's message is a request to learn about a topic, you MUST respond with a 'LearningPack'.

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

      Your role is ONLY education. For 'LearningPack' responses, never produce entertainment content, jokes, or unrelated information.
      For 'SimpleResponse' replies, keep them brief and welcoming.
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
