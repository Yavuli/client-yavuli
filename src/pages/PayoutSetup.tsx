import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Landmark,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    SkipForward,
} from 'lucide-react';
import { toast } from 'sonner';
import { usersAPI } from '@/lib/api';
import SEO from '@/components/SEO';

const PayoutSetup = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bankAccount, setBankAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [holderName, setHolderName] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!bankAccount.trim()) {
            errs.bankAccount = 'Account number is required';
        } else if (!/^\d+$/.test(bankAccount.trim())) {
            errs.bankAccount = 'Account number must contain only digits';
        } else if (bankAccount.trim().length < 9 || bankAccount.trim().length > 18) {
            errs.bankAccount = 'Account number must be 9–18 digits';
        }

        if (!ifscCode.trim()) {
            errs.ifscCode = 'IFSC code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode.trim())) {
            errs.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234)';
        }

        if (!holderName.trim()) {
            errs.holderName = 'Account holder name is required';
        } else if (holderName.trim().length < 2) {
            errs.holderName = 'Name must be at least 2 characters';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            setSaving(true);
            await usersAPI.saveBankDetails({
                bankAccount: bankAccount.trim(),
                ifscCode: ifscCode.trim().toUpperCase(),
                holderName: holderName.trim(),
            });

            // Clear the banner cache so the banner knows details are now saved
            sessionStorage.removeItem('payoutBannerState');

            toast.success('Bank details saved! You\'re all set to receive payouts.');
            navigate('/explore', { replace: true });
        } catch (error) {
            console.error('Error saving bank details:', error);
            toast.error('Failed to save bank details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        toast.info('You can add bank details later from your Profile → Settings.');
        navigate('/explore', { replace: true });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Set Up Payouts | Yavuli"
                description="Add your bank details to receive payouts from your sales on Yavuli."
            />
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-xl">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 mb-4">
                        <Landmark className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Almost there! 🎉
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Your listing is live! Add your bank details so we know where to send your payouts.
                    </p>
                </div>

                {/* Form Card */}
                <Card className="p-6 md:p-8 animate-fade-up">
                    <div className="space-y-5">
                        {/* Account Holder Name */}
                        <div className="space-y-2">
                            <Label htmlFor="holderName" className="text-sm font-medium">
                                Account Holder Name
                            </Label>
                            <Input
                                id="holderName"
                                placeholder="Name as per bank records"
                                value={holderName}
                                onChange={(e) => {
                                    setHolderName(e.target.value);
                                    setErrors((prev) => ({ ...prev, holderName: '' }));
                                }}
                                className={errors.holderName ? 'border-destructive' : ''}
                            />
                            {errors.holderName && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.holderName}
                                </p>
                            )}
                        </div>

                        {/* Account Number */}
                        <div className="space-y-2">
                            <Label htmlFor="bankAccount" className="text-sm font-medium">
                                Account Number
                            </Label>
                            <Input
                                id="bankAccount"
                                placeholder="Enter your bank account number"
                                value={bankAccount}
                                onChange={(e) => {
                                    setBankAccount(e.target.value);
                                    setErrors((prev) => ({ ...prev, bankAccount: '' }));
                                }}
                                className={errors.bankAccount ? 'border-destructive' : ''}
                            />
                            {errors.bankAccount && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.bankAccount}
                                </p>
                            )}
                        </div>

                        {/* IFSC Code */}
                        <div className="space-y-2">
                            <Label htmlFor="ifscCode" className="text-sm font-medium">
                                IFSC Code
                            </Label>
                            <Input
                                id="ifscCode"
                                placeholder="e.g. SBIN0001234"
                                value={ifscCode}
                                maxLength={11}
                                onChange={(e) => {
                                    setIfscCode(e.target.value.toUpperCase());
                                    setErrors((prev) => ({ ...prev, ifscCode: '' }));
                                }}
                                className={errors.ifscCode ? 'border-destructive' : ''}
                            />
                            {errors.ifscCode && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.ifscCode}
                                </p>
                            )}
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-gradient-hero text-white hover:shadow-glow"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Save & Continue
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                disabled={saving}
                                className="flex-1 text-muted-foreground hover:text-foreground"
                            >
                                <SkipForward className="h-4 w-4 mr-2" />
                                Skip for Now
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            Your bank details are securely stored and used only for processing payouts.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PayoutSetup;
