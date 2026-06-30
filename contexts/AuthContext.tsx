import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  membership?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory session storage
let sessionStorage = {
  user: null as User | null,
  token: null as string | null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initializing...');
        setIsLoading(true);

        // Try to restore from session storage
        if (sessionStorage.user && sessionStorage.token) {
          console.log('[AuthContext] Restoring session for:', sessionStorage.user.email);
          setUser(sessionStorage.user);
        } else {
          console.log('[AuthContext] No existing session');
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
        setError('Failed to initialize auth');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const signUp = useCallback(
    async (email: string, password: string, name: string): Promise<User> => {
      try {
        console.log('[AuthContext] signUp called for:', email);
        setError(null);
        setIsLoading(true);

        // Validate inputs
        if (!email || !password || !name) {
          throw new Error('Email, password, and name are required');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Create user
        const newUser: User = {
          id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          name: name.trim(),
          membership: 'Community Member',
          createdAt: new Date().toISOString(),
        };

        // TODO: Replace with real Supabase call
        // const { data: authData, error: authError } = await supabase.auth.signUp({
        //   email,
        //   password,
        // });

        // Save to session
        sessionStorage.user = newUser;
        sessionStorage.token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Update state
        setUser(newUser);
        setIsLoading(false);

        console.log('[AuthContext] signUp successful for:', email);
        return newUser;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        console.error('[AuthContext] signUp error:', message);
        setError(message);
        setIsLoading(false);
        throw new Error(message);
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<User> => {
      try {
        console.log('[AuthContext] signIn called for:', email);
        setError(null);
        setIsLoading(true);

        // Validate inputs
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // TODO: Replace with real Supabase call
        // const { data, error: authError } = await supabase.auth.signInWithPassword({
        //   email,
        //   password,
        // });

        // For mock: create/find user
        const signinUser: User = {
          id: 'user_' + email.replace(/[@.]/g, '_'),
          email: email.trim(),
          name: email.split('@')[0],
          membership: 'Community Member',
          createdAt: new Date().toISOString(),
        };

        // Save to session
        sessionStorage.user = signinUser;
        sessionStorage.token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Update state
        setUser(signinUser);
        setIsLoading(false);

        console.log('[AuthContext] signIn successful for:', email);
        return signinUser;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign in failed';
        console.error('[AuthContext] signIn error:', message);
        setError(message);
        setIsLoading(false);
        throw new Error(message);
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('[AuthContext] signOut called');
      setError(null);
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Call Supabase to revoke token
      // await supabase.auth.signOut();

      // Clear session
      sessionStorage.user = null;
      sessionStorage.token = null;
      setUser(null);
      setIsLoading(false);

      console.log('[AuthContext] signOut successful');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      console.error('[AuthContext] signOut error:', message);
      setError(message);
      setIsLoading(false);
      throw new Error(message);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>): Promise<User> => {
      try {
        console.log('[AuthContext] updateProfile called');
        setError(null);

        if (!user) {
          throw new Error('No user logged in');
        }

        // TODO: Call Supabase to update profile
        // await supabase.from('users').update(data).eq('id', user.id);

        const updated: User = { ...user, ...data };
        sessionStorage.user = updated;
        setUser(updated);

        console.log('[AuthContext] updateProfile successful');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Update failed';
        console.error('[AuthContext] updateProfile error:', message);
        setError(message);
        throw new Error(message);
      }
    },
    [user]
  );

  const clearError = useCallback(() => {
    console.log('[AuthContext] clearError called');
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
