'use server';

import { getChatbotResponse } from '@/ai/flows/chatbot';
import type { ChatbotInput, LearningPack } from '@/ai/flows/chatbot.types';


const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * To increase your API quota, you need to enable billing on your Google Cloud project.
 * 1. Go to the Google Cloud Console: https://console.cloud.google.com/
 * 2. Select your project.
 * 3. Go to "Billing" and ensure a billing account is linked.
 * 4. Go to "APIs & Services" > "Enabled APIs & services".
 * 5. Search for "Generative Language API" or "Vertex AI API" (depending on what you're using).
 * 6. Click on it and go to the "Quotas" tab to view your limits.
 * 7. You can request a quota increase from this page, which often requires billing to be enabled.
 */

type SafeResult =
  | { success: true; response: LearningPack }
  | { success: false; error: string };

/**
 * Wraps the Genkit flow call with a retry mechanism that uses exponential backoff.
 * This makes the application more resilient to temporary server errors and rate limiting.
 * @param {ChatbotInput} input - The input for the chatbot flow.
 * @returns {Promise<SafeResult>} - A result object indicating success or failure.
 */
export async function safeGenerateContentWithRetry(
  input: ChatbotInput
): Promise<SafeResult> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await getChatbotResponse(input);
      return { success: true, response: result };
    } catch (error: any) {
      // Check for HTTP 429 (Too Many Requests) or 5xx server errors
      const isRateLimitError =
        error.cause?.status === 429 ||
        (error.cause?.status >= 500 && error.cause?.status < 600);

      if (isRateLimitError && i < MAX_RETRIES - 1) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, i);
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue; // Continue to the next iteration to retry
      } else {
        console.error('Failed to get chatbot response after all retries:', error);
        if (isRateLimitError) {
          return {
            success: false,
            error: 'The library is under heavy use right now. Please wait a moment and try again.',
          };
        }
        return {
          success: false,
          error: error.message || 'An unexpected error occurred. Please try again.',
        };
      }
    }
  }

  // This should be unreachable, but as a fallback:
  return {
    success: false,
    error: 'An unexpected error occurred after multiple retries.',
  };
}
