'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Wrapper component to apply a book-opening animation to page content.
const BookOpenAnimation = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div
      className={cn(
        className,
        'animate-[book-open_0.8s_cubic-bezier(0.65,0,0.35,1)_forwards]'
      )}
      style={{ transformOrigin: 'center' } as React.CSSProperties}
    >
      {children}
    </div>
  );
};


const animationStyle = `
  @keyframes book-open {
    from {
      opacity: 0;
      transform: perspective(1000px) rotateY(-25deg) scale(0.9);
    }
    to {
      opacity: 1;
      transform: perspective(1000px) rotateY(0deg) scale(1);
    }
  }
`;

export default function PageWrapper({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <>
      <style>{animationStyle}</style>
      <BookOpenAnimation className={className}>{children}</BookOpenAnimation>
    </>
  );
}
