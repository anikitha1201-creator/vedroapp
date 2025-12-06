import PageWrapper from '@/components/page-wrapper';
import ExperimentClientPage from './components/experiment-client-page';
import { Card, CardContent } from '@/components/ui/card';

export default function SandboxExperimentPage() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-center text-ink-fade">
        Sandbox Experiment
      </h1>
      <p className="text-center text-muted-foreground mb-8 animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
        Drag elements into the beaker to see what happens. The Alchemist will explain the results.
      </p>
      <Card className="w-full max-w-5xl mx-auto torch-flicker">
        <CardContent className="p-0 lg:p-2">
           <ExperimentClientPage />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
