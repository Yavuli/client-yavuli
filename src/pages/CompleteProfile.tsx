import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { authAPI } from '@/lib/api';
import SEO from "@/components/SEO";
import { Info, Mail, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';

const CompleteProfile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [phone, setPhone] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [collegeEmail, setCollegeEmail] = useState('');

    const userEmail = user?.email || '';
    const isEducational = userEmail.endsWith('.edu') || userEmail.endsWith('.ac.in') || userEmail.endsWith('.college');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const checkAlreadyVerified = async () => {
            const { data: profile } = await supabase
                .from('users') // Updated from 'profiles' to 'users'
                .select('*')
                .eq('id', user.id)
                .single();

            const { data: userData } = await supabase
                .from('users')
                .select('is_verified')
                .eq('id', user.id)
                .single();

            const hasDetails = profile?.full_name && profile?.phone && profile?.college_name;
            const isStoredEducational = profile?.college_email && (
                profile.college_email.endsWith('.edu') ||
                profile.college_email.endsWith('.ac.in') ||
                profile.college_email.endsWith('.college')
            );

            if (hasDetails && (isEducational || isStoredEducational || userData?.is_verified)) {
                console.log('[CompleteProfile] User already verified, redirecting to /explore');
                navigate('/explore');
            }
        };

        checkAlreadyVerified();

        // Pre-fill if Google email is already educational
        if (isEducational && !collegeEmail) {
            setCollegeEmail(userEmail);
        }
    }, [user, isEducational, navigate]);

    const validateCollegeEmail = (email: string) => {
        const collegeDomains = ['.edu', '.ac.in', '.college'];
        return collegeDomains.some(domain => email.toLowerCase().includes(domain));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!phone || !collegeName || !collegeEmail) {
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!validateCollegeEmail(collegeEmail)) {
            toast.error('Please use a valid college email address');
            setLoading(false);
            return;
        }

        try {
            // ALWAYS sync basic profile details first so we don't lose them
            await authAPI.syncProfile({
                full_name: user?.user_metadata?.full_name,
                phone,
                college_name: collegeName,
                college_email: collegeEmail
            });

            // 1. If college email is different from current primary email, trigger verification
            if (collegeEmail !== userEmail) {
                setVerifying(true);
                const { error: updateError } = await supabase.auth.updateUser({
                    email: collegeEmail
                });

                if (updateError) throw updateError;

                toast.success('Verification email sent to ' + collegeEmail);
                // We stay on this page to show the "check your email" state
            } else {
                toast.success('Profile completed!');
                navigate('/explore');
            }
        } catch (error: any) {
            console.error('Error completing profile:', error);
            toast.error(error.message || 'Failed to complete profile');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
                <Card className="relative z-10 w-full max-w-md p-8 text-center space-y-6 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem]">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Verify your college email</h1>
                    <p className="text-slate-500 font-medium">
                        We've sent a verification link to <span className="text-slate-900 font-bold">{collegeEmail}</span>.
                        Please check your inbox and click the link to continue.
                    </p>
                    <div className="pt-4">
                        <Button
                            variant="outline"
                            className="w-full rounded-2xl h-12"
                            onClick={() => signOut()}
                        >
                            Sign out and try again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 selection:bg-primary/30">
            <SEO title="Complete Your Profile | Yavuli" />

            <div className="absolute inset-0 z-0">
                <ShootingStars starColor="#3b82f6" trailColor="#93c5fd" />
            </div>

            <Card className="relative z-10 w-full max-w-xl p-8 md:p-12 space-y-8 bg-white/70 backdrop-blur-2xl border-white/50 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">One Last Step</h1>
                    <p className="text-slate-500 font-medium">We need a few more details to verify your student status</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                                placeholder="+91 9876543210"
                                className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:ring-primary/20"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">College Name</Label>
                        <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                                placeholder="IIT Delhi"
                                className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:ring-primary/20"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-400 ml-1 text-xs font-bold uppercase tracking-wider">College Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                                type="email"
                                placeholder="name@college.edu"
                                className={`h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:ring-primary/20 ${isEducational ? 'pr-12' : ''}`}
                                value={collegeEmail}
                                onChange={(e) => !isEducational && setCollegeEmail(e.target.value)}
                                readOnly={isEducational}
                                required
                            />
                            {isEducational && (
                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                            )}
                        </div>
                        {isEducational ? (
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest ml-1">Verified via Google</p>
                        ) : (
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex gap-2 text-primary/70 mt-2">
                                <Info className="h-4 w-4 shrink-0" />
                                <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                                    Must use .edu, .ac.in, or .college email. We'll send a verification link.
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl transition-all shadow-xl shadow-primary/10"
                    >
                        {loading ? 'Processing...' : 'Complete Profile'}
                    </Button>
                </form>

                <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
                >
                    Use a different account
                </button>
            </Card>
        </div>
    );
};

export default CompleteProfile;
