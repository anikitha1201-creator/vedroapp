
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  LayoutDashboard,
  Bot,
  Puzzle,
  FlaskConical,
  Gamepad2,
  User,
  Settings,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
  { href: '/ai-chatbot', icon: <Bot />, text: 'Vedro AI Chatbot' },
  { href: '/concept-builder', icon: <Puzzle />, text: 'Concept Builder' },
  { href: '/sandbox-experiment', icon: <FlaskConical />, text: 'Sandbox Experiment' },
  { href: '/running-quiz', icon: <Gamepad2 />, text: 'Running Quiz' },
  { href: '/profile', icon: <User />, text: 'Profile' },
];

export default function BookLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isTurning, setIsTurning] = useState(false);
  const [displayedPath, setDisplayedPath] = useState(pathname);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== displayedPath) {
      setIsTurning(true);
      const timer = setTimeout(() => {
        setDisplayedPath(pathname);
        setIsTurning(false);
      }, 650); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [pathname, displayedPath]);

  const RightPageContent = () => (
    <div
      ref={pageRef}
      key={displayedPath}
      className={cn(
        'w-full h-full p-4 md:p-8 overflow-y-auto origin-left',
        'bg-background/90',
        isTurning && 'animate-page-turn'
      )}
      style={{
        animationDuration: '700ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );

  if (pathname === '/login' || pathname === '/signup') {
    return <main className="container mx-auto px-4 py-8">{children}</main>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl aspect-[2/1.4] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Book Spine */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-stone-900 z-10 shadow-lg" />

        {/* Left Page */}
        <aside className="bg-secondary/20 p-6 rounded-l-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col border-r-4 border-stone-800">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-primary w-10 h-10" />
            <h1 className="text-4xl font-display text-primary tracking-wider">
              Vedro
            </h1>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-md transition-colors font-medium',
                    pathname === item.href
                      ? 'bg-primary/90 text-primary-foreground shadow-inner'
                      : 'hover:bg-primary/10 text-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <div className="border-t border-primary/20 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-accent">
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm leading-none">
                      Scholar Alex
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      alex.scholar@vedro.edu
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href="/settings"
                    className="p-2 rounded-md hover:bg-primary/10"
                  >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/login"
                    className="p-2 rounded-md hover:bg-primary/10"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Page */}
        <main
          className="bg-background rounded-r-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          style={{
            perspective: '1500px',
          }}
        >
          <RightPageContent />
        </main>
      </div>
    </div>
  );
}
