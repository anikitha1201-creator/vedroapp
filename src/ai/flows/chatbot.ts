'use server';
/**
 * @fileOverview Vedro AI Chatbot Flow
 * This file defines the Genkit flow for Vedro AI, a structured educational assistant.
 */

import { ai } from '@/ai/genkit';
import { runGemini } from '@/ai/geminiClient';
import {
  ChatbotInputSchema,
  LearningPackSchema,
  type ChatbotInput,
  type LearningPack,
} from './chatbot.types';

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
  const result = await chatbotFlow(input);
  return result;
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: LearningPackSchema,
  },
  async (input) => {
    // This prompt is sent to the Gemini API to generate the structured learning pack.
    // It instructs the AI on its persona, the required output format, and the rules to follow.
    const prompt = `
    You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.
    Your job is to explain any topic the student asks in a way that students aged 10 to 22 can easily understand.

    When the user gives a topic, you MUST return one structured learning pack in the exact JSON format defined by the following schema:
    ${JSON.stringify(LearningPackSchema.jsonSchema)}

    The topic to explain is:
    ${input.message}

    All explanations must follow these rules:
    - Be accurate and student-friendly.
    - Avoid long, complex paragraphs.
    - Use simple English.
    - Never refuse any educational topic.
    - Never go off-topic.
    - Focus on helping the student understand.
    - Keep your tone helpful, clear, and supportive.

    Your role is ONLY education. Never produce entertainment content, jokes, or unrelated information. Stay fully academic.
  `;

    try {
      const responseText = await runGemini(prompt, true); // Request JSON output
      const jsonResponse = JSON.parse(responseText);

      // Validate the response against the schema to ensure it's in the correct format.
      const validation = LearningPackSchema.safeParse(jsonResponse);

      if (!validation.success) {
        console.error('Gemini response validation error:', validation.error);
        throw new Error('AI response did not match the expected format.');
      }
      
      return validation.data;
    } catch (error) {
      console.error("Error in chatbotFlow:", error);
      throw new Error("I'm sorry, I was unable to generate a learning pack for that topic. Please try another one.");
    }
  }
);
