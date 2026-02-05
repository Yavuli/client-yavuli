// src/pages/auth/Callback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
          console.log('[AuthCallback] Session found, user:', session.user.email, 'Redirecting to /explore');
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