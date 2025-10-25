'use server';

/**
 * @fileOverview Allows users to rate AI responses to improve future interactions.
 *
 * - improveResponse - A function that handles the rating of AI responses.
 * - ImproveResponseInput - The input type for the improveResponse function.
 * - ImproveResponseOutput - The return type for the improveResponse function.
 */

import {ai} from '@/ai/genkit';
import { ImproveResponseInputSchema, ImproveResponseOutputSchema, type ImproveResponseInput, type ImproveResponseOutput } from '@/lib/types';


export async function improveResponse(
  input: ImproveResponseInput
): Promise<ImproveResponseOutput> {
  return improveResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveResponsePrompt',
  input: {schema: ImproveResponseInputSchema},
  output: {schema: ImproveResponseOutputSchema},
  prompt: `You are an AI assistant designed to learn from user feedback.

  Based on the user's rating ({{rating}}) of the previous response ({{response}}), please adjust your future responses to be more helpful and relevant.
  Consider the user's message ({{message}}) in your adjustments.
  Response should be in Indonesian.
  `,
});

const improveResponseFlow = ai.defineFlow(
  {
    name: 'improveResponseFlow',
    inputSchema: ImproveResponseInputSchema,
    outputSchema: ImproveResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
