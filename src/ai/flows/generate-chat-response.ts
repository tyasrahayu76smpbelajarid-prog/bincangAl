'use server';

import {ai} from '@/ai/genkit';
import { GenerateChatResponseInputSchema, GenerateChatResponseOutputSchema, type GenerateChatResponseInput, type GenerateChatResponseOutput } from '@/lib/types';

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `Anda adalah BincangAI, chatbot yang ramah dan suka membantu dari Indonesia. Lanjutkan percakapan dengan gaya yang natural dan menarik. Jawablah secara singkat dan jelas.

  Riwayat obrolan:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  
  Pesan baru dari pengguna:
  {{message}}
  `,
});


const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
