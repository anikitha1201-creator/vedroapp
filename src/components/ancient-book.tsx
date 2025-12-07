'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AncientBookProps {
  pages: ReactNode[];
  className?: string;
}

/**
 * An AncientBook component that displays content in a book-like interface
 * with page-turning animations.
 * @param pages - An array of ReactNodes, where each node is the content for one page.
 */
export default function AncientBook({ pages, className }: AncientBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState<null | 'forward' | 'backward'>(null);

  // The total number of spreads in the book. A spread consists of two pages.
  const spreadCount = Math.ceil(pages.length / 2);

  const handleTurnPage = (direction: 'forward' | 'backward') => {
    if (isTurning) return;

    if (direction === 'forward' && currentPage < spreadCount - 1) {
      setIsTurning('forward');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTurning(null);
      }, 700); // Animation duration
    } else if (direction === 'backward' && currentPage > 0) {
      setIsTurning('backward');
      // To animate backward, we first need to instantly go to the previous page state
      // and then apply the reverse animation.
      setCurrentPage(currentPage - 1);
      setTimeout(() => {
        setIsTurning(null);
      }, 700);
    }
  };

  return (
    <div className={cn("relative w-full max-w-4xl aspect-[2/1.2] mx-auto", className)}>
      <div className="relative w-full h-full [perspective:2000px]">
        {/* Render all page spreads and control their visibility and z-index */}
        {Array.from({ length: spreadCount }).map((_, i) => {
          const isCurrent = i === currentPage;
          const isPrevious = i < currentPage;

          const getAnimationClass = () => {
            if (isTurning === 'forward' && i === currentPage - 1) {
              return 'animate-turn-page-forward';
            }
            if (isTurning === 'backward' && i === currentPage) {
               // We set the initial state to already be flipped, then animate back
              return 'animate-turn-page-backward';
            }
            return '';
          };

          return (
            <div
              key={i}
              className={cn(
                'absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out',
                '[transform-style:preserve-3d]',
                isCurrent && !isTurning ? 'z-10' : 'z-0',
                isPrevious ? 'z-0' : 'z-10',
                isPrevious && i !== currentPage - 1 ? '[transform:perspective(1000px)_rotateY(-180deg)]' : '',
                getAnimationClass()
              )}
              style={{
                zIndex: spreadCount - Math.abs(currentPage - i),
                animationFillMode: 'forwards',
                animationDuration: '0.7s',
              }}
            >
              {/* This is the page spread container */}
              <div className="absolute w-full h-full flex">
                {/* Left Page (Back of the turning page) */}
                <div className="w-1/2 h-full bg-background/90 text-foreground p-8 lg:p-12 border-r border-border/30 burnt-edge torch-flicker [transform:rotateY(180deg)] [backface-visibility:hidden]">
                   <div className="[transform:rotateY(180deg)]">{pages[i * 2 - 1]}</div>
                </div>
                {/* Right Page (Front of the turning page) */}
                <div className="w-1/2 h-full bg-background/90 text-foreground p-8 lg:p-12 border-l border-border/30 burnt-edge torch-flicker [backface-visibility:hidden]">
                  {pages[i * 2]}
                </div>
              </div>
            </div>
          );
        })}

        {/* Static background pages */}
         <div className="absolute top-0 left-0 w-1/2 h-full bg-background/80 burnt-edge torch-flicker p-8 lg:p-12">
            {currentPage > 0 && pages[(currentPage - 1) * 2]}
         </div>

      </div>

      {/* Navigation Controls */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8">
        <Button onClick={() => handleTurnPage('backward')} disabled={currentPage === 0 || isTurning !== null} className="wax-press">
          <ArrowLeft />
          Previous Page
        </Button>
        <span className="text-muted-foreground font-headline">
          Page {currentPage * 2 + 1} of {pages.length}
        </span>
        <Button onClick={() => handleTurnPage('forward')} disabled={currentPage >= spreadCount - 1 || isTurning !== null} className="wax-press">
          Next Page
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

const animationStyles = `
  @keyframes turn-page-forward {
    from { transform: perspective(2000px) rotateY(0deg); }
    to { transform: perspective(2000px) rotateY(-180deg); }
  }
  @keyframes turn-page-backward {
    from { transform: perspective(2000px) rotateY(-180deg); }
    to { transform: perspective(2000px) rotateY(0deg); }
  }
  .animate-turn-page-forward {
    animation-name: turn-page-forward;
  }
  .animate-turn-page-backward {
    animation-name: turn-page-backward;
  }
`;

// It's good practice to inject complex or dynamic styles via a style tag
// if they are scoped to a component and to avoid purging issues.
export function AnimationStyleInjector() {
  return <style>{animationStyles}</style>;
}
