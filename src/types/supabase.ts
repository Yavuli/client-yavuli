// src/types/supabase.ts
import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];

// Profile table type
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  city?: string | null;
  college?: string | null;
  phone?: string | null;
};

// User type that includes the profile
export type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    city?: string;
    college?: string;
    phone?: string;
  };
  profile?: Profile;
};

export type SignUpProfileInput = {
  fullName: string;
  city: string;
  college: string;
  phone: string;
};

// Auth context type
export type AuthContextType = {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: SignUpProfileInput) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
};