'use server';
/**
 * @fileOverview Vedro AI Chatbot Flow
 * This file defines the Genkit flow for Vedro AI, a structured educational assistant.
 */
import { ai } from '@/ai/genkit';
import {
  ChatbotInputSchema,
  LearningPackSchema,
  ChatbotOutputSchema,
  type ChatbotInput,
  type ChatbotOutput,
  type LearningPack,
} from './chatbot.types';

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `
      You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.
      Your job is to explain any topic the student asks in a way that students aged 10 to 22 can easily understand.

      IMPORTANT: Your response format depends on the user's message.
      1. If the user gives a simple greeting (like "hello", "hi", "hey there"), you MUST return a simple, friendly greeting using the 'SimpleResponse' format. For example: { "reply": "Hello there! What would you like to learn about today?" }.
      2. For any other topic or question, you MUST return one structured 'LearningPack' in the exact JSON format defined by the output schema.

      The topic to explain is:
      {{{message}}}

      All explanations must follow these rules:
      - Be accurate and student-friendly.
      - Avoid long, complex paragraphs.
      - Use simple English.
      - Never refuse any educational topic.
      - Never go off-topic.
      - Focus on helping the student understand.
      - Keep your tone helpful, clear, and supportive.

      Your role is ONLY education. Never produce entertainment content, jokes, or unrelated information. Stay fully academic unless providing a simple greeting.
    `,
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
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
 * and returns a structured learning pack or a simple reply.
 *
 * @param {ChatbotInput} input - The user's topic/message.
 * @returns {Promise<ChatbotOutput>} The structured learning pack or simple reply.
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
