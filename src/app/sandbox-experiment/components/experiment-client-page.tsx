'use client';

import { useState } from 'react';
import DraggableItem from './draggable-item';
import Beaker from './beaker';
import { generateExperimentExplanation } from '../actions';
import { Button } from '@/components/ui/button';
import { BookCopy, FlaskConical, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const availableElements = [
  { id: 'hcl', name: 'HCl', description: 'Hydrochloric Acid' },
  { id: 'naoh', name: 'NaOH', description: 'Sodium Hydroxide' },
  { id: 'battery', name: 'Battery', description: 'Power Source' },
  { id: 'wire', name: 'Wire', description: 'Conductor' },
  { id: 'bulb', name: 'Bulb', description: 'Light Source' },
  { id: 'plant', name: 'Plant', description: 'A green sprout' },
  { id: 'sunlight', name: 'Sunlight', description: 'Rays of light' },
  { id: 'water', name: 'Water', description: 'H₂O' },
];

type Element = typeof availableElements[0];

export default function ExperimentClientPage() {
  const [beakerContents, setBeakerContents] = useState<Element[]>([]);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDrop = (item: Element) => {
    if (!beakerContents.some((el) => el.id === item.id)) {
      setBeakerContents((prev) => [...prev, item]);
    }
  };

  const handleMix = async () => {
    if (beakerContents.length < 2) {
      toast({
        title: 'Not enough elements!',
        description: 'Add at least two elements to the beaker to see a reaction.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setExplanation('');

    const experimentDescription = `A student mixed the following items: ${beakerContents
      .map((el) => el.name)
      .join(', ')}.`;

    const result = await generateExperimentExplanation(experimentDescription);

    if (result.success) {
      setExplanation(result.explanation);
    } else {
      toast({
        title: 'The Alchemist is puzzled.',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setBeakerContents([]);
    setExplanation('');
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-6 min-h-[70vh]">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 className="text-accent"/> Elements</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row lg:flex-col flex-wrap gap-4 overflow-y-auto">
          {availableElements.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <Beaker contents={beakerContents} onDrop={handleDrop} />

        <div className="flex gap-4 justify-center">
          <Button onClick={handleMix} disabled={isLoading || beakerContents.length < 2}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            Mix Elements
          </Button>
          <Button onClick={handleReset} variant="outline">
            <FlaskConical />
            Reset Beaker
          </Button>
        </div>

        {explanation && (
          <Alert className="animate-[ink-fade-in_1s_ease-out_forwards] opacity-0 torch-flicker">
            <BookCopy className="h-4 w-4" />
            <AlertTitle className="font-headline text-lg">The Alchemist Explains</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert">
              {explanation}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
