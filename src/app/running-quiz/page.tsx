import QuizRunnerClient from './components/quiz-runner-client';

export default function RunningQuizPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold font-display text-primary text-ink-fade">
          Running Quiz Adventure
        </h1>
      </div>
      <QuizRunnerClient />
    </div>
  );
}
