import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { ChatAvatar } from './chat-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatMessageActions } from './chat-message-actions';

interface ChatMessageProps {
  message: Message;
  onRate: (messageId: string, rating: 'good' | 'bad') => void;
}

export function ChatMessage({ message, onRate }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex items-start gap-3',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && <ChatAvatar role="assistant" />}
      <div className={cn('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}>
        <div className={cn(
          'max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl break-words shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none border'
        )}>
          <p className="text-sm">{content}</p>
        </div>
        {!isUser && content && (
          <ChatMessageActions message={message} onRate={onRate} />
        )}
      </div>
      {isUser && <ChatAvatar role="user" />}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex items-start gap-3 justify-start">
      <ChatAvatar role="assistant" />
      <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-card border rounded-bl-none flex items-center space-x-2">
        <Skeleton className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <Skeleton className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <Skeleton className="w-2 h-2 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
