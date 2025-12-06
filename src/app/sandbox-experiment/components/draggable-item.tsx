'use client';

type DraggableItemProps = {
  item: {
    id: string;
    name: string;
    description: string;
  };
};

export default function DraggableItem({ item }: DraggableItemProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex flex-col items-center p-3 rounded-lg bg-primary/10 border border-primary/20 cursor-grab active:cursor-grabbing transition-all hover:bg-primary/20 hover:scale-105"
    >
      <div className="text-lg font-bold font-headline text-primary">{item.name}</div>
      <div className="text-xs text-muted-foreground">{item.description}</div>
    </div>
  );
}
