'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate conversation starters in Indonesian.
 *
 * It includes:
 * - `generateConversationStarter`: A function to generate a conversation starter.
 * - `ConversationStarterInput`: The input type for the `generateConversationStarter` function (empty object).
 * - `ConversationStarterOutput`: The output type for the `generateConversationStarter` function (string).
 */

import {ai} from '@/ai/genkit';
import { ConversationStarterInputSchema, ConversationStarterOutputSchema, type ConversationStarterInput, type ConversationStarterOutput } from '@/lib/types';

// Exported function to generate a conversation starter
export async function generateConversationStarter(
  input: ConversationStarterInput
): Promise<ConversationStarterOutput> {
  return generateConversationStarterFlow(input);
}

// Define the prompt to generate a conversation starter
const conversationStarterPrompt = ai.definePrompt({
  name: 'conversationStarterPrompt',
  input: {schema: ConversationStarterInputSchema},
  output: {schema: ConversationStarterOutputSchema},
  prompt: `Anda adalah asisten percakapan yang kreatif. Buatlah sebuah ide pembuka percakapan yang menarik dan relevan dalam bahasa Indonesia.`,
});

// Define the Genkit flow
const generateConversationStarterFlow = ai.defineFlow(
  {
    name: 'generateConversationStarterFlow',
    inputSchema: ConversationStarterInputSchema,
    outputSchema: ConversationStarterOutputSchema,
  },
  async input => {
    const {output} = await conversationStarterPrompt(input);
    return output!;
  }
);
