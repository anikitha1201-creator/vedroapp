
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, X, Trophy, Repeat, Play, Pause, Award, Zap } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

// --- DATA ---
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
  },
  {
    question: 'What force keeps us on the ground?',
    options: ['Magnetism', 'Gravity', 'Friction'],
    answer: 'Gravity',
  },
];


// --- TYPES ---
type GameState = 'start' | 'playing' | 'question' | 'paused' | 'end';
type ResultState = 'correct' | 'incorrect' | null;


// --- GAME COMPONENTS ---

const Character = ({ lane, isRunning }: { lane: number; isRunning: boolean; }) => {
  const lanePositions = ['-translate-x-[110%]', 'translate-x-0', 'translate-x-[110%]'];
  return (
    <div className={cn("absolute bottom-4 left-1/2 -ml-8 transition-transform duration-300 ease-in-out", lanePositions[lane])}>
       <div className={cn("w-16 h-24 rounded-t-full bg-accent/80 flex items-center justify-center", isRunning ? 'animate-bounce' : '')}>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">V</div>
       </div>
    </div>
  );
};


const Lane = ({ option, onClick, result, disabled, isSelected }: { option: string; onClick: () => void; result: ResultState; disabled: boolean; isSelected: boolean; }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={cn(
      "relative flex items-center justify-center h-40 p-4 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer group",
      "border-white/20 bg-black/10 hover:border-white/50 hover:bg-black/20",
      disabled && "cursor-not-allowed opacity-60",
      isSelected && result === 'correct' && "border-green-400 bg-green-500/20 gold-burst",
      isSelected && result === 'incorrect' && "border-red-500 bg-red-500/20 incorrect-penalty"
    )}
  >
    <span className="text-3xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform z-10">{option}</span>
  </div>
);


const Background = ({ speed }: { speed: number }) => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"
            style={{
                animation: `speed-lines ${10 / speed}s linear infinite`
            }}
        ></div>
         <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-primary/80 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/3 bg-primary/90"></div>
    </div>
);


// --- MAIN GAME LOGIC ---

export default function QuizRunnerClient() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Player state
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [result, setResult] = useState<ResultState>(null);
  const [characterLane, setCharacterLane] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
  const [timeToQuestion, setTimeToQuestion] = useState(7); // 7 seconds until next question

  const currentQuestion = useMemo(() => shuffledQuestions[questionIndex], [shuffledQuestions, questionIndex]);

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeToQuestion <= 0) {
      setGameState('question');
      setTimeToQuestion(7); // Reset timer
      return;
    }

    const timer = setInterval(() => {
      setTimeToQuestion(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeToQuestion]);

  // --- ACTIONS ---
  const startGame = () => {
    // Shuffle questions for a new game
    setShuffledQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
    setQuestionIndex(0);
    setScore(0);
    setResult(null);
    setCharacterLane(1);
    setSpeed(1);
    setTimeToQuestion(7);
    setGameState('playing');
  };

  const handleAnswer = (selectedOption: string, laneIndex: number) => {
    if (gameState !== 'question') return;
    
    setCharacterLane(laneIndex);
    setSelectedAnswer(selectedOption);
    
    if (selectedOption === currentQuestion.answer) {
      setResult('correct');
      setScore(prev => prev + 100);
      setSpeed(prev => Math.min(prev + 0.1, 2)); // Slightly increase speed
    } else {
      setResult('incorrect');
      setScore(prev => Math.max(0, prev - 50)); // Penalty
    }

    // Wait for animation, then continue or end game
    setTimeout(() => {
      if (questionIndex + 1 < shuffledQuestions.length) {
        setQuestionIndex(prev => prev + 1);
        setResult(null);
        setSelectedAnswer(null);
        setGameState('playing');
      } else {
        setGameState('end');
      }
    }, 2000);
  };

  // --- RENDER LOGIC ---

  // Main Menu Screen
  if (gameState === 'start') {
    return (
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-bounce-in">
        <CardHeader>
          <CardTitle className="text-3xl text-primary-foreground">Running Quiz</CardTitle>
          <CardDescription className="text-primary-foreground/80">Answer questions by choosing the correct path!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} size="lg" className="wax-press bg-accent hover:bg-accent/90 text-accent-foreground">
            <Play className="mr-2"/>
            Start Running
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Game Over Screen
  if (gameState === 'end') {
     return (
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-bounce-in">
        <CardHeader>
          <Trophy className="h-16 w-16 mx-auto text-accent"/>
          <CardTitle className="text-3xl text-primary-foreground">Run Complete!</CardTitle>
          <CardDescription className="text-primary-foreground/80">Great job, scholar!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-white">{score}</p>
          <Button onClick={startGame} size="lg" className="wax-press bg-accent hover:bg-accent/90 text-accent-foreground">
            <Repeat className="mr-2"/>
            Run Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Game is Paused
  if (gameState === 'paused') {
    return (
     <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-bounce-in">
       <CardHeader>
         <CardTitle className="text-3xl text-primary-foreground">Game Paused</CardTitle>
       </CardHeader>
       <CardContent>
         <Button onClick={() => setGameState('playing')} size="lg" className="wax-press bg-accent hover:bg-accent/90 text-accent-foreground">
           <Play className="mr-2"/>
           Resume
         </Button>
       </CardContent>
     </Card>
   );
 }

  const isAnswering = gameState === 'question' || result !== null;

  // Main Game Screen
  return (
    <div className="relative w-full max-w-5xl h-[70vh] mx-auto p-4 rounded-lg bg-primary/70 shadow-2xl overflow-hidden flex flex-col">
        <Background speed={speed} />
      
        {/* HUD */}
        <div className="relative z-10 flex justify-between items-center mb-4 text-lg font-bold text-white">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                <Award size={20}/> 
                <span>Score: {score}</span>
            </div>
             <Button variant="ghost" size="icon" onClick={() => setGameState('paused')}>
                <Pause />
            </Button>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                <Zap size={20}/>
                <span>Speed: x{speed.toFixed(1)}</span>
            </div>
        </div>

        {/* Runner Track */}
        <div className="relative flex-1 w-full flex flex-col justify-end">
            <Character lane={characterLane} isRunning={gameState === 'playing'} />
        </div>
      
        {/* Question Overlay */}
        <div className={cn(
            "absolute inset-0 z-20 flex flex-col justify-center items-center p-8 bg-black/50 backdrop-blur-sm transition-opacity duration-500",
            isAnswering ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
             <Card className="text-center mb-6 bg-card/90 animate-bounce-in w-full max-w-2xl">
                <CardHeader>
                    <CardDescription>Question {questionIndex + 1}</CardDescription>
                    <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                </CardHeader>
             </Card>

            <div className="w-full max-w-4xl grid grid-cols-3 gap-4">
                {currentQuestion.options.map((option, index) => (
                <Lane
                    key={index}
                    option={option}
                    onClick={() => handleAnswer(option, index)}
                    disabled={result !== null}
                    result={result}
                    isSelected={selectedAnswer === option}
                />
                ))}
            </div>
        </div>

        {/* Progress to next question */}
        { gameState === 'playing' && (
             <div className="relative z-10 mt-4">
                <p className="text-center text-white/80 text-sm mb-1">Next question in...</p>
                <Progress value={(timeToQuestion / 7) * 100} className="w-1/2 mx-auto h-2 bg-white/20"/>
            </div>
        )}
    </div>
  );
}
