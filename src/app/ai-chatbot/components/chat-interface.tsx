
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { safeGenerateContentWithRetry } from '../actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Send, User } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// --- Client-side optimizations ---

// 1. Debouncing: To reduce API calls, we only send a request after the user stops typing.
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 2. Caching: A simple in-memory cache to store the last few responses.
const responseCache = new Map<string, string>();
const CACHE_SIZE = 5;

const getCachedResponse = (key: string) => responseCache.get(key);
const setCachedResponse = (key: string, value: string) => {
  if (responseCache.size >= CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, value);
};

// --- Main Component ---

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    // Check cache first
    const cached = getCachedResponse(messageContent);
    if (cached) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cached,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    // Call the server action with retry logic
    const result = await safeGenerateContentWithRetry({ message: messageContent });

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.success ? result.response : result.error,
    };
    
    // Save successful responses to cache
    if (result.success) {
        setCachedResponse(messageContent, result.response);
    }

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  // To disable debouncing and call on every keystroke (not recommended),
  // you would call `handleSendMessage` directly in the input's `onChange`.
  // The current setup uses a button click, which is safer for API usage.
  const debouncedSend = useCallback(debounce(handleSendMessage, 500), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto bg-card rounded-lg burnt-edge">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {/* Initial Welcome Message */}
          {messages.length === 0 && (
            <div className="flex items-start gap-4 p-4 text-primary rounded-lg bg-primary/5">
                <Avatar className="h-9 w-9 border-2 border-accent">
                    <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">Vedro AI</p>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p>Hello! How can I help you explore a new concept today?</p>
                  </div>
                </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 border-2 border-accent">
                  <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[75%] rounded-lg p-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/5'
                )}
              >
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback><User/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border-2 border-accent">
                    <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
                 <div className="max-w-[75%] rounded-lg p-3 bg-primary/5 flex items-center gap-2 text-muted-foreground">
                     <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                     <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.2s]"></div>
                     <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.4s]"></div>
                 </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about a concept, a problem, or an idea..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} className="wax-press">
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
