'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User, Check, ChevronsRight, HelpCircle, Lightbulb, ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ChatMessageProps = {
  role: 'user' | 'model';
  content: any; // string or structured learning pack
  isLoading?: boolean;
};

const QuillWriting = ({ text, as = 'p' }: { text: string, as?: 'p' | 'li' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const typingSpeed = 10; // ms

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

  const Component = as;

  return (
    <Component className="leading-relaxed">
      {displayedText}
      <span className="inline-block w-px h-4 ml-1 align-text-bottom bg-foreground animate-[caret-blink_1s_step-end_infinite]"></span>
    </Component>
  );
};

const LearningPack = ({ pack }: { pack: any }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(5).fill(null));

  const handleOptionSelect = (qIndex: number, option: string) => {
    setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[qIndex] = option;
        return newAnswers;
    });
  };

  if (typeof pack === 'string') {
    return <QuillWriting text={pack} />;
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        <div>
            <h3 className="font-headline text-lg text-primary flex items-center gap-2"><Lightbulb className="text-accent"/> Simple Summary</h3>
            <p>{pack.simpleSummary}</p>
        </div>
        <div>
            <h3 className="font-headline text-lg text-primary flex items-center gap-2"><ListOrdered className="text-accent"/> Key Learning Points</h3>
            <ul className="list-disc pl-5 space-y-1">
                {pack.keyLearningPoints.map((point: string, i: number) => <li key={i}>{point}</li>)}
            </ul>
        </div>
         <div>
            <h3 className="font-headline text-lg text-primary flex items-center gap-2"><ChevronsRight className="text-accent"/> Step-by-Step Explanation</h3>
            <ol className="list-decimal pl-5 space-y-2">
                {pack.stepByStepExplanation.map((step: string, i: number) => <li key={i}>{step}</li>)}
            </ol>
        </div>
        <div>
            <h3 className="font-headline text-lg text-primary flex items-center gap-2"><HelpCircle className="text-accent"/> Cause & Effect</h3>
            <p>{pack.causeEffect}</p>
        </div>
        <div>
            <h3 className="font-headline text-lg text-primary flex items-center gap-2"><HelpCircle className="text-accent"/> Mini Quiz</h3>
            <Accordion type="single" collapsible className="w-full">
                {pack.miniQuiz.map((quizItem: any, qIndex: number) => (
                    <AccordionItem value={`item-${qIndex}`} key={qIndex}>
                        <AccordionTrigger>{qIndex + 1}. {quizItem.question}</AccordionTrigger>
                        <AccordionContent>
                           <div className="flex flex-col space-y-2">
                                {quizItem.options.map((option: string, oIndex: number) => (
                                    <button
                                        key={oIndex}
                                        onClick={() => handleOptionSelect(qIndex, option)}
                                        className={cn("text-left p-2 rounded-md border text-sm transition-colors",
                                            selectedAnswers[qIndex] === option ? 
                                                (option === quizItem.answer ? 'bg-accent/20 border-accent' : 'bg-destructive/20 border-destructive')
                                            : 'hover:bg-primary/5'
                                        )}
                                    >
                                        {selectedAnswers[qIndex] && option === quizItem.answer && <Check className="inline-block mr-2 text-accent"/>}
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {selectedAnswers[qIndex] && (
                                <p className={cn("mt-3 text-xs font-semibold", selectedAnswers[qIndex] === quizItem.answer ? 'text-accent' : 'text-destructive')}>
                                    {selectedAnswers[qIndex] === quizItem.answer ? 'Correct!' : `Not quite. The correct answer is: ${quizItem.answer}`}
                                </p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
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
          isUser ? <p className="leading-relaxed">{content}</p> : <LearningPack pack={content} />
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
