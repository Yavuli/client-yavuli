// src/pages/auth/Callback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { authAPI } from "@/lib/api";
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        console.log('[AuthCallback] Starting callback processing, code exists:', !!code);

        // Wait a bit to let Supabase Auth internal state catch up with the URL code
        if (code) {
          console.log('[AuthCallback] Code found, waiting for session...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        let { data: { session }, error } = await supabase.auth.getSession();

        if (!session && code) {
          console.log('[AuthCallback] No session yet, retrying check...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          const result = await supabase.auth.getSession();
          session = result.data.session;
          if (result.error) console.error('[AuthCallback] Retry error:', result.error);
        }

        if (error) throw error;

        if (session) {
          const user = session.user;
          const userEmail = user.email || '';
          const provider = user.app_metadata.provider;
          const isEducational = userEmail.endsWith('.edu') || userEmail.endsWith('.ac.in') || userEmail.endsWith('.college');

          console.log('[AuthCallback] Session found, user:', userEmail, 'provider:', provider);

          // ONLY trigger the /complete-profile flow for Google OAuth users
          if (provider === 'google') {
            // Get profile to check for missing fields
            const { data: profile } = await supabase
              .from('users')
              .select('full_name, phone, college_name, college_email') // NOTE: avatar_url/profile_image_url is not selected here, so no change needed to query, but good to check.
              .eq('id', user.id)
              .single();

            // Also check the users table for global verification status
            const { data: userData } = await supabase
              .from('users')
              .select('is_verified')
              .eq('id', user.id)
              .single();

            const hasDetails = !!(profile?.full_name && profile?.phone && profile?.college_name);

            // A user is considered "Verified" if:
            // 1. Their primary email is educational OR
            // 2. They have a verified college email in their profile OR
            // 3. The users table marks them as verified
            const isProfileEmailEducational = profile?.college_email && (
              profile.college_email.endsWith('.edu') ||
              profile.college_email.endsWith('.ac.in') ||
              profile.college_email.endsWith('.college')
            );

            const hasVerifiedEmail = isEducational || isProfileEmailEducational || userData?.is_verified;

            if (!hasDetails || !hasVerifiedEmail) {
              console.log('[AuthCallback] Google User: Profile incomplete or not verified. Redirecting to /complete-profile', { hasDetails, hasVerifiedEmail });
              navigate('/complete-profile', { replace: true });
              return;
            }

            // Sync verification status back to users table if verified but flag is missing
            if (hasVerifiedEmail && !userData?.is_verified) {
              await authAPI.syncProfile({ is_verified: true } as any);
            }
          }

          console.log('[AuthCallback] Redirecting to /explore');
          navigate('/explore', { replace: true });
        } else {
          console.error('[AuthCallback] No session found after processing');
          setError('No valid session found. Redirecting to login...');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError('Failed to authenticate. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <p className="mt-2 text-sm text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verifying your email...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
}