'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle registration here.
    // For this demo, we'll just navigate to the dashboard.
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 torch-flicker">
       <div className="absolute inset-0 z-0">
          <span className="fixed block w-full h-full bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-20"></span>
      </div>
      <Card className="w-full max-w-md z-10 animate-[ink-fade-in_1s_ease-out_forwards] burnt-edge">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-2">
            <UserPlus size={32} />
          </div>
          <CardTitle className="text-3xl font-headline">Join the Academy</CardTitle>
          <CardDescription>Begin your journey as a Vedro scholar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Scholar Name</Label>
              <Input id="name" type="text" placeholder="Alex the Wise" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Scroll of Identity (Email)</Label>
              <Input id="email" type="email" placeholder="scholar@ancient-academy.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Secret Word (Password)</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full wax-press">
                Enroll
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have a scroll?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Enter the Library
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
