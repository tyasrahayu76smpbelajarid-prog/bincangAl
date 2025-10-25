import { config } from 'dotenv';
config();

import '@/ai/flows/generate-chat-response.ts';
import '@/ai/flows/generate-conversation-starter.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/improve-response.ts';