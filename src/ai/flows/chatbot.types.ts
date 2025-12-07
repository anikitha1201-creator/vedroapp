import { z } from 'zod';

export const ChatbotInputSchema = z.object({
  message: z.string().describe('The user message or topic to learn about.'),
  fileDataUri: z.string().optional().describe('Optional file content as a data URI.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 answer options.'),
  correctAnswer: z.string().describe('The correct answer, which must exactly match one of the options.'),
});

export const LearningPackSchema = z.object({
  simpleSummary: z.string().describe('A concise summary of the topic.'),
  keyLearningPoints: z.array(z.string()).describe('A list of 3-5 key learning points.'),
  stepByStepExplanation: z.array(z.string()).describe('A list of 3-6 steps explaining the concept.'),
  causeEffectInfo: z.string().describe('A short paragraph on a cause and effect relationship related to the topic.'),
  miniQuiz: z.array(QuizQuestionSchema).length(3).describe('A list of 3 quiz questions.'),
});
export type LearningPack = z.infer<typeof LearningPackSchema>;

export const SimpleReplySchema = z.object({
    reply: z.string().describe("A simple text-based reply for greetings or non-topic inputs.")
});
export type SimpleReply = z.infer<typeof SimpleReplySchema>;


// A discriminated union to handle different types of AI output
export const ChatbotOutputSchema = z.union([
    z.object({
        type: z.literal('learningPack'),
        data: LearningPackSchema,
    }),
    z.object({
        type: z.literal('simpleReply'),
        data: SimpleReplySchema,
    }),
]);
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;
