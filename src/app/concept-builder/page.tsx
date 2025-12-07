
import ConceptBuilderClient from './components/concept-builder-client';

export default function ConceptBuilderPage() {
  return (
    <>
      <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-center text-ink-fade">
        Concept Builder
      </h1>
      <p className="text-center text-muted-foreground mb-8 animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
        Assemble the puzzle of knowledge, piece by piece.
      </p>
      <ConceptBuilderClient />
    </>
  );
}
