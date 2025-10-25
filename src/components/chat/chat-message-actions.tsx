import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageActionsProps {
  message: Message;
  onRate: (messageId: string, rating: 'good' | 'bad') => void;
}

export function ChatMessageActions({ message, onRate }: ChatMessageActionsProps) {
  const hasRated = !!message.rating;

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          'h-7 w-7 text-muted-foreground hover:text-accent-foreground',
          message.rating === 'good' && 'bg-accent text-accent-foreground'
        )}
        onClick={() => onRate(message.id, 'good')}
        disabled={hasRated}
        aria-label="Suka"
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          'h-7 w-7 text-muted-foreground hover:text-accent-foreground',
          message.rating === 'bad' && 'bg-accent text-accent-foreground'
        )}
        onClick={() => onRate(message.id, 'bad')}
        disabled={hasRated}
        aria-label="Tidak Suka"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
