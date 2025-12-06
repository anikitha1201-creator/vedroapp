'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type ChatMessageProps = {
  role: 'user' | 'model';
  content: string;
  isLoading?: boolean;
};

const QuillWriting = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const typingSpeed = 30; // ms

  useEffect(() => {
    setDisplayedText('');
    if (text) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
        }
      }, typingSpeed);
      return () => clearInterval(interval);
    }
  }, [text]);

  return (
    <p className="leading-relaxed prose prose-sm dark:prose-invert max-w-none">
      {displayedText}
      <span className="inline-block w-px h-4 ml-1 align-text-bottom bg-foreground animate-[caret-blink_1s_step-end_infinite]"></span>
    </p>
  );
};

export default function ChatMessage({ role, content, isLoading = false }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-start gap-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-9 w-9 border-2 border-accent/50">
          <AvatarFallback className="bg-primary/10 text-accent">
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-3 burnt-edge',
          isUser
            ? 'bg-secondary/20 border-secondary/30'
            : 'bg-primary/5 border-primary/10'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.4s]"></div>
          </div>
        ) : (
          isUser ? <p className="leading-relaxed">{content}</p> : <QuillWriting text={content} />
        )}
      </div>
      {isUser && (
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
