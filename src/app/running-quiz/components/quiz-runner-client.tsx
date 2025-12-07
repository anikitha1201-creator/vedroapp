
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, Pause, Play, Repeat, Trophy, Zap } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
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
  {
    question: 'What is the largest mammal in the world?',
    options: ['Elephant', 'Blue Whale', 'Giraffe'],
    answer: 'Blue Whale',
  },
  {
    question: 'Who wrote the play "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen'],
    answer: 'William Shakespeare',
  }
];


// --- TYPES ---
type GameState = 'start' | 'playing' | 'question' | 'paused' | 'end';
type ResultState = 'correct' | 'incorrect' | null;


// --- GAME COMPONENTS ---

const Character = ({ lane, result }: { lane: number; result: ResultState; }) => {
  const lanePositions = ['-translate-x-[110%]', 'translate-x-0', 'translate-x-[110%]'];
  
  return (
    <div className={cn("absolute bottom-10 left-1/2 -ml-8 transition-transform duration-300 ease-in-out", lanePositions[lane])}>
       <div className={cn(
           "w-16 h-24 rounded-t-full bg-accent/80 flex items-center justify-center relative transition-all",
           result === 'correct' && 'animate-bounce',
           result === 'incorrect' && 'animate-shake'
        )}>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">V</div>
          {result === 'correct' && <div className="absolute -top-4 text-2xl">✨</div>}
          {result === 'incorrect' && <div className="absolute -top-4 text-2xl">💢</div>}
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
      isSelected && result === 'correct' && "border-accent bg-accent/20 gold-burst",
      isSelected && result === 'incorrect' && "border-destructive bg-destructive/20 red-ink-splash"
    )}
  >
    <span className="text-3xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform z-10">{option}</span>
  </div>
);


const Background = ({ speed }: { speed: number }) => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
            className="absolute inset-0 bg-repeat-x speed-lines-bg opacity-30"
            style={{
                animationDuration: `${10 / speed}s`
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
  const [timeToQuestion, setTimeToQuestion] = useState(5); // 5 seconds until next question

  const currentQuestion = useMemo(() => {
      const q = shuffledQuestions[questionIndex];
      // Ensure options are shuffled for presentation
      const options = [...q.options].sort(() => Math.random() - 0.5);
      return {...q, options};
  }, [shuffledQuestions, questionIndex]);

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeToQuestion <= 0) {
      setGameState('question');
      setTimeToQuestion(5 + Math.floor(Math.random()*2)); // 5-7 seconds
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
    setTimeToQuestion(5);
    setGameState('playing');
  };

  const handleAnswer = (selectedOption: string, laneIndex: number) => {
    if (gameState !== 'question') return;
    
    setCharacterLane(laneIndex);
    setSelectedAnswer(selectedOption);
    
    if (selectedOption === questions[questionIndex].answer) { // Check against original question object
      setResult('correct');
      setScore(prev => prev + (10 * speed));
      setSpeed(prev => Math.min(prev + 0.2, 3)); // Increase speed
    } else {
      setResult('incorrect');
      setScore(prev => Math.max(0, prev - 5)); // Penalty
      setSpeed(prev => Math.max(1, prev - 0.1)); // Slightly decrease speed
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
    }, 1500);
  };

  // --- RENDER LOGIC ---

  // Main Menu Screen
  if (gameState === 'start') {
    return (
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-[bounce-in_0.5s_ease-out_forwards]">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Running Quiz Adventure</CardTitle>
          <CardDescription>Answer questions by choosing the correct path!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} size="lg" className="wax-press">
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
      <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-[bounce-in_0.5s_ease-out_forwards]">
        <CardHeader>
          <Trophy className="h-16 w-16 mx-auto text-accent"/>
          <CardTitle className="text-3xl font-headline text-primary">Run Complete!</CardTitle>
          <CardDescription>Great job, scholar!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-foreground">{Math.floor(score)}</p>
          <Button onClick={startGame} size="lg" className="wax-press">
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
     <Card className="text-center max-w-lg mx-auto bg-card/80 backdrop-blur-sm animate-[bounce-in_0.5s_ease-out_forwards]">
       <CardHeader>
         <CardTitle className="text-3xl font-headline text-primary">Game Paused</CardTitle>
       </CardHeader>
       <CardContent>
         <Button onClick={() => setGameState('playing')} size="lg" className="wax-press">
           <Play className="mr-2"/>
           Resume
         </Button>
       </CardContent>
     </Card>
   );
 }

  const isAnswering = gameState === 'question' || result !== null;
  const isRunning = gameState === 'playing';

  return (
    <div className="relative w-full max-w-5xl h-[75vh] mx-auto p-4 rounded-lg bg-primary/70 shadow-2xl overflow-hidden flex flex-col burnt-edge">
        <Background speed={speed} />
      
        {/* HUD */}
        <div className="relative z-10 flex justify-between items-center mb-4 text-lg font-bold text-white">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                <Award size={20}/> 
                <span>Score: {Math.floor(score)}</span>
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
             {isRunning && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-7xl font-black font-headline animate-ping">{timeToQuestion}</div>}
            <Character lane={characterLane} result={result} />
        </div>
      
        {/* Question Overlay */}
        <div className={cn(
            "absolute inset-0 z-20 flex flex-col justify-center items-center p-8 bg-black/50 backdrop-blur-sm transition-opacity duration-500",
            isAnswering ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
             <Card className="text-center mb-6 bg-card/90 animate-[bounce-in_0.5s_ease-out_forwards] w-full max-w-2xl burnt-edge-pulse">
                <CardHeader>
                    <CardDescription>Question {questionIndex + 1}</CardDescription>
                    <CardTitle className="text-2xl">{questions[questionIndex].question}</CardTitle>
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
                <Progress value={(timeToQuestion / 5) * 100} className="w-1/2 mx-auto h-2 bg-white/20"/>
            </div>
        )}
    </div>
  );
}

