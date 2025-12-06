'use client';

import { useState, useCallback, ReactNode } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { generateExperimentExplanation } from '../actions';
import { Button } from '@/components/ui/button';
import { BookCopy, FlaskConical, Loader2, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// --- TYPES AND CONSTANTS ---

const ItemTypes = {
  ELEMENT: 'element',
};

type Item = {
  id: string;
  name: string;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'Tools';
};

type PlacedItem = Item & {
  left: number;
  top: number;
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

const REACTION_RULES: { reactants: string[]; result: string, animation: string }[] = [
    { reactants: ['hcl', 'naoh'], result: 'Neutralization reaction producing Salt (NaCl) and Water.', animation: 'fizz' },
    { reactants: ['cuso4', 'fe'], result: 'Displacement reaction producing Iron Sulfate (FeSO4) and Copper (Cu).', animation: 'displacement' },
    { reactants: ['agno3', 'nacl'], result: 'Precipitation reaction producing Silver Chloride (AgCl) precipitate.', animation: 'precipitate' },
    { reactants: ['sugar', 'burner'], result: 'Caramelization of sugar.', animation: 'caramel' },
    { reactants: ['zn', 'hcl'], result: 'Reaction producing Hydrogen gas and Zinc Chloride (ZnCl2).', animation: 'bubbles' },
    { reactants: ['battery', 'wire', 'bulb'], result: 'A complete electrical circuit, lighting the bulb.', animation: 'circuit' },
    { reactants: ['magnet', 'iron_nail'], result: 'The iron nail becomes temporarily magnetized.', animation: 'magnetize' },
    { reactants: ['plant', 'sunlight', 'water_bio', 'co2'], result: 'Photosynthesis, producing glucose and oxygen.', animation: 'glow' },
    { reactants: ['seed', 'water_bio', 'soil'], result: 'Germination of the seed into a sprout.', animation: 'sprout' },
    { reactants: ['plant', 'fertilizer'], result: 'The plant grows healthier and stronger.', animation: 'sparkle' },
];

// --- DRAG & DROP COMPONENTS ---

const InventoryItem = ({ item }: { item: Item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { id: item.id, name: item.name, category: item.category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn("p-2 rounded-md cursor-grab active:cursor-grabbing transition-all hover:scale-105 hover:shadow-lg bg-secondary/20 border-2 border-secondary/40 burnt-edge", isDragging && "opacity-50 ring-2 ring-accent")}
    >
      <p className="font-medium text-center text-secondary-foreground">{item.name}</p>
    </div>
  );
};

const PlacedItemComponent = ({ item }: { item: PlacedItem }) => {
    return (
        <div
            style={{ left: item.left, top: item.top }}
            className="absolute p-3 rounded-md bg-card/80 border border-border shadow-md"
        >
            <p className="font-medium text-center text-card-foreground">{item.name}</p>
        </div>
    );
};


// --- UI & LAYOUT COMPONENTS ---

const InventoryPanel = () => (
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
                {Object.entries(INVENTORY).map(([category, items]) => (
                    <TabsContent key={category} value={category} className="grid grid-cols-2 gap-3 mt-0">
                        {items.map((item) => (
                            <InventoryItem key={item.id} item={item} />
                        ))}
                    </TabsContent>
                ))}
            </div>
        </ScrollArea>
      </Tabs>
    </CardContent>
  </Card>
);

const ExperimentCanvas = ({ placedItems, onDrop }: { placedItems: PlacedItem[], onDrop: (item: Item, position: {x: number, y: number}) => void }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.ELEMENT,
        drop: (item: Item, monitor) => {
            const delta = monitor.getClientOffset();
            if (delta) {
                onDrop(item, { x: delta.x, y: delta.y });
            }
        },
    }), [onDrop]);

    return (
        <div ref={drop} className="relative lg:col-span-2 w-full h-[50vh] lg:h-full rounded-lg bg-cover bg-center bg-[url('https://www.transparenttextures.com/patterns/wood-table.png')] burnt-edge-pulse">
            {placedItems.map(item => (
                <PlacedItemComponent key={item.id} item={item}/>
            ))}
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

export default function ExperimentClientPage() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((item: Item, position: {x: number, y: number}) => {
    if (!placedItems.some((pi) => pi.id === item.id)) {
        // Adjusting for canvas position could be complex, for now place relative to viewport
        // A real implementation would use refs to get canvas bounds
        setPlacedItems((prev) => [...prev, { ...item, left: position.x - 400, top: position.y - 200 }]); // Adjustments are approximate
    }
  }, [placedItems]);

  const checkForReaction = (currentItems: PlacedItem[]) => {
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
    if (placedItems.length < 2) {
      toast({
        title: 'Not enough elements!',
        description: 'Drag at least two elements onto the canvas to see a reaction.',
        variant: 'destructive',
      });
      return;
    }

    const reaction = checkForReaction(placedItems);
    
    if (!reaction) {
        toast({
            title: 'No Reaction',
            description: 'These elements do not seem to react. The Alchemist ponders...',
        });
        return;
    }

    setIsLoading(true);
    setExplanation('');

    const experimentDescription = `A student has combined ${placedItems.map(i => i.name).join(', ')}. The expected result is: ${reaction.result}.`;

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
    setPlacedItems([]);
    setExplanation('');
    setIsLoading(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-6 min-h-[80vh]">
        <InventoryPanel />

        <div className="lg:col-span-2 flex flex-col gap-6">
          <ExperimentCanvas placedItems={placedItems} onDrop={handleDrop} />

          <div className="flex gap-4 justify-center">
            <Button onClick={handleMix} disabled={isLoading || placedItems.length < 2}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              Trigger Reaction
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw />
              Clear Canvas
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
                     <Alert className="animate-[ink-fade-in_1s_ease-out_forwards] opacity-0 border-0 p-0">
                        <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
                            {explanation}
                        </AlertDescription>
                    </Alert>
                )}
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
