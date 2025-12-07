
import PageWrapper from '@/components/page-wrapper';
import QuizRunnerClient from './components/quiz-runner-client';

export default function RunningQuizPage() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold font-headline text-primary mb-8 text-center text-ink-fade">
          Running Quiz Adventure
        </h1>
      <QuizRunnerClient />
    </PageWrapper>
  );
}

