
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { safeGenerateContent } from '../actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, ChevronRight, FilePlus, Loader2, Send, User, Check, X, Eraser, PlusSquare } from 'lucide-react';
import type { LearningPack, QuizQuestionSchema, ChatbotOutput } from '@/ai/flows/chatbot.types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | ChatbotOutput;
};

// --- Sub Components ---

const MiniQuiz = ({ quiz }: { quiz: z.infer<typeof QuizQuestionSchema>[] }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => setSubmitted(true);

  const isCorrect = (questionIndex: number) => {
    return answers[questionIndex] === quiz[questionIndex].correctAnswer;
  }

  return (
    <div className="space-y-6">
      {quiz.map((q, i) => (
        <div key={i} className="p-4 rounded-lg border bg-background/50">
          <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
          <RadioGroup 
            onValueChange={(value) => handleAnswerChange(i, value)}
            disabled={submitted}
          >
            {q.options.map((option, j) => (
              <div key={j} className={cn("flex items-center space-x-2 p-2 rounded-md transition-colors", 
                submitted && option === q.correctAnswer && 'bg-green-100 dark:bg-green-900/30',
                submitted && option !== q.correctAnswer && answers[i] === option && 'bg-red-100 dark:bg-red-900/30'
              )}>
                <RadioGroupItem value={option} id={`q${i}-o${j}`} />
                <Label htmlFor={`q${i}-o${j}`} className="flex-1 cursor-pointer">{option}</Label>
                {submitted && option === q.correctAnswer && <Check className="w-5 h-5 text-green-600"/>}
                {submitted && option !== q.correctAnswer && answers[i] === option && <X className="w-5 h-5 text-red-600"/>}
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
       <Button onClick={handleSubmit} disabled={submitted || Object.keys(answers).length < quiz.length}>
            Submit Quiz
        </Button>
    </div>
  )
}

const LearningPackDisplay = ({ pack }: { pack: LearningPack }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-lg text-primary mb-2">Simple Summary</h3>
        <p className="text-sm">{pack.simpleSummary}</p>
      </div>
      <div>
        <h3 className="font-headline text-lg text-primary mb-2">Key Learning Points</h3>
        <ul className="space-y-2 list-none">
          {pack.keyLearningPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
       <div>
        <h3 className="font-headline text-lg text-primary mb-2">Step-by-Step Explanation</h3>
        <ol className="space-y-3">
          {pack.stepByStepExplanation.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</div>
              <span className="text-sm mt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
       <div>
        <h3 className="font-headline text-lg text-primary mb-2">Cause & Effect</h3>
        <div className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm">
            {pack.causeEffectInfo}
        </div>
      </div>
      <div>
        <h3 className="font-headline text-lg text-primary mb-2">Mini Quiz</h3>
        <MiniQuiz quiz={pack.miniQuiz} />
      </div>
    </div>
  )
};

const AssistantMessage = ({ content }: { content: ChatbotOutput | string }) => {
    if (typeof content === 'string') {
        return <p>{content}</p>;
    }

    if (content.type === 'learningPack') {
        return <LearningPackDisplay pack={content.data} />;
    }

    if (content.type === 'simpleReply') {
        return <p>{content.data.reply}</p>;
    }
    
    return <p>Sorry, I received a response I don't understand.</p>;
};

// --- Main Component ---

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

    const result = await safeGenerateContent({ message: messageContent });

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.success ? result.response : result.error,
    };
    
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const clearChat = () => {
      setMessages([]);
  }

  const newChat = () => {
      setMessages([]);
      // Potentially you could also reset some session state on the server here
      // For now, we just clear the client
  }

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-card rounded-lg burnt-edge">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-start gap-4 p-4 text-primary rounded-lg bg-primary/5">
                <Avatar className="h-9 w-9 border-2 border-accent">
                    <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">Vedro AI</p>
                  <div className="prose-sm max-w-none text-foreground">
                    <p>Hello! Ask me about a concept you'd like to learn, like 'Photosynthesis' or 'Newton's Laws'.</p>
                  </div>
                </div>
            </div>
          )}

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
                  'max-w-[85%] rounded-lg p-4',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/5 w-full'
                )}
              >
                <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                >
                  {message.role === 'user' ? (
                      <p>{message.content as string}</p>
                  ) : (
                      <AssistantMessage content={message.content} />
                  )}
                </div>
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
                     <span className="text-sm">Vedro is thinking...</span>
                 </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t space-y-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about a concept, or just say hello..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} className="wax-press">
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
         <div className="flex items-center justify-start gap-2">
            <Button onClick={newChat} variant="outline" size="sm" className="wax-press text-xs"><PlusSquare size={14}/> New Chat</Button>
            <Button onClick={clearChat} variant="outline" size="sm" className="wax-press text-xs"><Eraser size={14}/> Clear</Button>
            <Button variant="outline" size="sm" className="wax-press text-xs"><FilePlus size={14}/> Add File</Button>
        </div>
      </div>
    </div>
  );
}
