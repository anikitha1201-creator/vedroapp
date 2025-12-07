'use server';

import { chatbotFlow, type ChatbotInput, type ChatbotOutput } from "@/ai/flows/chatbot";

type ActionResult = 
  | { success: true; response: ChatbotOutput }
  | { success: false; error: string };

export async function safeGenerateContent(input: ChatbotInput): Promise<ActionResult> {
  try {
    const response = await chatbotFlow(input);
    return { success: true, response };
  } catch (e: any) {
    console.error("safeGenerateContent error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `The Alchemist is busy. ${errorMessage}` };
  }
}
