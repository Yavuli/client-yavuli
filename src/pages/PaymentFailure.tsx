import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { paymentsAPI } from "@/lib/api";

interface Transaction {
  id: string;
  listingId: string;
  amount: number;
  status: string;
  createdAt: string;
}

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const failureReason = searchParams.get("reason");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      if (!transactionId) {
        setError("No transaction ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await paymentsAPI.getTransaction(transactionId);

        if (response.success && response.transaction) {
          setTransaction(response.transaction);
          setError(null);
        } else {
          setError("Failed to fetch transaction details");
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
        // Don't set error here as the transaction might have been cleaned up
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, user, navigate]);

  const getFailureMessage = (): { title: string; description: string } => {
    switch (failureReason) {
      case "verification_failed":
        return {
          title: "Payment Verification Failed",
          description:
            "We could not verify your payment. This might be due to a security issue or network error. Please try again or contact support.",
        };
      case "declined":
        return {
          title: "Payment Declined",
          description:
            "Your payment was declined by your bank. Please check your card details and try again, or use a different payment method.",
        };
      case "timeout":
        return {
          title: "Payment Timed Out",
          description:
            "Your payment session timed out. Please try again with the payment process.",
        };
      default:
        return {
          title: "Payment Failed",
          description:
            "Unfortunately, your payment could not be processed. Please try again or contact our support team.",
        };
    }
  };

  const failureInfo = getFailureMessage();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Failure Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary">
              {failureInfo.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {failureInfo.description}
            </p>
          </div>

          {/* Transaction Details (if available) */}
          {transaction && (
            <Card className="p-8 space-y-6 bg-muted/50 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-yellow-100/20 border border-yellow-200/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-600 mb-1">
                    Transaction Details Saved
                  </p>
                  <p className="text-yellow-700">
                    Your transaction record has been saved. You won't be charged
                    if the payment failed.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Transaction Information
                </h2>
                <Separator />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Transaction ID
                  </p>
                  <code className="text-sm font-mono bg-background p-2 rounded break-all">
                    {transaction.id}
                  </code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="font-medium capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-bold text-primary">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Troubleshooting Tips */}
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">What You Can Do</h2>
            <Separator />
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="text-accent text-xl leading-none">→</div>
                <div>
                  <p className="font-medium mb-1">Try Again</p>
                  <p className="text-sm text-muted-foreground">
                    Return to the product page and initiate payment again with
                    the same or different payment method.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="text-accent text-xl leading-none">→</div>
                <div>
                  <p className="font-medium mb-1">Check Your Bank</p>
                  <p className="text-sm text-muted-foreground">
                    Verify your account status with your bank. They may have
                    declined the transaction.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="text-accent text-xl leading-none">→</div>
                <div>
                  <p className="font-medium mb-1">Use Different Card</p>
                  <p className="text-sm text-muted-foreground">
                    Try using a different credit/debit card or payment method.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="text-accent text-xl leading-none">→</div>
                <div>
                  <p className="font-medium mb-1">Contact Support</p>
                  <p className="text-sm text-muted-foreground">
                    If the problem persists, reach out to our support team at
                    support@yavuli.com
                  </p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-hero text-white hover:shadow-glow h-12 text-base font-semibold"
              onClick={() => navigate("/checkout")}
            >
              Retry Payment
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/explore")}
            >
              Continue Shopping
            </Button>
            <Button
              variant="ghost"
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/profile")}
            >
              View My Orders
            </Button>
          </div>

          {/* Help Section */}
          <Card className="p-6 bg-muted/50 space-y-3 text-center text-sm">
            <p className="text-muted-foreground">
              Need help? We're here to support you.
            </p>
            <div className="space-y-2">
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:support@yavuli.com"
                  className="text-accent hover:underline"
                >
                  support@yavuli.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                Our support team typically responds within 24 hours.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
