'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { marked } from 'marked';

type ChatMessageProps = {
  role: 'user' | 'model';
  content: any; // Now primarily a string
  isLoading?: boolean;
};

// Component to render the AI's response with a typing effect
const QuillWriting = ({ text, onFinished }: { text: string, onFinished?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const typingSpeed = 10; // ms per character

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (onFinished) onFinished();
        }
      }, typingSpeed);
      return () => clearInterval(interval);
    }
  }, [text, onFinished]);

  // Use dangerouslySetInnerHTML to render markdown
  const createMarkup = () => {
    const rawMarkup = marked.parse(displayedText, { breaks: true, gfm: true });
    // This is generally okay as we trust the AI source, but for production,
    // you might want to add a sanitization step (e.g., using DOMPurify).
    return { __html: rawMarkup };
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
       <div dangerouslySetInnerHTML={createMarkup()} />
       {/* Show caret only while typing */}
       {displayedText.length < text.length &&
         <span className="inline-block w-px h-4 ml-1 align-text-bottom bg-foreground animate-[caret-blink_1s_step-end_infinite]"></span>
       }
    </div>
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
          'max-w-[100%] md:max-w-[75%] rounded-lg px-4 py-3 burnt-edge',
          isUser
            ? 'bg-secondary/20 border-secondary/30'
            : 'bg-primary/5 border-primary/10 w-full'
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
           <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
