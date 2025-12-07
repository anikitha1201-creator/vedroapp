import PageWrapper from '@/components/page-wrapper';
import ExperimentClientPage from './components/experiment-client-page';

export default function SandboxExperimentPage() {
  return (
    <PageWrapper>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-ink-fade">
          The Alchemist's Sandbox
        </h1>
        <p className="text-muted-foreground animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
          Combine the elements of science and witness the magic of creation.
        </p>
      </div>
      <ExperimentClientPage />
    </PageWrapper>
  );
}
