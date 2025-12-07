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
      Your job is to explain any topic the student asks in a way that students aged 10 to 22 can easily understand.

      When the user gives a topic, you MUST return one structured learning pack in the exact JSON format defined by the following schema:
      ${JSON.stringify(LearningPackSchema.jsonSchema)}

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

      Your role is ONLY education. Never produce entertainment content, jokes, or unrelated information. Stay fully academic.
    `,
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: LearningPackSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);
    if (!output) {
      throw new Error(
        "I'm sorry, I was unable to generate a learning pack for that topic. Please try another one."
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
    return await chatbotFlow(input);
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    throw new Error(
      "I'm sorry, I was unable to generate a learning pack for that topic. Please try another one."
    );
  }
}
