import { z } from 'genkit';

export const ChatbotInputSchema = z.object({
  message: z.string().describe("The user's message to the chatbot."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const ChatbotOutputSchema = z.object({
  response: z.string().describe("The AI's response, formatted as Markdown."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;
