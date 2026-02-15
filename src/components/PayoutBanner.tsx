import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, listingsAPI } from '@/lib/api';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

/**
 * Sticky payout banner shown when a logged-in user has published listings
 * but has NOT saved any bank details.
 *
 * Uses sessionStorage to cache the check result within a session.
 * Cache is cleared when bank details are saved (from PayoutSetup or Profile).
 */
const PayoutBanner = () => {
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Don't run while auth is still loading
        if (authLoading) return;

        // Not logged in → hide
        if (!user) {
            setVisible(false);
            return;
        }

        // Don't show on the payout-setup page itself
        if (location.pathname === '/payout-setup') {
            setVisible(false);
            return;
        }

        // Check cached state first
        const cached = sessionStorage.getItem('payoutBannerState');
        if (cached === 'hidden') {
            setVisible(false);
            return;
        }
        if (cached === 'show') {
            setVisible(true);
            return;
        }

        // No cache — run API checks
        let cancelled = false;

        const check = async () => {
            try {
                // Step 1: Check if bank details already exist
                let hasBankDetails = false;
                try {
                    const bankData = await usersAPI.getBankDetails();
                    hasBankDetails = !!(bankData?.bank_account_number);
                } catch {
                    // Error or 404 → no bank details
                    hasBankDetails = false;
                }

                if (hasBankDetails) {
                    sessionStorage.setItem('payoutBannerState', 'hidden');
                    if (!cancelled) setVisible(false);
                    return;
                }

                // Step 2: No bank details — check if user has ANY listings
                let hasListings = false;
                try {
                    const listings = await listingsAPI.getMine();
                    // Show banner if user has any listings at all (any status)
                    hasListings = Array.isArray(listings) && listings.length > 0;
                } catch {
                    // If getMine fails, assume no listings
                    hasListings = false;
                }

                if (hasListings) {
                    sessionStorage.setItem('payoutBannerState', 'show');
                    if (!cancelled) setVisible(true);
                } else {
                    sessionStorage.setItem('payoutBannerState', 'hidden');
                    if (!cancelled) setVisible(false);
                }
            } catch {
                // Outer safety catch — don't show banner if everything fails
                if (!cancelled) setVisible(false);
            }
        };

        check();

        return () => {
            cancelled = true;
        };
    }, [user, authLoading, location.pathname]);

    if (!visible || dismissed) return null;

    return (
        <div
            className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-lg"
            role="alert"
        >
            <div className="container mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1 rounded-full bg-white/20 flex-shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium truncate">
                        Complete your setup — add bank details to receive payouts from your sales.
                    </span>
                    <Link
                        to="/payout-setup"
                        className="inline-flex items-center gap-1 text-sm font-bold bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                        Add Now
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
                    aria-label="Dismiss banner"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default PayoutBanner;
