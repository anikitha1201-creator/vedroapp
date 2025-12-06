'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Flame, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const questions = [
  {
    question: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Au', 'Ge'],
    answer: 'Au',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Jupiter', 'Venus'],
    answer: 'Mars',
  },
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria'],
    answer: 'Mitochondria',
  },
  {
    question: 'H2O is the chemical formula for?',
    options: ['Oxygen', 'Water', 'Hydrogen Peroxide'],
    answer: 'Water',
  }
];

type GameState = 'start' | 'playing' | 'result' | 'end';
type ResultState = 'correct' | 'incorrect' | null;

export default function QuizRunnerClient() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [result, setResult] = useState<ResultState>(null);
  
  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setQuestionIndex(0);
    setScore(0);
    setTimeLeft(10);
    setResult(null);
  };

  const handleAnswer = (selectedOption: string | null) => {
    setGameState('result');
    if (selectedOption === currentQuestion.answer) {
      setResult('correct');
      setScore(prev => prev + 100 + timeLeft * 10);
    } else {
      setResult('incorrect');
    }

    setTimeout(() => {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(prev => prev + 1);
        setTimeLeft(10);
        setResult(null);
        setGameState('playing');
      } else {
        setGameState('end');
      }
    }, 2000);
  };

  if (gameState === 'start') {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Ready to Run?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Test your knowledge at speed. Choose the correct path before time runs out!</p>
          <Button onClick={startGame} size="lg">Start the Quiz Run</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'end') {
     return (
      <Card className="text-center animate-[ink-fade-in_1s_ease-out_forwards]">
        <CardHeader>
          <CardTitle>Run Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-accent mb-2">Final Score: {score}</p>
          <p className="text-muted-foreground mb-4">A scholar's mind is sharpened by challenge.</p>
          <Button onClick={startGame} size="lg">Run Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto p-4 md:p-8 rounded-lg bg-card burnt-edge overflow-hidden">
        {result === 'correct' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><div className="w-32 h-32 rounded-full bg-accent animate-[gold-flare_0.7s_ease-out_forwards]"></div></div>}
        {result === 'incorrect' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><div className="w-32 h-32 text-destructive animate-[red-ink-splash_0.7s_ease-out_forwards]"><X className="w-full h-full"/></div></div>}

      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold text-primary">Score: {score}</div>
        <div className="text-lg font-bold text-accent flex items-center gap-1"><Flame size={20}/> {timeLeft}</div>
      </div>
      
      <div className="w-full h-2 bg-primary/10 rounded-full mb-8">
        <div className="h-2 bg-accent rounded-full transition-all duration-1000 linear" style={{ width: `${timeLeft * 10}%` }}></div>
      </div>

      <div className="text-center mb-10">
        <p className="text-muted-foreground">Question {questionIndex + 1} of {questions.length}</p>
        <h2 className="text-2xl md:text-3xl font-headline text-primary">{currentQuestion.question}</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {currentQuestion.options.map((option) => (
          <Button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={gameState === 'result'}
            variant="outline"
            className={cn(
              "h-24 md:h-32 text-lg md:text-xl font-bold transition-all duration-300 wax-press",
              gameState === 'result' && option === currentQuestion.answer && 'bg-accent/30 border-accent text-accent',
              gameState === 'result' && option !== currentQuestion.answer && 'bg-destructive/20 border-destructive text-destructive'
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
