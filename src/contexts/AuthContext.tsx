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
    college_email: sessionUser.user_metadata?.college_email || null,
    college_name: sessionUser.user_metadata?.college_name || null,
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
      college_email: sessionUser.user_metadata?.college_email || profileData?.college_email,
      college_name: sessionUser.user_metadata?.college_name || profileData?.college_name,
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
    let mounted = true;

    // Check initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) {
          console.error('[AuthContext] Error fetching initial session:', error);
          setLoading(false);
          return;
        }

        setSession(initialSession);

        // Update token if session exists
        if (initialSession?.access_token) {
          try {
            localStorage.setItem('token', initialSession.access_token);
          } catch (storageError) {
            console.error('[AuthContext] localStorage error on init:', storageError);
          }
        }

        if (initialSession?.user) {
          await handleUserAuthenticated(initialSession.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] Fatal error in auth initialization:', err);
        if (mounted) setLoading(false);
      }
    };

    const handleUserAuthenticated = async (supabaseUser: SupabaseUser) => {
      try {
        // Fetch profile
        const { data: profile, error } = await supabase
          .from('users') // Updated from 'profiles' to 'users'
          .select('id, full_name, avatar_url, updated_at, city, college, college_email, college_name, phone')
          .eq('id', supabaseUser.id)
          .single();

        const profileRecord = profile || buildProfileFallback(supabaseUser);

        if (mounted) {
          setUser({
            ...supabaseUser,
            email: supabaseUser.email || '',
            profile: profileRecord
          });
          setLoading(false);
        }

        // Sync in background
        syncProfileWithServer(supabaseUser, profileRecord);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          setUser({
            ...supabaseUser,
            email: supabaseUser.email || '',
            profile: buildProfileFallback(supabaseUser)
          });
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('[AuthContext] DEBUG: event=', event, 'session exists=', !!session, 'user=', session?.user?.email);

      setSession(session);

      // Store tokens with error handling
      try {
        if (session?.access_token) {
          localStorage.setItem('token', session.access_token);
        } else {
          localStorage.removeItem('token');
        }
      } catch (storageError) {
        console.error('[AuthContext] localStorage error:', storageError);
      }

      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('[AuthContext] Handling user authentication for event:', event);
          // Don't await here - let it run in background to not block the listener
          handleUserAuthenticated(session.user).catch(err => {
            console.error('[AuthContext] Background auth handler error:', err);
            setLoading(false);
          });

          // Safety fallback: if handleUserAuthenticated is too slow, ensure we stop loading eventually
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 5000);
        } else {
          console.log('[AuthContext] No user in session for event:', event);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
        setUser(null);
        setLoading(false);
      } else {
        console.log('[AuthContext] Other event:', event);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  // Always render children - never return null to avoid blank screen
  // Loading state is managed by pages/components individually
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};