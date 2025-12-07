'use server';

import { getChatbotResponse } from '@/ai/flows/chatbot';
import type { ChatbotInput, LearningPack } from '@/ai/flows/chatbot.types';

// The safe result now uses the correct LearningPack type
type SafeResult =
  | { success: true; response: LearningPack }
  | { success: false; error: string };

/**
 * Wraps the AI call to safely handle potential errors and provide a consistent response shape.
 * @param {ChatbotInput} input - The input for the chatbot flow.
 * @returns {Promise<SafeResult>} - A result object indicating success or failure.
 */
export async function safeGenerateContent(
  input: ChatbotInput
): Promise<SafeResult> {
  try {
    const result = await getChatbotResponse(input);
    return { success: true, response: result };
  } catch (error: any) {
    console.error('Failed to get chatbot response:', error);
    // This provides a user-friendly error message that can be displayed in the UI.
    return {
      success: false,
      error:
        error.message ||
        'An unexpected error occurred. Please try again.',
    };
  }
}
