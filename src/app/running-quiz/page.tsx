import PageWrapper from '@/components/page-wrapper';
import QuizRunnerClient from './components/quiz-runner-client';

export default function RunningQuizPage() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-center text-ink-fade">
        Running Quiz Game
      </h1>
       <p className="text-center text-muted-foreground mb-8 animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
        Race against time and prove your wisdom.
      </p>
      <QuizRunnerClient />
    </PageWrapper>
  );
}
