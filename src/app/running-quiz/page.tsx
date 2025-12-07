
import PageWrapper from '@/components/page-wrapper';
import QuizRunnerClient from './components/quiz-runner-client';

export default function RunningQuizPage() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[80vh]">
      <QuizRunnerClient />
    </PageWrapper>
  );
}
