'use server';
/**
 * @fileOverview AI explanations for the Sandbox Experiment.
 *
 * - getExperimentExplanation - A function that generates AI explanations for the experiment.
 * - ExperimentExplanationInput - The input type for the getExperimentExplanation function.
 * - ExperimentExplanationOutput - The return type for the getEixplanation function.
 */
import { ai } from '@/ai/genkit';
import { marked } from 'marked';
import { z } from 'zod';

const ExperimentExplanationInputSchema = z.object({
  experimentDescription: z
    .string()
    .describe(
      'A description of the items a student combined in the sandbox, the resulting chemical equation, and the observed result.'
    ),
});
export type ExperimentExplanationInput = z.infer<
  typeof ExperimentExplanationInputSchema
>;

export type ExperimentExplanationOutput = {
  explanation: string;
};

const sandboxPrompt = ai.definePrompt({
  name: 'sandboxPrompt',
  input: { schema: ExperimentExplanationInputSchema },
  prompt: `You are an expert science teacher with the persona of a wise, ancient alchemist. A student is using an interactive sandbox and has just performed an experiment.

Your task is to provide a clear, engaging, and educational explanation of the reaction that occurred.

The student's experiment is as follows:
{{{experimentDescription}}}

Please generate a response in Markdown format that includes the following sections, using thematic and engaging language:

### 📜 The Reaction That Occurred
Start by confirming what happened in a thematic way, referencing the provided equation. (e.g., "Indeed, you've masterfully performed a neutralization reaction, turning acid and base into salt and water!")

### ✨ Step-by-Step Explanation
Break down the scientific process into simple, easy-to-understand steps. Use bullet points. Explain what is happening at a molecular or conceptual level.

### 🔬 The Alchemist's Principle
Explain the core scientific principle behind the reaction (e.g., "The principle at play here is called displacement, where a more reactive metal takes the place of a less reactive one...").

### 🌍 Real-World Parchments
Provide a relatable, real-world example or application of this principle. Make it tangible for the student.

### ⚠️ A Note on Misconceptions
Briefly address a common misconception related to this experiment. (e.g., "Many believe all salts are like table salt, but in alchemy, a 'salt' is any ionic compound formed from such a reaction.")

### 💡 The Next Experiment
Suggest a specific follow-up experiment the student could try in the sandbox to further their learning, using items from the inventory. (e.g., "Now that you have mastered displacement, try combining the Iron Nail (Fe) with the Copper Sulfate (CuSO4).")

Keep your tone encouraging, wise, and slightly magical. The goal is to make learning feel like discovering ancient secrets.
  `,
});

const sandboxFlow = ai.defineFlow(
  {
    name: 'sandboxFlow',
    inputSchema: ExperimentExplanationInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const result = await sandboxPrompt(input);
    return result.text;
  }
);


export async function getExperimentExplanation(
  input: ExperimentExplanationInput
): Promise<ExperimentExplanationOutput> {
  try {
    const text = await sandboxFlow(input);
    const htmlExplanation = await marked.parse(text);
    return { explanation: htmlExplanation };
  } catch (error) {
    console.error('Error in getExperimentExplanation:', error);
    return {
      explanation:
        "### The Alchemist Ponders...\nThe mixture is inert, like a silent stone in a forgotten library. No reaction occurred with these elements. Perhaps try combining different ingredients from the scrolls?",
    };
  }
}
