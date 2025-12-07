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

      Your task is to take the user's message and generate a "Learning Pack" about that topic.
      
      You are connected to a system that will map your output into a structured LearningPack object.
      Do NOT output JSON. Instead, directly write the content for each part of the Learning Pack
      (summary, key points, steps, cause-and-effect, quiz questions) so it can be filled into the schema.

      --- RESPONSE RULES ---
      1.  NO MARKDOWN: Do not use bold, italics, lists with '*', or '#'. All text should be plain.
      2.  ACCURACY: Be accurate and student-friendly.
      3.  TONE: Keep your tone helpful, clear, and supportive. Focus on helping the student understand.
      ---

      The topic to explain is:
      "{{{message}}}"
      
      {{#if fileDataUri}}
      Use the following document as the primary context for your explanation:
      {{media url=fileDataUri}}
      {{/if}}
    `,
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: LearningPackSchema,
  },
  async input => {
    // Handle simple greetings separately
    const message = input.message.toLowerCase().trim();
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.includes(message)) {
      return {
        simpleSummary: "Hi! What would you like to learn about today?",
        keyLearningPoints: [],
        stepByStepExplanation: [],
        causeEffectInfo: '',
        miniQuiz: [],
      };
    }

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
 * @returns {Promise<LearningPack>} The structured learning pack.
 */
export async function getChatbotResponse(
  input: ChatbotInput
): Promise<LearningPack> {
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
