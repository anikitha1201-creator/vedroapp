'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CheckCircle, RefreshCw, Wand2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Tile = {
  id: string;
  text: string;
  type: 'input' | 'output';
};

const CONCEPT_TILES: Tile[] = [
  { id: 'sunlight', text: 'Sunlight', type: 'input' },
  { id: 'co2', text: 'Carbon Dioxide', type: 'input' },
  { id: 'glucose', text: 'Glucose', type: 'output' },
  { id: 'water', text: 'Water', type: 'input' },
  { id: 'oxygen', text: 'Oxygen', type: 'output' },
];

const CORRECT_INPUTS = ['sunlight', 'co2', 'water'];
const CORRECT_OUTPUTS = ['glucose', 'oxygen'];

const DraggableTile = ({ tile, onDragStart }: { tile: Tile; onDragStart: (e: React.DragEvent<HTMLDivElement>, tile: Tile) => void }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, tile)}
    className="p-3 rounded-md cursor-grab active:cursor-grabbing transition-all hover:scale-105 hover:shadow-md bg-secondary/20 border-2 border-secondary/40 burnt-edge"
  >
    <p className="font-medium text-center text-secondary-foreground">{tile.text}</p>
  </div>
);

const DropZone = ({ type, tiles, onDrop, onDragOver, isGlowing }: { type: 'input' | 'output'; tiles: Tile[]; onDrop: (e: React.DragEvent<HTMLDivElement>, type: 'input' | 'output') => void; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; isGlowing: boolean }) => (
  <div className="flex-1 min-h-[200px] bg-primary/5 rounded-lg p-4 border-2 border-dashed border-primary/20 transition-all duration-300"
    onDrop={(e) => onDrop(e, type)}
    onDragOver={onDragOver}
  >
    <h3 className="text-lg font-headline text-center text-muted-foreground mb-4">{type === 'input' ? 'Reactants' : 'Products'}</h3>
    <div className={cn("min-h-[150px] p-2 rounded-md bg-background/50 flex flex-col gap-2 transition-all", isGlowing && 'shadow-[0_0_30px_5px_hsl(var(--accent))]')}>
      {tiles.length === 0 && <p className="text-center text-muted-foreground/50 m-auto">Drop tiles here</p>}
      {tiles.map(tile => (
        <div key={tile.id} className="p-2 rounded-md bg-card/80 border border-border">
          <p className="font-medium text-center text-card-foreground">{tile.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function ConceptBuilderClient() {
  const [availableTiles, setAvailableTiles] = useState<Tile[]>(CONCEPT_TILES);
  const [inputTiles, setInputTiles] = useState<Tile[]>([]);
  const [outputTiles, setOutputTiles] = useState<Tile[]>([]);
  const [draggedTile, setDraggedTile] = useState<Tile | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [glow, setGlow] = useState(false);

  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tile: Tile) => {
    setDraggedTile(tile);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, zone: 'input' | 'output') => {
    e.preventDefault();
    if (!draggedTile) return;

    if (draggedTile.type === zone) {
      if (zone === 'input') {
        setInputTiles(prev => [...prev, draggedTile]);
      } else {
        setOutputTiles(prev => [...prev, draggedTile]);
      }
      setAvailableTiles(prev => prev.filter(t => t.id !== draggedTile.id));
    } else {
      toast({
        title: 'Incorrect Zone',
        description: `This is not the correct zone for ${draggedTile.text}.`,
        variant: 'destructive',
      });
    }
    setDraggedTile(null);
  };

  const checkAnswer = () => {
    const inputIds = inputTiles.map(t => t.id).sort();
    const outputIds = outputTiles.map(t => t.id).sort();
    
    const isInputsCorrect = JSON.stringify(inputIds) === JSON.stringify(CORRECT_INPUTS.sort());
    const isOutputsCorrect = JSON.stringify(outputIds) === JSON.stringify(CORRECT_OUTPUTS.sort());
    
    if (isInputsCorrect && isOutputsCorrect) {
      setResult('correct');
      setGlow(true);
      setTimeout(() => setGlow(false), 2000);
    } else {
      setResult('incorrect');
    }
  };
  
  const resetGame = () => {
    setAvailableTiles(CONCEPT_TILES);
    setInputTiles([]);
    setOutputTiles([]);
    setResult(null);
    setGlow(false);
  };

  return (
    <div className="space-y-8">
      <Alert className="torch-flicker">
        <Wand2 className="h-4 w-4" />
        <AlertTitle className="font-headline">The Photosynthesis Equation</AlertTitle>
        <AlertDescription>
          Drag the components to the correct side of the chemical equation. What does a plant need to live, and what does it produce?
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Tiles */}
        <div className="md:col-span-1 p-4 bg-card rounded-lg burnt-edge">
          <h3 className="text-lg font-headline text-center text-primary mb-4">Available Components</h3>
          <div className="space-y-3">
            {availableTiles.map(tile => (
              <DraggableTile key={tile.id} tile={tile} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="md:col-span-2 p-4 bg-card rounded-lg burnt-edge space-y-4">
           <div className="flex items-center gap-4">
              <DropZone type="input" tiles={inputTiles} onDrop={handleDrop} onDragOver={handleDragOver} isGlowing={glow} />
              <ArrowRight className="h-10 w-10 text-primary shrink-0"/>
              <DropZone type="output" tiles={outputTiles} onDrop={handleDrop} onDragOver={handleDragOver} isGlowing={glow} />
            </div>
        </div>
      </div>
      
      {/* Controls and Result */}
      <div className="flex flex-col items-center gap-4">
        <Button onClick={checkAnswer} disabled={availableTiles.length > 0 || result === 'correct'}>
            <CheckCircle />
            Check My Work
        </Button>
        <Button onClick={resetGame} variant="outline">
            <RefreshCw />
            Start Over
        </Button>
        {result && (
             <Alert className={cn("max-w-md animate-[ink-fade-in_0.5s_ease-out_forwards]", result === 'correct' ? 'border-accent' : 'border-destructive')}>
                {result === 'correct' ? <CheckCircle className="h-4 w-4 text-accent" /> : <XCircle className="h-4 w-4 text-destructive" />}
                <AlertTitle className={cn("font-headline", result === 'correct' ? 'text-accent' : 'text-destructive')}>
                    {result === 'correct' ? 'Brilliantly Done!' : 'Not Quite Right'}
                </AlertTitle>
                <AlertDescription>
                    {result === 'correct' ? 'You have correctly assembled the equation for photosynthesis! A fundamental process of life.' : 'A piece is out of place. Re-examine the roles of each component and try again.'}
                </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
