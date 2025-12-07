'use server';
/**
 * @fileOverview AI flow for the Vedro AI Chatbot.
 *
 * - getChatbotResponse - A function that generates AI responses for the chatbot.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ChatbotInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  prompt: z.string().describe("The user's latest message or topic."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
});

const ChatbotOutputSchema = z.object({
  simpleSummary: z.string().describe('A 5-6 line simple explanation of the topic.'),
  keyLearningPoints: z.array(z.string()).describe('4-6 bullet points of the most important ideas.'),
  stepByStepExplanation: z.array(z.string()).describe('3-8 ordered steps explaining the process or logic.'),
  causeEffect: z.string().describe('Description of how different factors affect the topic.'),
  miniQuiz: z.array(QuizQuestionSchema).describe('5 simple multiple-choice questions with 4 options each, and the correct answer.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

// We create a union type to allow either the structured learning pack or a simple string.
const ChatbotResponseSchema = z.union([ChatbotOutputSchema, z.string()]);


export async function getChatbotResponse(
  input: ChatbotInput
): Promise<any> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are Vedro AI — an educational learning assistant designed to teach any concept clearly and simply.
Your job is to explain any topic the student asks in a way that students aged 10 to 22 can easily understand.

When the user gives a topic, you MUST return one structured learning pack in the exact format defined in the output schema.

All explanations must follow these rules:
- Be accurate and student-friendly
- Avoid long complex paragraphs
- Use simple English
- Never refuse any educational topic
- Never go off-topic
- Focus on helping the student understand
- Keep tone helpful, clear, and supportive

Your role is ONLY education. Never produce entertainment content, jokes, or unrelated information. Stay fully academic.

The student has requested information on the following topic:
"{{prompt}}"

Generate a complete learning pack based on this topic.
  `,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    // The flow can now output either the structured object or a simple string.
    outputSchema: ChatbotResponseSchema,
  },
  async (input) => {
    // Check if the prompt is a simple greeting or off-topic, and handle it gracefully
    const lowerCasePrompt = input.prompt.toLowerCase().trim();
    const isGreeting = ['hi', 'hello', 'hey'].includes(lowerCasePrompt);
    const isGeneric = ['how are you?', 'who are you?', 'what can you do?', 'what is this?'].includes(lowerCasePrompt);

    if (isGreeting || isGeneric) {
      // Return a simple string response directly, which fits the updated output schema.
      return "Greetings, seeker of knowledge. I am Vedro. Ask me about any educational topic, and I shall provide a structured learning pack to illuminate your path.";
    }

    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The wise scholar is pondering... but couldn't formulate a response. Please try rephrasing your topic.");
    }
    return output;
  }
);
