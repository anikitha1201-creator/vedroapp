'use server';

import { getChatbotResponse, type ChatbotInput, type ChatbotOutput } from '@/ai/flows/chatbot';

// =======================================================================
// How to Increase Your Quota
//
// 1. Check Usage and Limits:
//    - Go to the Google Cloud Console: https://console.cloud.google.com/
//    - Navigate to "APIs & Services" > "Dashboard".
//    - Find and click on the "Generative Language API" (or similar name).
//    - Click on the "Quotas" tab to see your current usage and limits.
//
// 2. Enable Billing:
//    - Most importantly, you must have billing enabled on your Google Cloud project
//      to move beyond the free tier limits.
//    - Go to "Billing" in the Google Cloud Console and link a billing account to your project.
//
// 3. Request Higher Quota:
//    - On the "Quotas" page, you can select the specific quota you want to increase
//      (e.g., "Generate content requests per minute") and click "Edit Quotas"
//      to request a higher limit. This usually requires a billing account to be active.
// =======================================================================

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * A wrapper function that safely calls the Genkit flow with a retry mechanism.
 * It uses exponential backoff to wait between retries.
 * @param input The input for the chatbot flow.
 * @returns A promise that resolves to the chatbot output or an error.
 */
async function safeGenerateContentWithRetry(input: ChatbotInput): Promise<{ success: true; response: ChatbotOutput } | { success: false; error: string }> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await getChatbotResponse(input);
      return { success: true, response: result };
    } catch (error: any) {
      // Check if the error is a rate limit error (HTTP 429)
      const isRateLimitError = error.message?.includes('429');

      if (isRateLimitError && i < MAX_RETRIES - 1) {
        // This is a rate limit error and we can still retry.
        const delay = INITIAL_DELAY_MS * Math.pow(2, i);
        console.warn(`Rate limit exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // This is a different error or the last retry attempt.
        console.error('Error generating chatbot response:', error);
        if (isRateLimitError) {
          return { success: false, error: 'The library is currently experiencing high demand. Please try again in a few moments.' };
        }
        return { success: false, error: error.message || 'The wise scholar seems to be pondering... Please try again later.' };
      }
    }
  }
  // This part should theoretically not be reached, but it's here for safety.
  return { success: false, error: 'An unexpected error occurred after multiple retries.' };
}


export async function generateChatbotResponse(input: ChatbotInput): Promise<{ success: true; response: ChatbotOutput } | { success: false; error: string }> {
    return safeGenerateContentWithRetry(input);
}
