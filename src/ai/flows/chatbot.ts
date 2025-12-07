'use server';
/**
 * @fileOverview The main AI-powered chatbot flow for Vedro.
 * This file defines the AI prompt and the Genkit flow that powers the
 * educational chatbot. The data schemas are imported from a separate file
 * to comply with Next.js 'use server' module constraints.
 *
 * - chat - The primary function that processes a user's message.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { LearningPackSchema, type LearningPack } from './schemas';

/**
 * Defines the prompt template that will be sent to the Gemini model.
 * This prompt is carefully structured to guide the AI to produce output
 * that conforms to the `LearningPackSchema`.
 */
const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: z.string() },
  output: { schema: LearningPackSchema },

  prompt: `You are Vedro, an expert educational assistant. Your role is to take a user's query about an educational topic and break it down into a comprehensive and easy-to-digest "Learning Pack."

    **TOPIC:**
    {{{input}}}

    **CRITICAL RULES:**
    1.  **GREETING HANDLING:** If the user's input is a simple greeting (like "hi", "hello", "hey", "good morning", etc.) and not a learning topic, you MUST respond with a friendly greeting. For this case:
        - Set the 'simpleSummary' to a greeting like: "Hi there! What educational topic can I help you explore today?"
        - Set ALL other fields (keyLearningPoints, stepByStepExplanation, causeAndEffect, quizQuestions) to be EMPTY arrays ([]).
        - Do not generate any educational content for a greeting.

    2.  **EDUCATIONAL TOPIC HANDLING:** If the user provides an educational topic, you MUST populate ALL the fields in the Learning Pack. Do not leave any field blank unless the rule above applies.
        - **simpleSummary:** Provide a concise, 3-5 sentence overview of the topic.
        - **keyLearningPoints:** Generate 3-5 distinct, crucial facts or concepts.
        - **stepByStepExplanation:** Create a clear, sequential explanation of a core process, with 3-6 steps.
        - **causeAndEffect:** Identify 2-4 clear cause-and-effect relationships.
        - **quizQuestions:** Create 3-5 multiple-choice questions, each with exactly 4 options and a clearly stated correct answer.

    3.  **ACCURACY:** Ensure all information is factually correct, clear, and suitable for a student.
    4.  **NO MARKDOWN or JSON:** Your output should be plain text only. Do not wrap your response in Markdown or JSON formatting. Genkit will handle the schema mapping.
    `,
});

/**
 * Defines the main Genkit flow for the chatbot.
 * This flow takes the user's string input, invokes the AI prompt,
 * and returns the structured `LearningPack` object.
 */
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.string(),
    outputSchema: LearningPackSchema,
  },
  async (topic) => {
    const { output } = await chatbotPrompt(topic);
    // The 'output' is guaranteed by Genkit to be valid and match the LearningPackSchema.
    // The exclamation mark asserts that output will not be null.
    return output!;
  }
);

/**
 * The primary exported function that serves as the entry point to the chatbot flow.
 * It takes a user's message and returns a promise of a LearningPack.
 *
 * @param {string} userMessage - The message from the user.
 * @returns {Promise<LearningPack>} A promise that resolves to the structured learning pack.
 */
export async function chat(userMessage: string): Promise<LearningPack> {
  return chatbotFlow(userMessage);
}
