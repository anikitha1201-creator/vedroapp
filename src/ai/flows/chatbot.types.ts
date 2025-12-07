import { z } from "zod";

export const ChatbotInputSchema = z.object({
  message: z.string(),
  fileDataUri: z.string().optional(),
});

export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const LearningPackSchema = z.object({
  simpleSummary: z.string(),
  keyLearningPoints: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  stepByStepExplanation: z.array(z.string()),
  causeAndEffect: z.array(
    z.object({
      cause: z.string(),
      effect: z.string(),
    })
  ),
  quizQuestions: z.array(QuizQuestionSchema),
});

export type LearningPack = z.infer<typeof LearningPackSchema>;

    