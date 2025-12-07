
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  LayoutDashboard,
  Puzzle,
  FlaskConical,
  Gamepad2,
  User,
  Settings,
  LogOut,
  BookOpen,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth, useUser } from '@/firebase';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';

const navItems = [
  { href: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
  { href: '/ai-chatbot', icon: <Sparkles />, text: 'Vedro AI' },
  { href: '/concept-builder', icon: <Puzzle />, text: 'Concept Builder' },
  { href: '/sandbox-experiment', icon: <FlaskConical />, text: 'Sandbox Experiment' },
  { href: '/running-quiz', icon: <Gamepad2 />, text: 'Running Quiz' },
  { href: '/profile', icon: <User />, text: 'Profile' },
];

export default function BookLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isTurning, setIsTurning] = useState(false);
  const [displayedPath, setDisplayedPath] = useState(pathname);
  const pageRef = useRef<HTMLDivElement>(null);

  const isDashboard = pathname === '/';
  
  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isUserLoading, user, pathname, router]);

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

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  // Special handling for login/signup to not use the book layout
  if (pathname === '/login' || pathname === '/signup') {
    return <main className="container mx-auto px-4 py-8">{children}</main>;
  }

  // Loading state
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading Scholar...</p>
      </div>
    );
  }
  
  // Don't render layout if no user and not on login page
  if (!user) {
    return null;
  }

  // Dashboard View (Split-screen book)
  if (isDashboard) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl aspect-[2/1.4] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Book Spine */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-stone-900 z-10 shadow-lg" />

          {/* Left Page (Sidebar) */}
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
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm leading-none">
                        {user.displayName || 'Scholar'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="p-2 rounded-md hover:bg-primary/10"
                    >
                      <LogOut className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Page (Content) */}
          <main
            className="bg-background rounded-r-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
            style={{ perspective: '1500px' }}
          >
            <div
              ref={pageRef}
              key={displayedPath}
              className={cn(
                'w-full h-full p-4 md:p-8 overflow-y-auto origin-left',
                'bg-background/90',
                isTurning && 'animate-page-turn'
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Full-width View for other pages
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors w-fit">
            <ArrowLeft size={16} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
        <main
          ref={pageRef}
          key={displayedPath}
          className={cn(
            'w-full origin-top',
            isTurning ? 'animate-[ink-fade-in_0.5s_ease-out]' : ''
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
