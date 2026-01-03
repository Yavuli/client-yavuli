import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { paymentsAPI } from "@/lib/api";

interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const transactionId = searchParams.get("transactionId");

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
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load transaction details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, user, navigate]);

  const handleCopyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      toast.success("Transaction ID copied to clipboard");
    }
  };

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
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your order has been placed successfully. The seller will be
              notified and you can track your order from your profile.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="p-6 border-destructive bg-destructive/5">
              <p className="text-destructive font-medium">{error}</p>
              {!transaction && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your payment may still be processing. Please check your
                  profile or try again later.
                </p>
              )}
            </Card>
          )}

          {/* Transaction Details */}
          {transaction && (
            <Card className="p-8 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <Separator />
              </div>

              {/* Transaction ID */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-lg font-mono text-sm break-all">
                    {transaction.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyTransactionId}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Amount */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="font-medium capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method & Date */}
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium capitalize">
                    {transaction.paymentMethod || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date & Time</p>
                  <p className="font-medium">
                    {new Date(
                      transaction.transactionDate || transaction.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              {/* What's Next */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">What's Next?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>The seller will be notified of your purchase</li>
                  <li>Check your email for order confirmation</li>
                  <li>You can track this order from your Profile</li>
                  <li>Message the seller to discuss delivery/pickup</li>
                </ul>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-hero text-white hover:shadow-glow h-12 text-base font-semibold"
              onClick={() => navigate("/profile?tab=purchases")}
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/explore")}
            >
              Continue Shopping
            </Button>
          </div>

          {/* Invoice */}
          {transaction && (
            <Card className="p-6 space-y-4 text-center">
              <Button
                variant="ghost"
                className="w-full justify-center text-accent hover:text-accent hover:bg-accent/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
