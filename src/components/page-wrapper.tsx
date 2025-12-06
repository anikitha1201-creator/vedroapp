'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Using CSS for simplicity and performance, avoiding client-side JS bundle increase for a simple animation.
// A 'clip-path' animation gives a nice "unrolling" feel.
const ScrollUnroll = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div
      className={cn(
        className,
        'animate-[scroll-unroll_0.7s_cubic-bezier(0.65,0,0.35,1)_forwards]'
      )}
      style={
        {
          '--unroll-y': '50%',
          '--unroll-x': '100%',
          transformOrigin: 'top',
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

// Add the animation to globals.css or a dedicated animations file
// We will add it to the globals.css since it's a small one.
const animationStyle = `
  @keyframes scroll-unroll {
    from {
      clip-path: inset(0 var(--unroll-x) 100% var(--unroll-x));
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
`;

export default function PageWrapper({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <>
      <style>{animationStyle}</style>
      <ScrollUnroll className={className}>{children}</ScrollUnroll>
    </>
  );
}
