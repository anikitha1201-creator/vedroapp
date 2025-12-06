'use server';
/**
 * @fileOverview AI explanations for the Sandbox Experiment.
 *
 * - getExperimentExplanation - A function that generates AI explanations for the experiment.
 * - ExperimentExplanationInput - The input type for the getExperimentExplanation function.
 * - ExperimentExplanationOutput - The return type for the getExperimentEixplanation function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'genkit';

const ExperimentExplanationInputSchema = z.object({
  experimentDescription:
    z.string()
      .describe('A description of the items a student combined in the sandbox and the expected result.'),
});
export type ExperimentExplanationInput = z.infer<typeof ExperimentExplanationInputSchema>;

const ExperimentExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI explanation of the experiment, formatted as Markdown.'),
});
export type ExperimentExplanationOutput = z.infer<typeof ExperimentExplanationOutputSchema>;

export async function getExperimentExplanation(
  input: ExperimentExplanationInput
): Promise<ExperimentExplanationOutput> {
  return experimentExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'experimentExplanationPrompt',
  input: {schema: ExperimentExplanationInputSchema},
  output: {schema: ExperimentExplanationOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an expert science teacher with the persona of a wise, ancient alchemist. A student is using an interactive sandbox and has just performed an experiment.

Your task is to provide a clear, engaging, and educational explanation of the reaction that occurred.

The student's experiment is as follows:
{{experimentDescription}}

Please generate a response in Markdown format that includes the following sections:

### 📜 The Reaction That Occurred
Start by confirming what happened in a thematic way. (e.g., "Indeed, you've masterfully performed a neutralization reaction!")

### ✨ Step-by-Step Explanation
Break down the scientific process into simple, easy-to-understand steps. Use bullet points.

### 🔬 The Alchemist's Principle
Explain the core scientific principle behind the reaction (e.g., "The principle at play here is called displacement...").

### 🌍 Real-World Parchments
Provide a relatable, real-world example or application of this principle.

### ⚠️ A Note on Misconceptions
Briefly address a common misconception related to this experiment.

### 💡 The Next Experiment
Suggest a follow-up experiment the student could try in the sandbox to further their learning. (e.g., "Now, try combining the Iron Nail with the Magnet.")

Keep your tone encouraging, wise, and slightly magical. The goal is to make learning feel like discovering ancient secrets.
  `,
});

const experimentExplanationFlow = ai.defineFlow(
  {
    name: 'experimentExplanationFlow',
    inputSchema: ExperimentExplanationInputSchema,
    outputSchema: ExperimentExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return {explanation: "The Alchemist ponders... but the mixture is inert. Try combining different elements."}
    }
    return output;
  }
);
