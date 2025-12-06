'use client';

import { useState, useCallback, ReactNode } from 'react';
import { generateExperimentExplanation } from '../actions';
import { Button } from '@/components/ui/button';
import { BookCopy, FlaskConical, Loader2, Sparkles, Wand2, RefreshCw, Plus, Equal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Beaker from './beaker'; // Use the Beaker component
import DraggableItem from './draggable-item'; // Use the DraggableItem component

// --- TYPES AND CONSTANTS ---

type Item = {
  id: string;
  name: string;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'Tools';
};

const INVENTORY: Record<string, Item[]> = {
  Chemistry: [
    { id: 'hcl', name: 'HCl', category: 'Chemistry' },
    { id: 'naoh', name: 'NaOH', category: 'Chemistry' },
    { id: 'cuso4', name: 'CuSO4', category: 'Chemistry' },
    { id: 'zn', name: 'Zn', category: 'Chemistry' },
    { id: 'agno3', name: 'AgNO3', category: 'Chemistry' },
    { id: 'nacl', name: 'NaCl', category: 'Chemistry' },
    { id: 'fe', name: 'Fe', category: 'Chemistry' },
    { id: 'mg', name: 'Mg', category: 'Chemistry' },
    { id: 'sugar', name: 'Sugar', category: 'Chemistry' },
    { id: 'water_chem', name: 'Water', category: 'Chemistry' },
  ],
  Physics: [
    { id: 'battery', name: 'Battery', category: 'Physics' },
    { id: 'wire', name: 'Wire', category: 'Physics' },
    { id: 'bulb', name: 'Bulb', category: 'Physics' },
    { id: 'motor', name: 'Motor', category: 'Physics' },
    { id: 'switch', name: 'Switch', category: 'Physics' },
    { id: 'magnet', name: 'Magnet', category: 'Physics' },
    { id: 'iron_nail', name: 'Iron Nail', category: 'Physics' },
  ],
  Biology: [
    { id: 'plant', name: 'Plant', category: 'Biology' },
    { id: 'sunlight', name: 'Sunlight', category: 'Biology' },
    { id: 'water_bio', name: 'Water', category: 'Biology' },
    { id: 'co2', name: 'CO2 Bubble', category: 'Biology' },
    { id: 'seed', name: 'Seed', category: 'Biology' },
    { id: 'fertilizer', name: 'Fertilizer', category: 'Biology' },
    { id: 'soil', name: 'Soil', category: 'Biology' },
  ],
  Tools: [
    { id: 'beaker', name: 'Beaker', category: 'Tools' },
    { id: 'test_tube', name: 'Test Tube', category: 'Tools' },
    { id: 'burner', name: 'Burner', category: 'Tools' },
    { id: 'container', name: 'Container', category: 'Tools' },
  ],
};

const REACTION_RULES: { reactants: string[]; result: string, equation: string, animation: string }[] = [
    { reactants: ['hcl', 'naoh'], result: 'Neutralization reaction producing Salt (NaCl) and Water.', equation: 'HCl + NaOH \u2192 NaCl + H\u2082O', animation: 'fizz' },
    { reactants: ['cuso4', 'fe'], result: 'Displacement reaction producing Iron Sulfate (FeSO4) and Copper (Cu).', equation: 'CuSO\u2084 + Fe \u2192 FeSO\u2084 + Cu', animation: 'displacement' },
    { reactants: ['agno3', 'nacl'], result: 'Precipitation reaction producing Silver Chloride (AgCl) precipitate.', equation: 'AgNO\u2083 + NaCl \u2192 AgCl\u2193 + NaNO\u2083', animation: 'precipitate' },
    { reactants: ['sugar', 'burner'], result: 'Caramelization of sugar.', equation: 'C\u2081\u2082H\u2082\u2082O\u2081\u2081 + Heat \u2192 Caramel', animation: 'caramel' },
    { reactants: ['zn', 'hcl'], result: 'Reaction producing Hydrogen gas and Zinc Chloride (ZnCl2).', equation: 'Zn + 2HCl \u2192 ZnCl\u2082 + H\u2082\u2191', animation: 'bubbles' },
    { reactants: ['battery', 'wire', 'bulb'], result: 'A complete electrical circuit, lighting the bulb.', equation: 'Circuit Complete!', animation: 'circuit' },
    { reactants: ['magnet', 'iron_nail'], result: 'The iron nail becomes temporarily magnetized.', equation: 'Magnetism Transfer', animation: 'magnetize' },
    { reactants: ['plant', 'sunlight', 'water_bio', 'co2'], result: 'Photosynthesis, producing glucose and oxygen.', equation: '6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082', animation: 'glow' },
    { reactants: ['seed', 'water_bio', 'soil'], result: 'Germination of the seed into a sprout.', equation: 'Seed + Water + Soil \u2192 Sprout', animation: 'sprout' },
    { reactants: ['plant', 'fertilizer'], result: 'The plant grows healthier and stronger.', equation: 'Plant + Nutrients \u2192 Growth', animation: 'sparkle' },
];

// --- UI & LAYOUT COMPONENTS ---

const InventoryPanel = ({ items }: { items: Record<string, Item[]> }) => (
  <Card className="lg:col-span-1 h-full flex flex-col">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Wand2 className="text-accent" /> Elemental Scrolls
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 overflow-hidden">
      <Tabs defaultValue="Chemistry" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Chemistry">Chem</TabsTrigger>
          <TabsTrigger value="Physics">Physics</TabsTrigger>
          <TabsTrigger value="Biology">Bio</TabsTrigger>
          <TabsTrigger value="Tools">Tools</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 mt-2">
            <div className="pr-4">
                {Object.entries(items).map(([category, categoryItems]) => (
                    <TabsContent key={category} value={category} className="grid grid-cols-2 gap-3 mt-0">
                        {categoryItems.map((item) => (
                            <DraggableItem key={item.id} item={item} />
                        ))}
                    </TabsContent>
                ))}
            </div>
        </ScrollArea>
      </Tabs>
    </CardContent>
  </Card>
);

const ReactionDisplay = ({ items, reaction }: { items: Item[], reaction: {equation: string} | null }) => (
    <Card className="flex items-center justify-center min-h-[100px] bg-primary/5 burnt-edge">
        <div className="flex items-center gap-2 text-2xl font-headline text-primary p-4">
            {reaction ? (
                <span className="text-accent animate-pulse">{reaction.equation}</span>
            ) : items.length > 0 ? (
                 items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {index < items.length -1 && <Plus className="text-muted-foreground"/>}
                    </div>
                ))
            ) : (
                <span className="text-muted-foreground">The Alchemist's Workspace</span>
            )}
        </div>
    </Card>
);

// --- MAIN PAGE COMPONENT ---

export default function ExperimentClientPage() {
  const [inventory, setInventory] = useState<Record<string, Item[]>>(INVENTORY);
  const [beakerContents, setBeakerContents] = useState<Item[]>([]);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reaction, setReaction] = useState<{ reactants: string[]; result: string, equation: string, animation: string } | null>(null);
  const { toast } = useToast();

  const handleDrop = (item: Item) => {
    if (!beakerContents.some((i) => i.id === item.id)) {
      setBeakerContents((prev) => [...prev, item]);
      // Remove from inventory
      setInventory(prev => {
        const newInventory = { ...prev };
        newInventory[item.category] = newInventory[item.category].filter(invItem => invItem.id !== item.id);
        return newInventory;
      });
    } else {
        toast({
            title: 'Already Added',
            description: `${item.name} is already in the beaker.`,
        });
    }
  };

  const checkForReaction = (currentItems: Item[]) => {
    const currentItemIds = new Set(currentItems.map(item => item.id));

    for (const rule of REACTION_RULES) {
        const ruleReactants = new Set(rule.reactants);
        if (ruleReactants.size === currentItemIds.size && [...ruleReactants].every(id => currentItemIds.has(id))) {
            return rule;
        }
    }
    return null;
  };

  const handleMix = async () => {
    if (beakerContents.length < 2) {
      toast({
        title: 'Not enough elements!',
        description: 'Drag at least two elements into the beaker to see a reaction.',
        variant: 'destructive',
      });
      return;
    }

    const foundReaction = checkForReaction(beakerContents);
    setReaction(foundReaction);
    
    if (!foundReaction) {
        toast({
            title: 'No Reaction',
            description: 'These elements do not seem to react. The Alchemist ponders...',
        });
        return;
    }

    setIsLoading(true);
    setExplanation('');

    const experimentDescription = `A student has combined ${beakerContents.map(i => i.name).join(', ')}. The reaction is: ${foundReaction.equation}. The result is: ${foundReaction.result}.`;

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
    setInventory(INVENTORY);
    setBeakerContents([]);
    setExplanation('');
    setReaction(null);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-6 min-h-[80vh]">
      <InventoryPanel items={inventory} />

      <div className="lg:col-span-2 flex flex-col gap-6">
        
        <ReactionDisplay items={beakerContents} reaction={reaction} />

        <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <Beaker contents={beakerContents} onDrop={handleDrop} />
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleMix} disabled={isLoading || beakerContents.length < 2}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Trigger Reaction
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RefreshCw />
            Clear Beaker
          </Button>
        </div>

        {(isLoading || explanation) && (
          <Card className="min-h-[150px] torch-flicker">
              <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                      <BookCopy /> The Alchemist's Scroll
                    </CardTitle>
              </CardHeader>
              <CardContent>
              {isLoading && !explanation ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse [animation-delay:0.4s]"></div>
                      <span className="ml-2">The Alchemist is transcribing the results...</span>
                  </div>
              ): (
                    <div className="prose prose-sm dark:prose-invert max-w-none animate-[ink-fade-in_1s_ease-out_forwards] opacity-0"
                         dangerouslySetInnerHTML={{ __html: explanation }} />
              )}
              </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
