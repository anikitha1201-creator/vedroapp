/**
 * @fileOverview This file contains the Zod schemas and TypeScript types for the AI flows.
 * Separating schemas into their own file prevents "use server" conflicts in Next.js,
 * as server modules can only export async functions.
 */

import { z } from 'zod';

/**
 * Defines the Zod schema for a single quiz question.
 * The descriptions guide the AI on what content to generate for each field.
 */
export const QuizQuestionSchema = z.object({
  question: z.string().describe('A multiple-choice question to test understanding of a key concept.'),
  options: z.array(z.string()).length(4).describe('Four potential answers to the question (A, B, C, D).'),
  correctAnswer: z.string().describe('The correct answer from the four options provided.'),
});

/**
 * Defines the Zod schema for the entire educational learning pack.
 * This structure is what the AI will populate. The descriptions are critical
 * for guiding the language model's output.
 */
export const LearningPackSchema = z.object({
  simpleSummary: z
    .string()
    .describe(
      'A brief, easy-to-understand summary of the topic, approximately 3-5 sentences long. If the user only provided a greeting, this should be a friendly response like "Hi! What would you like to learn about today?"'
    ),
  keyLearningPoints: z
    .array(
      z.object({
        title: z.string().describe('The concise title of a key concept or fact.'),
        description: z.string().describe('A brief explanation of the key concept.'),
      })
    )
    .describe('An array of 3 to 5 most important takeaways or facts about the topic. This should be an empty array if the user only provided a greeting.'),
  stepByStepExplanation: z
    .array(z.string())
    .describe(
      'A sequence of 3 to 6 steps that break down a core process or concept related to the topic. This should be an empty array if the user only provided a greeting.'
    ),
  causeAndEffect: z
    .array(
      z.object({
        cause: z.string().describe('A cause related to the topic.'),
        effect: z.string().describe('The corresponding effect.'),
      })
    )
    .describe('An array of 2 to 4 cause-and-effect relationships. This should be an empty array if the user only provided a greeting.'),
  quizQuestions: z
    .array(QuizQuestionSchema)
    .describe('An array of 3 to 5 multiple-choice questions to test knowledge. This should be an empty array if the user only provided a greeting.'),
});

// Derives the TypeScript type from the Zod schema.
export type LearningPack = z.infer<typeof LearningPackSchema>;