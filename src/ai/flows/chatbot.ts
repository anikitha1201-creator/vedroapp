'use server';

/**
 * @fileOverview Vedro AI Chatbot - Learning Pack Generator
 * This file defines the Genkit flow for generating structured educational content.
 */

import { ai } from '@/ai/genkit';
import {
  ChatbotInputSchema,
  LearningPackSchema,
  type ChatbotInput,
  type LearningPack,
  SimpleReplySchema,
  ChatbotOutputSchema,
} from './chatbot.types';
import { z } from 'zod';

const greetingRegex = /^(hi|hello|hey|good morning|good afternoon|good evening)(\s.|\s!|\s?|)$/i;

const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: z.union([LearningPackSchema, SimpleReplySchema]) },
  prompt: `
You are Vedro AI — a friendly, expert educational assistant.

Your primary job is to generate a structured "LearningPack" for the given topic.
If the user provides a simple greeting (like "hi" or "hello"), you MUST respond with a "SimpleReply" instead.

Do NOT output JSON. Genkit will map your response to the correct schema.

TOPIC:
"{{{message}}}"

{{#if fileDataUri}}
DOCUMENT CONTEXT:
{{media url=fileDataUri}}
{{/if}}

---------------------
RESPONSE INSTRUCTIONS
---------------------

1.  GREETING CHECK:
    - If the message is a simple greeting (e.g., "hi", "hello"), you MUST ONLY fill the 'reply' field in the SimpleReply schema.
    - Example: reply: "Hi! What would you like to learn about today?"

2.  LEARNING PACK GENERATION:
    - If the message is a topic, you MUST fill ALL fields in the LearningPack schema.
    - simpleSummary: A clear, concise summary of the topic (3–5 sentences).
    - keyLearningPoints: Provide 3–5 important points as a list of strings.
    - stepByStepExplanation: Provide 3-6 logical steps to explain the concept.
    - causeEffectInfo: Provide a short paragraph (2-4 sentences) explaining a key cause and effect relationship.
    - miniQuiz: Provide 3 multiple-choice questions. Each question must have:
      - question (string)
      - options (an array of 4 strings)
      - correctAnswer (string that EXACTLY matches one of the options)

3.  FORMATTING:
    - DO NOT use Markdown (no **, *, #, etc.).
    - Write in clear, student-friendly language.
`,
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input): Promise<ChatbotOutput> => {
    // Determine if the input is a simple greeting
    const isGreeting = greetingRegex.test(input.message.trim());

    if (isGreeting) {
      return {
        type: 'simpleReply',
        data: {
          reply: "Hi! What would you like to learn about today? I can help you with topics like 'Photosynthesis' or 'Newton's Laws of Motion'.",
        },
      };
    }
    
    // If not a greeting, proceed with generating the learning pack
    const { output } = await chatbotPrompt(input);

    if (!output) {
      throw new Error(
        "I'm sorry, I was unable to generate a learning pack for that topic. Please try another one."
      );
    }
    
    // Because the prompt can return one of two schemas, we check which one it is.
    if ('simpleSummary' in output) {
        return { type: 'learningPack', data: output };
    }
    
    // This case should technically not be hit if it's not a greeting, but it's a safe fallback.
    return { type: 'simpleReply', data: { reply: "I'm not sure how to respond to that. Please ask me about a topic." } };
  }
);
