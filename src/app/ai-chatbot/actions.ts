'use server';

import { getChatbotResponse, type ChatbotInput, type ChatbotOutput } from '@/ai/flows/chatbot';

export async function generateChatbotResponse(input: ChatbotInput): Promise<{ success: true; response: ChatbotOutput } | { success: false; error: string }> {
  try {
    const result = await getChatbotResponse(input);
    return { success: true, response: result };
  } catch (error: any) {
    console.error('Error generating chatbot response:', error);
    return { success: false, error: error.message || 'The wise scholar seems to be pondering... Please try again later.' };
  }
}
