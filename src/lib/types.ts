import { z } from 'zod';

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    rating?: 'good' | 'bad';
};

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

export const GenerateChatResponseInputSchema = z.object({
  history: z.array(MessageSchema).describe('The chat history so far.'),
  message: z.string().describe('The latest user message.'),
});
export type GenerateChatResponseInput = z.infer<
  typeof GenerateChatResponseInputSchema
>;

export const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type GenerateChatResponseOutput = z.infer<
  typeof GenerateChatResponseOutputSchema
>;

export const ConversationStarterInputSchema = z.object({});
export type ConversationStarterInput = z.infer<typeof ConversationStarterInputSchema>;

export const ConversationStarterOutputSchema = z.object({starter: z.string().describe('A conversation starter in Indonesian.')});
export type ConversationStarterOutput = z.infer<typeof ConversationStarterOutputSchema>;


export const SummarizeChatHistoryInputSchema = z.object({
  chatHistory: z
    .string()
    .describe('The complete chat history to be summarized.'),
});
export type SummarizeChatHistoryInput = z.infer<
  typeof SummarizeChatHistoryInputSchema
>;

export const SummarizeChatHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the chat history.'),
});
export type SummarizeChatHistoryOutput = z.infer<
  typeof SummarizeChatHistoryOutputSchema
>;

export const ImproveResponseInputSchema = z.object({
  rating: z.string().describe("The user's rating, e.g., 'good' or 'bad'."),
  response: z.string().describe('The AI response that was rated.'),
  message: z.string().describe('The user message that prompted the response.'),
});
export type ImproveResponseInput = z.infer<typeof ImproveResponseInputSchema>;

export const ImproveResponseOutputSchema = z.object({
  suggestion: z.string().describe('An acknowledgement or suggestion based on the feedback.'),
});
export type ImproveResponseOutput = z.infer<typeof ImproveResponseOutputSchema>;
