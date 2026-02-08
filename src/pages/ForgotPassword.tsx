import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Mail, AlertCircle } from 'lucide-react';
import { ShootingStars } from "@/components/ui/shooting-stars";
import SEO from "@/components/SEO";
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Proceed with Supabase password reset directly
            // We removal the explicit checkEmail call to prevent email enumeration (best practice)
            const { error } = await resetPassword(email);

            // Note: Supabase will return success even if the email doesn't exist
            // but the email won't be sent. This is intentional for security.
            if (error) throw error;

            toast.success('If an account exists for this email, we have sent a reset link to your inbox!');
            navigate('/login');
        } catch (error: any) {
            console.error('[ForgotPassword] Error:', error);
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
            <SEO
                title="Forgot Password | Yavuli"
                description="Reset your Yavuli account password."
            />

            <div className="absolute inset-0 z-0">
                <ShootingStars
                    starColor="#3b82f6"
                    trailColor="#93c5fd"
                />
            </div>

            <div className="absolute top-6 left-6 z-20">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 rounded-xl transition-colors"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Login
                </Button>
            </div>

            <Card className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Forgot Password</h1>
                    <p className="text-slate-500 font-medium">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all shadow-lg shadow-primary/10"
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
