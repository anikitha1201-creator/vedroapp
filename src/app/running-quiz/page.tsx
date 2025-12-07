import PageWrapper from '@/components/page-wrapper';
import QuizRunnerClient from './components/quiz-runner-client';

export default function RunningQuizPage() {
  return (
    <PageWrapper>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-ink-fade">
          Running Quiz Adventure
        </h1>
        <p className="text-muted-foreground animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
          Race against time and prove your wisdom.
        </p>
      </div>
      <QuizRunnerClient />
    </PageWrapper>
  );
}
