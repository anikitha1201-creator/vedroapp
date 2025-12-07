
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, BookOpen, Gift, Play, Repeat, Scroll, Trophy, X } from 'lucide-react';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';

// --- DATA ---
const questions = [
  { question: 'What is the chemical symbol for Gold?', options: ['Ag', 'Au', 'Ge', 'Go'], answer: 'Au' },
  { question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Jupiter', 'Venus', 'Saturn'], answer: 'Mars' },
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], answer: 'Mitochondria' },
  { question: 'H2O is the chemical formula for?', options: ['Oxygen', 'Water', 'Hydrogen Peroxide', 'Salt'], answer: 'Water' },
  { question: 'What force keeps us on the ground?', options: ['Magnetism', 'Gravity', 'Friction', 'Tension'], answer: 'Gravity' },
  { question: 'What is the largest mammal in the world?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'], answer: 'Blue Whale' },
  { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], answer: 'William Shakespeare' },
];

// --- TYPES ---
type GameState = 'start' | 'playing' | 'question' | 'result' | 'end';
type Scroll = { id: number; x: number; speed: number; question: typeof questions[0] };

// --- GAME CONSTANTS ---
const GAME_DURATION = 60; // in seconds
const BASE_SCROLL_SPEED = 1;
const MAX_SCROLL_SPEED = 4;

// --- GAME COMPONENTS ---

const ScholarBasket = ({ x, onCatch }: { x: number; onCatch: () => void; }) => {
  const basketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a proxy for collision detection.
    // A real implementation would use a more robust method.
    if (basketRef.current) {
        basketRef.current.style.transform = `translateX(${x}px)`;
    }
  }, [x]);

  return (
    <div ref={basketRef} className="absolute bottom-5 left-1/2 -translate-x-1/2 w-32 h-20 transition-transform duration-100 ease-linear">
        <div className="w-full h-full bg-primary/20 border-4 border-primary rounded-t-3xl flex items-center justify-center pt-4">
            <Gift className="w-12 h-12 text-primary/80" />
        </div>
         {/* This invisible element will detect collisions */}
        <div className="absolute -top-4 w-full h-4" onMouseOver={onCatch} />
    </div>
  );
};

const FallingScroll = ({ scroll, onMiss }: { scroll: Scroll, onMiss: (id: number) => void; }) => {
    const duration = (window.innerHeight / (scroll.speed * 100));
    const handleAnimationEnd = () => {
        onMiss(scroll.id);
    };

    return (
        <div
            className="absolute top-0 -translate-y-full"
            style={{ 
                left: `${scroll.x}%`,
                animation: `fall ${duration}s linear forwards`,
            }}
            onAnimationEnd={handleAnimationEnd}
        >
            <Scroll className="w-12 h-12 text-accent animate-spin-slow" />
        </div>
    );
};

const QuestionModal = ({ question, onAnswer, result }: { question: typeof questions[0]; onAnswer: (isCorrect: boolean, answer: string) => void; result: { isCorrect: boolean, answer: string } | null }) => {
    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <Card className="w-full max-w-lg text-center animate-[bounce-in_0.5s_ease-out_forwards] burnt-edge-pulse">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">{question.question}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {question.options.map((option) => (
                        <Button
                            key={option}
                            variant={
                                result && option === question.answer ? 'success' 
                                : result && option === result.answer ? 'destructive' 
                                : 'outline'
                            }
                            className={cn(
                                "h-auto py-4 text-lg wax-press",
                                result && option === question.answer && 'green-burst',
                                result && option === result.answer && !result.isCorrect && 'animate-shake'
                            )}
                            onClick={() => onAnswer(option === question.answer, option)}
                            disabled={!!result}
                        >
                            {option}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

const Background = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <span className="fixed block w-full h-full bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-20"></span>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
    </div>
);

// --- MAIN GAME LOGIC ---

export default function QuizRunnerClient() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showPointsIndicator, setShowPointsIndicator] = useState(false);

  // Player & Scrolls state
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [basketX, setBasketX] = useState(0);
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<typeof questions[0] | null>(null);
  const [questionResult, setQuestionResult] = useState<{ isCorrect: boolean, answer: string } | null>(null);

  // --- GAME LOOP & STATE MANAGEMENT ---
  const spawnScroll = useCallback(() => {
    const speed = BASE_SCROLL_SPEED + (score / 50); // Speed increases with score
    setScrolls(prev => [
      ...prev,
      {
        id: Date.now(),
        x: Math.random() * 90 + 5, // 5% to 95% of screen width
        speed: Math.min(speed, MAX_SCROLL_SPEED),
        question: questions[Math.floor(Math.random() * questions.length)],
      },
    ]);
  }, [score]);
  
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Game timer
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Scroll spawner
    const scrollInterval = setInterval(spawnScroll, 2000); // New scroll every 2 seconds

    return () => {
        clearInterval(gameTimer);
        clearInterval(scrollInterval);
    };
  }, [gameState, spawnScroll]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const gameAreaWidth = rect.width;
    const mouseX = e.clientX - rect.left;
    
    // Center the basket (16*4 = 64px wide) on the cursor
    const newX = mouseX - (gameAreaWidth / 2);
    setBasketX(newX);
  };
  
  const handleScrollCatch = (scroll: Scroll) => {
    if (gameState !== 'playing') return;
    setGameState('question');
    setActiveQuestion(scroll.question);
    setScrolls(prev => prev.filter(s => s.id !== scroll.id));
  };
  
  const handleScrollMiss = (id: number) => {
    setScrolls(prev => prev.filter(s => s.id !== id));
  };

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    if (gameState !== 'question') return;

    setQuestionResult({ isCorrect, answer });
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setShowPointsIndicator(true);
      setTimeout(() => setShowPointsIndicator(false), 1000);
    } else {
       setTimeLeft(prev => Math.max(0, prev - 3)); // 3 second penalty
    }

    setTimeout(() => {
      setActiveQuestion(null);
      setQuestionResult(null);
      if (timeLeft > 0) {
        setGameState('playing');
        spawnScroll();
      } else {
        setGameState('end');
      }
    }, 1500);
  };
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setScrolls([]);
    setActiveQuestion(null);
    setQuestionResult(null);
    setGameState('playing');
    setTimeout(spawnScroll, 500);
  };
  
  // --- RENDER LOGIC ---

  if (gameState === 'start') {
    return (
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-[bounce-in_0.5s_ease-out_forwards] torch-flicker">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Scroll Catcher</CardTitle>
          <CardDescription>Catch the falling scrolls and answer the questions within!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} size="lg" className="wax-press">
            <Play className="mr-2"/>
            Begin
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'end') {
     return (
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-[bounce-in_0.5s_ease-out_forwards] torch-flicker">
        <CardHeader>
          <Trophy className="h-16 w-16 mx-auto text-accent"/>
          <CardTitle className="text-3xl font-headline text-primary">Time's Up!</CardTitle>
          <CardDescription>A fine effort, scholar!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-foreground">{score}</p>
          <Button onClick={startGame} size="lg" className="wax-press">
            <Repeat className="mr-2"/>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
        ref={gameAreaRef}
        className="relative w-full max-w-5xl h-[75vh] mx-auto rounded-lg bg-primary/70 shadow-2xl overflow-hidden flex flex-col burnt-edge torch-flicker"
        onMouseMove={handleMouseMove}
    >
        <Background />
      
        {/* HUD */}
        <div className="relative z-10 flex justify-between items-center p-4 text-lg font-bold text-primary-foreground bg-primary/50">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full">
                <Award size={20}/> 
                <span className="relative">
                  Score: {score}
                  {showPointsIndicator && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-400 font-bold animate-[ink-fade-in_1s_ease-out_forwards]">+10 Coins</span>
                  )}
                </span>
            </div>
            <div className="flex flex-col items-center">
                 <span className="text-3xl">{timeLeft}</span>
                 <span className="text-xs">seconds left</span>
            </div>
             <div className="flex items-center gap-2 px-3 py-1 rounded-full">
                <Button variant="destructive" size="sm" onClick={() => setGameState('end')}><X size={16}/> End</Button>
            </div>
        </div>

        {/* Game Area */}
        <div className="relative flex-1">
             {gameState === 'playing' && scrolls.map(scroll => (
                <div key={scroll.id} onMouseOver={() => handleScrollCatch(scroll)}>
                    <FallingScroll scroll={scroll} onMiss={handleScrollMiss} />
                </div>
            ))}
            <ScholarBasket x={basketX} onCatch={() => {}} />
        </div>
      
        {/* Question Overlay */}
        {gameState === 'question' && activeQuestion && (
            <QuestionModal question={activeQuestion} onAnswer={handleAnswer} result={questionResult} />
        )}
    </div>
  );
}
