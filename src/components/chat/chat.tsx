'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAiResponse, getConversationStarter, sendRating } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Send, Bot } from 'lucide-react';
import { ChatMessage, LoadingMessage } from './chat-message';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Pesan tidak boleh kosong.' }),
});

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewChatLoading, setIsNewChatLoading] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleNewConversation = async () => {
    setIsNewChatLoading(true);
    setMessages([]);
    form.reset();
    try {
      const starter = await getConversationStarter();
      setMessages([{ id: 'starter', role: 'assistant', content: starter.starter }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal memulai percakapan baru',
        description: 'Terjadi kesalahan saat mencoba memulai percakapan baru. Silakan coba lagi.',
      });
    } finally {
      setIsNewChatLoading(false);
    }
  };

  useEffect(() => {
    handleNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoading]);

  const handleRateMessage = async (messageId: string, rating: 'good' | 'bad') => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex < 1) return;

    const aiMessage = messages[messageIndex];
    const userMessage = messages[messageIndex - 1];

    if (aiMessage.role !== 'assistant' || userMessage.role !== 'user') {
      return;
    }
    
    const originalMessages = messages;
    setMessages((prevMessages) =>
      prevMessages.map((m) => (m.id === messageId ? { ...m, rating } : m))
    );

    try {
      await sendRating({
        rating,
        response: aiMessage.content,
        message: userMessage.content,
      });
    } catch (error) {
      setMessages(originalMessages);
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim penilaian',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: values.message,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    form.reset();

    try {
      const history = newMessages.map(({ id, rating, ...rest }) => rest);
      const result = await getAiResponse({
        history,
        message: values.message,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim pesan',
        description: 'Terjadi kesalahan pada AI. Silakan coba lagi.',
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-2xl h-full md:h-[90vh] flex flex-col shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">BincangAI</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            disabled={isNewChatLoading || isLoading}
            aria-label="Percakapan Baru"
          >
            <RefreshCw className={cn("h-5 w-5", (isNewChatLoading || isLoading) && "animate-spin")} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {isNewChatLoading ? (
                <LoadingMessage />
              ) : (
                messages.map((message) => <ChatMessage key={message.id} message={message} onRate={handleRateMessage} />)
              )}
              {isLoading && <LoadingMessage />}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Ketik pesan Anda..."
                        {...field}
                        autoComplete="off"
                        disabled={isLoading || isNewChatLoading}
                        className="bg-card border-0 focus-visible:ring-1 focus-visible:ring-ring ring-offset-0 h-11"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isLoading || isNewChatLoading} aria-label="Kirim Pesan" className='h-11 w-11'>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
