
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
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update user's display name and wait for it to complete
      await updateProfile(newUser, { displayName: name });

      // Create a user profile document in Firestore (non-blocking)
      const userDocRef = doc(firestore, 'users', newUser.uid);
      const userProfileData = {
        id: newUser.uid,
        name: name,
        email: newUser.email,
        theme: 'dark' // default theme
      };
      setDocumentNonBlocking(userDocRef, userProfileData, { merge: true });

      // Now redirect to dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Error signing up with email', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md z-10 animate-[ink-fade-in_1s_ease-out_forwards] burnt-edge">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-ink-fade">
            Join the Academy
          </CardTitle>
          <CardDescription
            className="text-ink-fade"
            style={{ animationDelay: '0.2s' }}
          >
            Create your scholar account to begin your journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Alex the Scholar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="scholar@ancient-academy.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full wax-press" disabled={isLoading}>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted-foreground">
            Already a member?{' '}
            <Link href="/login" className="underline text-primary hover:text-accent">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
