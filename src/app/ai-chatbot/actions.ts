'use server';
import { chat } from '@/ai/flows/chatbot';
import type { LearningPack } from '@/ai/flows/schemas';

export async function getLearningPack(
  topic: string
): Promise<{ pack: LearningPack | null; error: string | null }> {
  try {
    const learningPack = await chat(topic);
    return { pack: learningPack, error: null };
  } catch (error) {
    console.error('Error generating learning pack:', error);
    // Create a user-friendly error structure that matches the expected schema
    // to prevent the UI from breaking.
    const errorPack: LearningPack = {
      simpleSummary:
        "The Vedro AI is currently pondering... It seems I've hit a snag. Please try your question again in a moment.",
      keyLearningPoints: [],
      stepByStepExplanation: [],
      causeAndEffect: [],
      quizQuestions: [],
    };
    return {
      pack: errorPack,
      error: 'Failed to generate learning pack. The Alchemist is busy.',
    };
  }
}
