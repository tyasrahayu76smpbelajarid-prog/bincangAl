'use server';

/**
 * @fileOverview Summarizes a chat history for quick review. Used to quickly recall key discussion points.
 *
 * - summarizeChatHistory - A function that handles the chat history summarization process.
 * - SummarizeChatHistoryInput - The input type for the summarizeChatHistory function.
 * - SummarizeChatHistoryOutput - The return type for the summarizeChatHistory function.
 */

import {ai} from '@/ai/genkit';
import { SummarizeChatHistoryInputSchema, SummarizeChatHistoryOutputSchema, type SummarizeChatHistoryInput, type SummarizeChatHistoryOutput } from '@/lib/types';


export async function summarizeChatHistory(
  input: SummarizeChatHistoryInput
): Promise<SummarizeChatHistoryOutput> {
  return summarizeChatHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeChatHistoryPrompt',
  input: {schema: SummarizeChatHistoryInputSchema},
  output: {schema: SummarizeChatHistoryOutputSchema},
  prompt: `Anda adalah asisten AI yang dirancang untuk meringkas riwayat obrolan dalam bahasa Indonesia.\n\n  Berikan ringkasan singkat dari riwayat obrolan berikut:\n\n  {{chatHistory}}
  `,
});

const summarizeChatHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeChatHistoryFlow',
    inputSchema: SummarizeChatHistoryInputSchema,
    outputSchema: SummarizeChatHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
