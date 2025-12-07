'use client';
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  Auth,
  getAuth, // Import getAuth
} from 'firebase/auth';

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Correctly get the auth instance
    const auth: Auth = getAuth();
    
    // Set up the listener for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading, error };
}

    