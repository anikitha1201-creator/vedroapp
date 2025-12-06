'use client';

import { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Element = { id: string; name: string, description: string };

type BeakerProps = {
  contents: Element[];
  onDrop: (item: Element) => void;
};

export default function Beaker({ contents, onDrop }: BeakerProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const item = JSON.parse(e.dataTransfer.getData('application/json'));
    onDrop(item);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center min-h-[250px] rounded-lg border-2 border-dashed bg-card/50 transition-all duration-300',
        isOver ? 'border-accent bg-accent/10' : 'border-primary/20'
      )}
    >
      <div className="absolute inset-4 flex flex-col items-center justify-center text-center p-4">
        <FlaskConical className={cn('h-16 w-16 mb-4 transition-transform duration-300', isOver ? 'scale-110 text-accent' : 'text-primary/30')} />
        {contents.length === 0 ? (
          <p className="text-muted-foreground">Drag elements here to mix</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {contents.map((item) => (
              <Badge key={item.id} variant="secondary" className="text-base">
                {item.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
