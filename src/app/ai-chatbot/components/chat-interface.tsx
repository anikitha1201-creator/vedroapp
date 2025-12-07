'use client';

import { useState, useRef, useEffect, type FormEvent, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateChatbotResponse } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Sparkles } from 'lucide-react';
import ChatMessage from './chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export type Message = {
  role: 'user' | 'model';
  content: any; // Can be string or a structured object
};

// --- START: Debounce and Cache Utilities ---

// Simple in-memory cache
const responseCache = new Map<string, any>();

// Debounce function to delay execution
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};

// --- END: Debounce and Cache Utilities ---


export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Greetings, scholar. How may I illuminate your path of learning today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const fetchChatbotResponse = async (userInput: string) => {
     if (responseCache.has(userInput)) {
      const cachedResponse = responseCache.get(userInput);
      const aiMessage: Message = { role: 'model', content: cachedResponse.response };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      return;
    }
    
    const history = messages.map(msg => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : 'Previous structured response',
    }));

    const result = await generateChatbotResponse({ history, prompt: userInput });

    if (result.success && result.response) {
      const aiMessage: Message = { role: 'model', content: result.response.response };
      responseCache.set(userInput, result.response); // Cache the successful response
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      toast({
        title: 'An error occurred.',
        description: result.error,
        variant: 'destructive',
      });
      // If the API call fails, remove the user's message to allow them to try again.
      setMessages(prev => prev.slice(0, prev.length - 1));
    }
    setIsLoading(false);
  }

  const debouncedFetch = useCallback(debounce(fetchChatbotResponse, 500), [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    debouncedFetch(currentInput);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col torch-flicker">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="text-accent"/>
          <h2 className="text-2xl font-headline text-primary">Chat with the Scholar</h2>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
               <ChatMessage role="model" content="" isLoading={true} />
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="wax-press">
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
