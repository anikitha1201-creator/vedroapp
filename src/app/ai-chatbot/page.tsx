'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, User, Send, Loader2, Zap, Lightbulb, BookOpen, BrainCircuit, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLearningPack } from './actions';
import { type LearningPack } from '@/ai/flows/chatbot.types';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- Helper Components ---

const UserMessage = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 justify-end">
    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-lg">
      <p>{text}</p>
    </div>
    <div className="bg-muted rounded-full size-10 flex items-center justify-center shrink-0">
      <User className="size-5" />
    </div>
  </div>
);

const AIMessage = ({ pack }: { pack: LearningPack }) => {
  const isGreeting = pack.keyLearningPoints.length === 0 && pack.quizQuestions.length === 0;

  return (
    <div className="flex items-start gap-3">
      <div className="bg-secondary/20 rounded-full size-10 flex items-center justify-center shrink-0">
        <Bot className="size-5 text-primary" />
      </div>
      <div className="bg-card rounded-lg p-4 max-w-2xl w-full burnt-edge">
        <p className="mb-4 text-card-foreground">{pack.simpleSummary}</p>
        
        {!isGreeting && (
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="key-points" className="bg-background/50 rounded-md border-b-0">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center gap-2 font-headline text-primary">
                  <Lightbulb className="size-4" /> Key Learning Points
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-border">
                <ul className="space-y-3">
                  {pack.keyLearningPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="size-4 mt-1 text-accent shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">{point.title}</h4>
                        <p className="text-muted-foreground text-sm">{point.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step-by-step" className="bg-background/50 rounded-md border-b-0">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                 <div className="flex items-center gap-2 font-headline text-primary">
                  <BookOpen className="size-4" /> Step-by-Step Explanation
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-border">
                <ol className="list-decimal list-inside space-y-2 text-card-foreground">
                  {pack.stepByStepExplanation.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cause-effect" className="bg-background/50 rounded-md border-b-0">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                 <div className="flex items-center gap-2 font-headline text-primary">
                  <BrainCircuit className="size-4" /> Cause and Effect
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-border">
                 <div className="space-y-3">
                  {pack.causeAndEffect.map((item, index) => (
                    <div key={index} className="p-2 rounded-md bg-background/50 border border-border">
                      <p><span className="font-semibold">Cause:</span> {item.cause}</p>
                      <p><span className="font-semibold">Effect:</span> {item.effect}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="quiz" className="bg-background/50 rounded-md border-b-0">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                 <div className="flex items-center gap-2 font-headline text-primary">
                  <HelpCircle className="size-4" /> Knowledge Check
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-border">
                <div className="space-y-4">
                  {pack.quizQuestions.map((q, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-semibold">{index + 1}. {q.question}</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                       <p className="text-xs mt-2 text-accent">Correct Answer: {q.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};


const LoadingMessage = () => (
  <div className="flex items-start gap-3">
    <div className="bg-secondary/20 rounded-full size-10 flex items-center justify-center shrink-0">
      <Bot className="size-5 text-primary" />
    </div>
    <div className="bg-card rounded-lg p-4 max-w-2xl w-full burnt-edge flex items-center gap-3">
       <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
       <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.2s]"></div>
       <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.4s]"></div>
       <span className="text-muted-foreground text-sm">The Vedro AI is thinking...</span>
    </div>
  </div>
);


// --- Main Page Component ---

export default function AiChatbotPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string | LearningPack }[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    startTransition(async () => {
      const { pack, error } = await getLearningPack(userMessage);

      if (pack) {
        setMessages((prev) => [...prev, { role: 'ai', content: pack }]);
      } else if (error) {
        // The error case is handled by getLearningPack returning a default error pack
        console.error(error);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold font-headline text-primary text-ink-fade">
          Vedro AI Tutor
        </h1>
        <p className="text-muted-foreground animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
          Ask any educational question and get a complete learning pack.
        </p>
      </div>

      <div ref={chatContainerRef} className="flex-1 space-y-6 overflow-y-auto pr-4 -mr-4">
        {messages.length === 0 && (
           <div className="flex items-start gap-3 animate-[ink-fade-in_1s_ease-out_1s_forwards] opacity-0">
              <div className="bg-secondary/20 rounded-full size-10 flex items-center justify-center shrink-0">
                <Bot className="size-5 text-primary" />
              </div>
              <div className="bg-card rounded-lg p-4 max-w-2xl w-full burnt-edge">
                <p className="text-card-foreground">Hello! I am Vedro, your AI-powered tutor. What topic would you like to explore today? For example, you could ask about "Black Holes" or "The Renaissance".</p>
              </div>
            </div>
        )}
        
        {messages.map((msg, index) =>
          msg.role === 'user' ? (
            <UserMessage key={index} text={msg.content as string} />
          ) : (
            <AIMessage key={index} pack={msg.content as LearningPack} />
          )
        )}
        {isPending && <LoadingMessage />}
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a topic, e.g., 'Photosynthesis' or 'The Roman Empire'..."
            className="flex-1"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending || !input.trim()} size="icon" className="shrink-0">
            {isPending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </div>
  );
}
