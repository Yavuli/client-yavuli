import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ShoppingBag, AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import { paymentsAPI, listingsAPI } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerId: string;
  quantity: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useCart();
  const [searchParams] = useSearchParams();

  // State management
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  // Check if it's a direct buy (from product page with query params)
  const directBuyListingId = searchParams.get("listingId");
  const directBuyPrice = searchParams.get("price");

  // Initialize items on mount
  useEffect(() => {
    const initializeCheckout = async () => {
      if (!user) {
        toast.error("Please sign in to proceed with checkout");
        navigate("/auth/login");
        return;
      }

      try {
        setLoading(true);
        let itemsToCheckout: CheckoutItem[] = [];

        // If direct buy from product page
        if (directBuyListingId && directBuyPrice) {
          setIsDirectBuy(true);
          const listing = await listingsAPI.getById(directBuyListingId);
          itemsToCheckout = [
            {
              id: listing.id,
              title: listing.title,
              price: parseFloat(directBuyPrice),
              image: listing.images?.[0] || "/placeholder.jpg",
              sellerId: listing.seller_id,
              quantity: 1,
            },
          ];
        } else {
          // From cart
          setIsDirectBuy(false);
          itemsToCheckout = cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            sellerId: item.sellerId,
            quantity: item.quantity,
          }));
        }

        if (itemsToCheckout.length === 0) {
          setError("No items to checkout");
          return;
        }

        setItems(itemsToCheckout);

        // Calculate total amount
        const total = itemsToCheckout.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalAmount(total);
        setError(null);
      } catch (err) {
        console.error("Checkout initialization error:", err);
        setError("Failed to load checkout details");
        toast.error("Failed to load checkout details");
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [user, cartItems, directBuyListingId, directBuyPrice, navigate]);

  /**
   * Process payment for a single item
   * Creates order, opens Razorpay modal, verifies payment
   */
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity goes to 0
      if (!isDirectBuy) {
        removeFromCart(itemId);
      }
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setTotalAmount(prevTotal => {
        const item = items.find(i => i.id === itemId);
        return item ? prevTotal - item.price * item.quantity : prevTotal;
      });
      return;
    }

    // Update quantity in cart context
    if (!isDirectBuy) {
      updateQuantity(itemId, newQuantity);
    }

    // Update local state
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Recalculate total
    const newTotal = items.reduce((sum, item) => {
      if (item.id === itemId) {
        return sum + item.price * newQuantity;
      }
      return sum + item.price * item.quantity;
    }, 0);
    setTotalAmount(newTotal);
  };

  /**
   * Process payment for a single item
   * Creates order, opens Razorpay modal, verifies payment
   */
  const handlePayment = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent any form submission or default behavior
    if (items.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    // For this implementation, we'll process the first item
    // In a production app with multiple items, you might want to:
    // 1. Group by seller and create multiple orders
    // 2. Create a combined order with a total amount
    // For now, we'll process one at a time
    const item = items[0];

    if (user?.id === item.sellerId) {
      toast.error("You cannot buy your own listing");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      // Step 1: Create order on backend
      console.log(
        `Creating order for listing ${item.id} with price ₹${item.price}`
      );
      const orderResponse = await paymentsAPI.createOrder(item.id, item.price);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const { orderId, transactionId, razorpayKeyId } = orderResponse;

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: razorpayKeyId,
        amount: orderResponse.totalAmount * 100, // Razorpay uses paise
        currency: "INR",
        name: "Yavuli Marketplace",
        description: `Purchase: ${item.title}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on backend
            console.log("Payment handler called with response:", response);
            const verifyResponse = await paymentsAPI.verifyPayment(
              orderId,
              response.razorpay_payment_id,
              response.razorpay_signature,
              transactionId
            );

            if (!verifyResponse.success) {
              throw new Error(
                verifyResponse.message || "Payment verification failed"
              );
            }

            // Step 4: Payment successful!
            console.log("Payment verified successfully");

            // Clear cart if this was a cart checkout
            if (!directBuyListingId) {
              clearCart();
            }

            // Redirect to success page
            navigate(`/payment-success?transactionId=${transactionId}`);
            toast.success("Payment successful! Your order has been placed.");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            toast.error(
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed"
            );
            navigate(
              `/payment-failure?transactionId=${transactionId}&reason=verification_failed`
            );
          }
        },
        prefill: {
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal closed");
            setProcessingPayment(false);
            toast.info("Payment cancelled");
          },
        },
      };

      // Create Razorpay instance and open modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  // No items state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6 animate-fade-up">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              No items to checkout. Start shopping!
            </p>
            <Button
              className="bg-gradient-hero text-white hover:shadow-glow"
              onClick={() => navigate("/explore")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <Separator />

              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      {!isDirectBuy && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleQuantityChange(item.id, 0)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 my-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-lg font-bold text-primary mt-2">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-bold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Fee Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Marketplace Fee</span>
                  <span className="text-accent">Included</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-accent">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-accent">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold">Payment Details</h2>
              <Separator />

              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-destructive">{error}</div>
                </div>
              )}

              {/* Payment Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Method</p>
                  <p className="font-medium">Razorpay (Credit/Debit Card)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Security Info */}
              <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                <p>✓ Payments encrypted with SSL</p>
                <p>✓ PCI DSS compliant</p>
                <p>✓ Secure by Razorpay</p>
              </div>

              {/* Payment Button */}
              <Button
                type="button"
                className="w-full bg-gradient-hero text-white hover:shadow-glow h-12 text-base font-semibold disabled:opacity-50"
                onClick={(e) => handlePayment(e)}
                disabled={processingPayment || loading || error !== null}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalAmount.toLocaleString()}`
                )}
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/explore")}
                disabled={processingPayment}
              >
                Cancel
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
