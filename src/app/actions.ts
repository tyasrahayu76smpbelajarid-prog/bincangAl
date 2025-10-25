'use server';

import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { generateConversationStarter } from '@/ai/flows/generate-conversation-starter';
import { improveResponse } from '@/ai/flows/improve-response';
import type { Message, GenerateChatResponseOutput, ConversationStarterOutput, ImproveResponseInput } from '@/lib/types';

export async function getAiResponse(input: { history: Omit<Message, 'id' | 'rating'>[], message: string }): Promise<GenerateChatResponseOutput> {
  return await generateChatResponse(input);
}

export async function getConversationStarter(): Promise<ConversationStarterOutput> {
  return await generateConversationStarter({});
}

export async function sendRating(input: ImproveResponseInput): Promise<void> {
  await improveResponse(input);
}
