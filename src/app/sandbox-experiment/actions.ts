'use server';

import { getExperimentExplanation } from '@/ai/flows/sandbox-experiment-ai-explanations';

export async function generateExperimentExplanation(experimentDescription: string) {
  try {
    const result = await getExperimentExplanation({ experimentDescription });
    return { success: true, explanation: result.explanation };
  } catch (error) {
    console.error('Error generating experiment explanation:', error);
    return { success: false, error: 'Failed to get explanation from the Alchemist.' };
  }
}
