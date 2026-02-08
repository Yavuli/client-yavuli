import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { ShootingStars } from "@/components/ui/shooting-stars";
import SEO from "@/components/SEO";
import { toast } from 'sonner';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error } = await updatePassword(password);
            if (error) throw error;

            toast.success('Password updated successfully!');
            navigate('/login');
        } catch (error: any) {
            console.error('[ResetPassword] Error:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
            <SEO
                title="Reset Password | Yavuli"
                description="Set a new password for your Yavuli account."
            />

            <div className="absolute inset-0 z-0">
                <ShootingStars
                    starColor="#3b82f6"
                    trailColor="#93c5fd"
                />
            </div>

            <Card className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Set New Password</h1>
                    <p className="text-slate-500 font-medium">Enter your new secure password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">New Password</Label>
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
                        <Label htmlFor="confirmPassword" className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
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
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all shadow-lg shadow-primary/10"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;
