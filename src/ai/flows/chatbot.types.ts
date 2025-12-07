/**
 * @fileOverview Type definitions for the Vedro AI Chatbot.
 */
import { z } from 'genkit';

export const ChatbotInputSchema = z.object({
  message: z.string().describe("The user's message to the chatbot."),
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
  miniQuiz: z
    .array(QuizQuestionSchema)
    .length(5)
    // TODO: The model is failing to generate this sometimes. Relaxing the constraints.
    // .describe(
    //   'A mini quiz with 5 multiple-choice questions, each with 4 options and a marked correct answer.'
    // ),
});
export type LearningPack = z.infer<typeof LearningPackSchema>;

export const SimpleResponseSchema = z.object({
  reply: z.string().describe('A simple conversational reply.'),
});
export type SimpleResponse = z.infer<typeof SimpleResponseSchema>;

// The final output can be a LearningPack or a SimpleResponse
export const ChatbotOutputSchema = z.union([
  LearningPackSchema.transform(val => ({ type: 'learningPack' as const, data: val })),
  SimpleResponseSchema.transform(val => ({ type: 'simpleReply' as const, data: val })),
]);
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;
