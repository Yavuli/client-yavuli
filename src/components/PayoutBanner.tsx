import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, listingsAPI } from '@/lib/api';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Persistent banner shown when a logged-in user has active listings
 * but has NOT saved any bank details.
 *
 * Uses sessionStorage to avoid redundant API calls on every page load.
 * Cache keys:
 *   payoutBannerState = "hidden"  → user has bank details, hide banner
 *   payoutBannerState = "show"    → needs bank details, show banner
 *   payoutBannerState = undefined → first visit, will check API
 *
 * Clearing sessionStorage key "payoutBannerState" forces a re-check
 * (done automatically when bank details are saved).
 */
const PayoutBanner = () => {
    const { user } = useAuth();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!user) {
            setVisible(false);
            return;
        }

        const cached = sessionStorage.getItem('payoutBannerState');
        if (cached === 'hidden') {
            setVisible(false);
            return;
        }
        if (cached === 'show') {
            setVisible(true);
            return;
        }

        // First visit in this session — check API
        let cancelled = false;

        const check = async () => {
            try {
                // Check bank details first (cheaper call)
                const bankData = await usersAPI.getBankDetails();
                if (bankData?.bank_account_number) {
                    sessionStorage.setItem('payoutBannerState', 'hidden');
                    if (!cancelled) setVisible(false);
                    return;
                }
            } catch {
                // 404 / error → no bank details
            }

            // No bank details — check if user has active listings
            try {
                const listings = await listingsAPI.getMine();
                const hasActive = listings.some(
                    (l: any) => l.status === 'active' || l.status === 'published'
                );
                if (hasActive) {
                    sessionStorage.setItem('payoutBannerState', 'show');
                    if (!cancelled) setVisible(true);
                } else {
                    sessionStorage.setItem('payoutBannerState', 'hidden');
                    if (!cancelled) setVisible(false);
                }
            } catch {
                // If listings fetch fails, don't show banner
                if (!cancelled) setVisible(false);
            }
        };

        check();

        return () => {
            cancelled = true;
        };
    }, [user]);

    if (!visible || dismissed) return null;

    return (
        <div className="bg-amber-500/90 dark:bg-amber-600/90 text-amber-950 dark:text-amber-50 px-4 py-2.5 text-sm">
            <div className="container mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                        <strong>Your listing is live</strong>, but we don't know where to pay you.{' '}
                        <Link
                            to="/payout-setup"
                            className="underline font-semibold hover:no-underline"
                        >
                            Add Bank Details
                        </Link>
                    </span>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="p-1 rounded hover:bg-amber-600/30 dark:hover:bg-amber-500/30 transition-colors flex-shrink-0"
                    aria-label="Dismiss banner"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default PayoutBanner;
