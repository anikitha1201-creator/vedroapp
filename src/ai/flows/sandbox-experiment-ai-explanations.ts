'use server';
/**
 * @fileOverview AI explanations for the Sandbox Experiment.
 *
 * - getExperimentExplanation - A function that generates AI explanations for the experiment.
 * - ExperimentExplanationInput - The input type for the getExperimentExplanation function.
 * - ExperimentExplanationOutput - The return type for the getExperimentExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperimentExplanationInputSchema = z.object({
  experimentDescription:
    z.string()
      .describe('The description of the experiment performed.'),
});
export type ExperimentExplanationInput = z.infer<typeof ExperimentExplanationInputSchema>;

const ExperimentExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI explanation of the experiment.'),
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
  prompt: `You are an expert science teacher. A student has performed the following experiment:

  {{experimentDescription}}

  Explain the underlying chemical reaction or physics principle in simple terms that a student can understand.  Keep it brief and to the point.
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
    return output!;
  }
);
