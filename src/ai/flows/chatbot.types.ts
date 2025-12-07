/**
 * @fileOverview Type definitions for the Vedro AI Chatbot.
 */
import { z } from 'genkit';

export const ChatbotInputSchema = z.object({
  message: z.string().describe("The user's message to the chatbot."),
  fileDataUri: z
    .string()
    .optional()
    .describe(
      "A file provided by the user as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
});

export const LearningPackSchema = z.object({
  simpleSummary: z
    .string()
    .describe(
      'A very simple explanation of the topic in 5-6 lines, as if teaching a beginner.'
    ),
  keyLearningPoints: z
    .array(z.string())
    .min(4)
    .max(6)
    .describe(
      'The most important ideas of the concept, presented as 4-6 bullet points.'
    ),
  stepByStepExplanation: z
    .array(z.string())
    .min(3)
    .max(8)
    .describe(
      'A clear, sequential explanation of the process or logic in 3-8 ordered steps.'
    ),
  causeEffectInfo: z
    .string()
    .describe('A description of how different factors affect the topic.'),
  miniQuiz: z.array(QuizQuestionSchema).length(5),
});
export type LearningPack = z.infer<typeof LearningPackSchema>;

// The output is now just a LearningPack
export const ChatbotOutputSchema = LearningPackSchema;
export type ChatbotOutput = LearningPack;
