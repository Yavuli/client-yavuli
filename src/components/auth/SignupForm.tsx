import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ChevronLeft, Info, Eye, EyeOff } from 'lucide-react';
import SEO from "@/components/SEO";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign up with Google');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateCollegeEmail = (email: string) => {
    const collegeDomains = ['.edu', '.ac.in', '.college'];
    return collegeDomains.some(domain => email.toLowerCase().includes(domain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password || !fullName || !city || !college || !phone) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/^[0-9+\-()\s]{6,20}$/.test(phone)) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validateCollegeEmail(email)) {
      setError('Please use a valid college email address (.edu, .ac.in, .college)');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, {
        fullName,
        city,
        college,
        phone
      });

      if (error) throw error;

      setSuccess('Check your email to verify! Redirecting to login...');
      setTimeout(() => navigate('/login'), 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-primary/30 py-20">
      <SEO
        title="Sign Up | Yavuli"
        description="Join Yavuli today and start trading with your campus community. Safe, secure, and exclusive for students."
      />
      {/* Background with stars */}
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
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card className="relative z-10 w-full max-w-xl p-8 md:p-12 space-y-8 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Join Us</h1>
          <p className="text-slate-500 font-medium">Create your student account today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl text-sm" role="alert">
            {success}
          </div>
        )}

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 text-primary/80">
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">
            Must use .edu, .ac.in, or .college email
          </p>
        </div>

        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-14 border-slate-100 bg-white hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 text-slate-900 rounded-2xl transition-all font-bold shadow-sm"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            Sign up with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-300 font-bold tracking-widest">or details</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Full Name</Label>
              <Input
                id="name"
                placeholder="Rahul Sharma"
                className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@college.edu"
                className="h-14 bg-white/5 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">City</Label>
                <Input
                  id="city"
                  placeholder="Delhi"
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">College</Label>
                <Input
                  id="college"
                  placeholder="IIT Delhi"
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-2xl focus:ring-primary/20 pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl transition-all shadow-xl shadow-primary/10"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 font-medium pb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;