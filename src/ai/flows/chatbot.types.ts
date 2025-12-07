/**
 * @fileOverview Type definitions for the Vedro AI Chatbot.
 */
import { z } from 'genkit';

// Input for the chatbot flow
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

// Schema for a single quiz question
export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
});

// Schema for the main educational content pack
export const LearningPackSchema = z.object({
  simpleSummary: z
    .string()
    .describe(
      'A very simple explanation of the topic in 3-5 sentences, as if teaching a beginner.'
    ),
  keyLearningPoints: z
    .array(
      z.object({
        title: z.string().describe('A short, catchy title for the key idea.'),
        description: z
          .string()
          .describe('A 1-2 sentence explanation of the point.'),
      })
    )
    .min(3)
    .max(5)
    .describe(
      'The most important ideas of the concept, presented as 3-5 distinct points.'
    ),
  stepByStepExplanation: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe(
      'A clear, sequential explanation of the process or logic in 3-6 ordered steps.'
    ),
  causeAndEffect: z
    .array(
      z.object({
        cause: z.string().describe('The cause or action.'),
        effect: z.string().describe('The resulting effect.'),
      })
    )
    .min(2)
    .max(4)
    .describe(
      'A series of 2-4 cause-and-effect relationships related to the topic.'
    ),
  quizQuestions: z
    .array(QuizQuestionSchema)
    .min(3)
    .max(5)
    .describe('A mini-quiz with 3-5 multiple-choice questions.'),
});
export type LearningPack = z.infer<typeof LearningPackSchema>;

// The output from the chatbot flow is a LearningPack
export const ChatbotOutputSchema = LearningPackSchema;
export type ChatbotOutput = LearningPack;
