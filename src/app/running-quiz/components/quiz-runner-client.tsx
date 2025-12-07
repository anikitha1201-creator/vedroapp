'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Flame, X, Trophy, Repeat, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';

const questions = [
  {
    question: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Au', 'Ge'],
    answer: 'Au',
    explanation: 'Au is the symbol for Gold, derived from its Latin name, "aurum". Ag is Silver and Ge is Germanium.',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Jupiter', 'Venus'],
    answer: 'Mars',
    explanation: 'Mars is called the Red Planet because its surface is covered in iron oxide (rust), giving it a reddish appearance.',
  },
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria'],
    answer: 'Mitochondria',
    explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
  },
  {
    question: 'H2O is the chemical formula for?',
    options: ['Oxygen', 'Water', 'Hydrogen Peroxide'],
    answer: 'Water',
    explanation: 'The formula H2O indicates that one molecule of water is composed of two hydrogen atoms and one oxygen atom.',
  },
  {
    question: 'What force keeps us on the ground?',
    options: ['Magnetism', 'Gravity', 'Friction'],
    answer: 'Gravity',
    explanation: 'Gravity is the fundamental force of attraction that all matter with mass exerts on other matter.',
  },
  {
    question: 'How many continents are there on Earth?',
    options: ['5', '6', '7'],
    answer: '7',
    explanation: 'The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia.',
  }
];

type GameState = 'start' | 'playing' | 'question' | 'result' | 'end';
type ResultState = 'correct' | 'incorrect' | null;

const Lane = ({ option, onClick, result, answer, disabled }: { option: string, onClick: () => void, result: ResultState, answer: string, disabled: boolean }) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={cn(
            "relative flex items-center justify-center h-48 p-4 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer group burnt-edge",
            "border-primary/20 hover:border-accent hover:bg-accent/10",
            disabled && "cursor-not-allowed opacity-60",
            result && option === answer && "border-accent bg-accent/20 scale-105",
            result && option !== answer && "border-destructive bg-destructive/10"
        )}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        <span className="text-3xl font-bold font-headline text-primary group-hover:text-accent transition-colors z-10">{option}</span>
    </div>
);


export default function QuizRunnerClient() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [result, setResult] = useState<ResultState>(null);
  const [runProgress, setRunProgress] = useState(0);

  const currentQuestion = useMemo(() => shuffledQuestions[questionIndex], [shuffledQuestions, questionIndex]);

  // Shuffle questions at the start of the game
  const shuffleQuestions = () => {
    setShuffledQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
  }

  // Main game loop timer
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'question') return;

    if (timeLeft <= 0) {
      if (gameState === 'question') {
        handleAnswer(null); // Time's up for the question
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Runner progress timer
  useEffect(() => {
    if (gameState !== 'playing') {
      if(gameState !== 'question') setRunProgress(0);
      return;
    };

    const progressInterval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          setGameState('question');
          setTimeLeft(15); // Reset timer for question
          return 100;
        }
        return prev + 2; // Speed of the runner
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [gameState]);


  const startGame = () => {
    shuffleQuestions();
    setQuestionIndex(0);
    setScore(0);
    setResult(null);
    setRunProgress(0);
    setGameState('playing');
    setTimeLeft(100); // Total game time
  };

  const handleAnswer = (selectedOption: string | null) => {
    setGameState('result');
    if (selectedOption === currentQuestion.answer) {
      setResult('correct');
      setScore(prev => prev + 100 + timeLeft * 5); // Score bonus for speed
    } else {
      setResult('incorrect');
      setScore(prev => Math.max(0, prev - 50)); // Penalty
    }

    setTimeout(() => {
      if (questionIndex + 1 < shuffledQuestions.length) {
        setQuestionIndex(prev => prev + 1);
        setRunProgress(0);
        setResult(null);
        setGameState('playing');
      } else {
        setGameState('end');
      }
    }, 2500);
  };

  if (gameState === 'start') {
    return (
      <Card className="text-center max-w-lg mx-auto torch-flicker">
        <CardHeader>
          <CardTitle className="text-3xl">Running Quiz Adventure</CardTitle>
          <CardDescription>Test your knowledge at speed. Choose the correct path before time runs out!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} size="lg" className="wax-press">
            <Flame className="mr-2"/>
            Start the Run
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'end') {
     return (
      <Card className="text-center max-w-lg mx-auto animate-[ink-fade-in_1s_ease-out_forwards] torch-flicker">
        <CardHeader>
          <Trophy className="h-16 w-16 mx-auto text-accent"/>
          <CardTitle className="text-3xl">Run Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-accent mb-2">{score}</p>
          <p className="text-muted-foreground mb-6">A scholar's mind is sharpened by challenge.</p>
          <Button onClick={startGame} size="lg" className="wax-press">
            <Repeat className="mr-2"/>
            Run Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const isAnswering = gameState === 'question' || gameState === 'result';

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-6 rounded-lg bg-card/50 burnt-edge overflow-hidden">
        {result === 'correct' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"><div className="w-48 h-48 rounded-full bg-accent/80 animate-[gold-flare_0.7s_ease-out_forwards]"></div></div>}
        {result === 'incorrect' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"><div className="w-48 h-48 text-destructive/80 animate-[red-ink-splash_0.7s_ease-out_forwards]"><X className="w-full h-full"/></div></div>}
      
      {/* HUD */}
      <div className="flex justify-between items-center mb-4 text-lg font-bold">
        <div className="text-primary">Score: {score}</div>
        <div className={cn("text-accent flex items-center gap-1", gameState === 'question' && 'animate-pulse')}>
            <Flame size={20}/> {gameState === 'question' ? `Time: ${timeLeft}` : `Run: ${100 - runProgress}%`}
        </div>
      </div>
      
       {/* Runner Track */}
       <div className="w-full h-4 bg-primary/10 rounded-full mb-6 border border-primary/20">
         <div className="h-full bg-accent rounded-full transition-all duration-100 linear" style={{ width: `${runProgress}%` }}></div>
         <div className="w-4 h-6 bg-primary rounded-md -mt-5 relative transition-all duration-100" style={{left: `calc(${runProgress}% - 8px)`}}></div>
      </div>


      {/* Question and Path Area */}
      <div className={cn("transition-all duration-500", !isAnswering && "opacity-20 blur-sm")}>
         <Card className="text-center mb-6 burnt-edge-pulse">
            <CardHeader>
                <CardDescription>Question {questionIndex + 1} of {shuffledQuestions.length}</CardDescription>
                <CardTitle className="text-2xl md:text-3xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
             {gameState === 'result' && (
                <CardContent className="animate-ink-fade-in">
                    <p className="text-accent font-semibold">{result === 'correct' ? 'Correct!' : 'Not quite!'}</p>
                    <p className="text-muted-foreground text-sm mt-1">{currentQuestion.explanation}</p>
                </CardContent>
             )}
         </Card>

        <div className="grid grid-cols-3 gap-4">
            {currentQuestion.options.map((option) => (
              <Lane
                key={option}
                option={option}
                onClick={() => handleAnswer(option)}
                disabled={gameState !== 'question'}
                result={result}
                answer={currentQuestion.answer}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
