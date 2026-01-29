// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authAPI } from '@/lib/api';
import { AuthContextType, Profile, SignUpProfileInput, User as AppUser } from '@/types/supabase';

// Create the context with the imported type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const buildProfileFallback = (sessionUser: SupabaseUser): Profile => ({
    id: sessionUser.id,
    full_name: sessionUser.user_metadata?.full_name || 'New User',
    avatar_url: sessionUser.user_metadata?.avatar_url || null,
    updated_at: new Date().toISOString(),
    city: sessionUser.user_metadata?.city || null,
    college: sessionUser.user_metadata?.college || null,
    phone: sessionUser.user_metadata?.phone || null,
  });

  const syncProfileWithServer = async (
    sessionUser: SupabaseUser,
    profileData?: Profile | null
  ) => {
    if (!sessionUser) return;

    const payload = {
      full_name: sessionUser.user_metadata?.full_name || profileData?.full_name,
      city: sessionUser.user_metadata?.city || profileData?.city,
      college: sessionUser.user_metadata?.college || profileData?.college,
      phone: sessionUser.user_metadata?.phone || profileData?.phone,
    };

    const hasData = Object.values(payload).some((value) => Boolean(value));
    if (!hasData) return;

    try {
      await authAPI.syncProfile(payload);
    } catch (error) {
      console.error('Error syncing profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      // Store the access token in localStorage for API requests
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
      } else {
        localStorage.removeItem('token');
      }

      if (session?.user) {
        try {
          // Small delay to ensure the profile is created
          await new Promise(resolve => setTimeout(resolve, 500));

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, updated_at, city, college, phone')
            .eq('id', session.user.id)
            .single();

          const profileRecord = profile || buildProfileFallback(session.user);

          setUser({
            ...session.user,
            email: session.user.email || '',
            profile: profileRecord
          });

          await syncProfileWithServer(session.user, profileRecord);
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

  const signUp = async (email: string, password: string, userData: SignUpProfileInput) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            city: userData.city,
            college: userData.college,
            phone: userData.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      if (authData.session) {
        try {
          await authAPI.syncProfile({
            full_name: userData.fullName,
            city: userData.city,
            college: userData.college,
            phone: userData.phone,
          });
        } catch (syncError) {
          console.error('Post-signup profile sync failed:', syncError);
        }
      }

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

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
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