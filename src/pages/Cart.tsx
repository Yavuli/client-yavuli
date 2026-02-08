import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    // Add any additional checkout logic here
    navigate('/checkout'); // You'll need to create a Checkout page
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-12 animate-fade-up">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-muted/50 flex items-center justify-center ring-8 ring-muted/20">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/60" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Your cart is empty</h2>
              <p className="text-muted-foreground text-lg">
                Discover amazing products from verified students
              </p>
            </div>
            <Link to="/explore">
              <Button size="lg" className="bg-gradient-hero text-white hover:shadow-glow px-8 h-12 text-base font-semibold group transition-all">
                Start Shopping
                <Plus className="ml-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-lg font-bold text-primary mt-1">₹{item.price.toLocaleString()}</p>

                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                      Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          <div>
            <Card className="p-6 space-y-4 sticky top-24">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-accent">Free</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <Button
                className="w-full bg-gradient-hero text-white hover:shadow-glow"
                onClick={handleCheckout}
              >
                Proceed to Checkout (₹{cartTotal.toLocaleString()})
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
