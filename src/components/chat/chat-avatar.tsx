import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatAvatarProps {
  role: 'user' | 'assistant';
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <Avatar className={cn(
      "flex justify-center items-center",
      role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
    )}>
      <AvatarFallback>
        {role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </AvatarFallback>
    </Avatar>
  );
}
