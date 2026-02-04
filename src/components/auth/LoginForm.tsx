import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ChevronLeft } from 'lucide-react';
import SEO from "@/components/SEO";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/explore',
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      if (data?.user?.user_metadata?.full_name) {
        toast.success(`Welcome back, ${data.user.user_metadata.full_name.split(' ')[0]}!`);
      } else {
        toast.success('Successfully logged in!');
      }

      // Poll for the user state to be set in AuthContext
      // The onAuthStateChange listener will update the user state
      let attempts = 0;
      const maxAttempts = 20; // 20 * 100ms = 2 seconds max wait
      
      while (attempts < maxAttempts) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Session is valid, wait a bit more for AuthContext to update
          await new Promise(resolve => setTimeout(resolve, 200));
          navigate('/explore');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      // If we get here, something went wrong but signIn succeeded
      // Navigate anyway
      navigate('/explore');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
      <SEO
        title="Login | Yavuli"
        description="Sign in to your Yavuli account to browse and buy campus essentials."
      />
      {/* Background with stars (Shooting stars already updated to blue/default light) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(255,255,255,0)_80%)]" />
        <ShootingStars
          starColor="#3b82f6"
          trailColor="#93c5fd"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
        />
        <ShootingStars
          starColor="#8b5cf6"
          trailColor="#c4b5fd"
          minSpeed={20}
          maxSpeed={40}
          minDelay={1500}
          maxDelay={3500}
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 rounded-xl transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>

      <Card className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Login</h1>
          <p className="text-slate-500 font-medium">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-14 border-slate-100 bg-white hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 text-slate-900 rounded-2xl transition-all font-bold shadow-sm"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-300 font-bold tracking-widest">or email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@college.edu"
                className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all shadow-lg shadow-primary/10"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 font-medium">
          New here?{" "}
          <Link to="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Create account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;