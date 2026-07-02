import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  department?: string;
  role: 'admin' | 'manager' | 'staff' | 'intern';
  avatar_url?: string;
  phone?: string;
  skills?: string[];
  created_at?: string;
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

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
        setError('Failed to initialize auth');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const { data, error: err } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (err && err.code === 'PGRST116') {
        // User profile doesn't exist, create it
        console.log('[AuthContext] Creating user profile...');
        const newProfile = {
          id: userId,
          email: authUser?.email || '',
          full_name: authUser?.email?.split('@')[0] || 'Staff',
          role: 'staff',
        };

        const { data: created, error: createErr } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (createErr) throw createErr;
        if (created) setUser(created);
      } else if (err) {
        throw err;
      } else if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error('[AuthContext] Error fetching/creating profile:', err);
    }
  };

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

        // Check domain restriction
        if (!email.endsWith('@swahilipot.co.ke')) {
          throw new Error('You must use a @swahilipot.co.ke email address');
        }

        // Sign up with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Sign up failed');

        // Create user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email.trim(),
              full_name: name.trim(),
              role: 'staff',
            },
          ])
          .select()
          .single();

        if (profileError) throw profileError;

        const newUser: User = profileData || {
          id: authData.user.id,
          email: email.trim(),
          full_name: name.trim(),
          role: 'staff',
        };

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

        // Check domain restriction
        if (!email.endsWith('@swahilipot.co.ke')) {
          throw new Error('You must use a @swahilipot.co.ke email address');
        }

        // Sign in with Supabase
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) throw authError;
        if (!data.user) throw new Error('Sign in failed');

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        const signinUser: User = profileData || {
          id: data.user.id,
          email: email.trim(),
          role: 'staff',
        };

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

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

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

        const { data: updated, error: updateError } = await supabase
          .from('users')
          .update(data)
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        const updatedUser: User = updated || { ...user, ...data };
        setUser(updatedUser);

        console.log('[AuthContext] updateProfile successful');
        return updatedUser;
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
