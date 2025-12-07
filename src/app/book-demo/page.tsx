import AncientBook, { AnimationStyleInjector } from '@/components/ancient-book';
import PageWrapper from '@/components/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const samplePages = [
  // Page 1
  <div key="1" className="text-ink-fade">
    <h2 className="font-headline text-2xl text-primary mb-4">Chapter I: The Spark of Inquiry</h2>
    <p>In the quiet halls of the Vedro Academy, where dust motes danced in the torchlight, a new scholar began their journey. The air, thick with the scent of old parchment and flickering wax, held secrets of ages past.</p>
    <p className="mt-4">The first lesson was not of science or history, but of a principle far more fundamental: the courage to ask "Why?"</p>
  </div>,
  // Page 2
  <div key="2">
    <h3 className="font-headline text-xl text-primary mb-3">The Concept Builder</h3>
    <p>The scholar was first led to a chamber containing the Concept Builder. Here, fragments of knowledge lay scattered like runes. The task was to assemble them, to see the hidden equations that bind the world together.</p>
    <p className="mt-4 text-sm text-muted-foreground">"True understanding," the master whispered, "is not in knowing the pieces, but in seeing how they connect."</p>
  </div>,
  // Page 3
  <div key="3">
    <h3 className="font-headline text-xl text-primary mb-3">The Alchemist's Sandbox</h3>
    <p>Next was the Sandbox, a place of bubbling beakers and shimmering powders. It was a realm of creation and transformation, where elements combined in dazzling displays of light and sound. Every mixture was a question posed to nature itself.</p>
  </div>,
  // Page 4
  <div key="4">
      <p>The wise Alchemist would appear in a puff of smoke, his voice like the crinkling of old scrolls, to explain the wonders that had transpired. "Even in failure, there is a lesson," he would say, his eyes twinkling.</p>
  </div>,
  // Page 5
  <div key="5">
      <h2 className="font-headline text-2xl text-primary mb-4">Chapter II: The Endless Path</h2>
      <p>The final trial was the Running Quiz Adventure, a path that stretched into infinity, paved with questions. To run was to learn; to answer was to advance. With each correct step, the world rushed by faster, a blur of gold and light.</p>
  </div>,
  // Page 6
  <div key="6">
      <p>The journey of a Vedro scholar is endless, for the library of knowledge has no final page. Turn the page, and let your own chapter begin.</p>
  </div>,
];


export default function BookDemoPage() {
  return (
    <PageWrapper>
      <AnimationStyleInjector />
      <h1 className="text-4xl font-bold font-headline text-primary mb-12 text-center text-ink-fade">
        The Book of Vedro
      </h1>
      <AncientBook pages={samplePages} />
    </PageWrapper>
  );
}
