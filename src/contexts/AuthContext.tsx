// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, User as AppUser } from '@/types/supabase';

// Create the context with the imported type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    setSession(session);
    
    if (session?.user) {
      try {
        // Small delay to ensure the profile is created
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          email: session.user.email || '',
          profile: profile || {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 'New User',
            updated_at: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser({
          ...session.user,
          email: session.user.email || '',
          profile: undefined
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, userData: { fullName: string }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    return { 
      data: { 
        user: {
          ...authData.user,
          email: authData.user.email || email
        }
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Signup failed') 
    };
  }
};

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};