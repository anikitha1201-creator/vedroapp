'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am an AI assistant powered by Gemini. How can I help you today?',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({ 
      role: msg.role, 
      content: typeof msg.content === 'string' ? msg.content : "Previous structured response" 
    }));

    const result = await generateChatbotResponse({ history, prompt: input });

    if (result.success && result.response) {
      // The response from the new flow is an object with a 'response' property which is a string.
      const aiMessage: Message = { role: 'model', content: result.response.response };
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
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col torch-flicker">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="text-accent"/>
          <h2 className="text-2xl font-headline text-primary">Chat with Gemini</h2>
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
            placeholder="Ask me anything..."
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
