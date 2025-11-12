import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
<<<<<<< HEAD
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Harry Potter Book Set",
      price: 3000,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1619967945958-60addef2f651?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEhhcnJ5JTIwUG90dGVyJTIwQm9vayUyMFNldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    },
  ];
=======
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
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6 animate-fade-up">
            <div className="flex justify-center">
<<<<<<< HEAD
              <ShoppingBag className="h-24 w-24 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild>
              <Link to="/explore">Start Shopping</Link>
            </Button>
=======
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Discover amazing products from verified students</p>
            <Link to="/explore">
              <Button className="bg-gradient-hero text-white hover:shadow-glow">
                Start Shopping
              </Button>
            </Link>
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

=======
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <Link to="/explore" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-muted-foreground">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p>{item.quantity}</p>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal ({cartItems.length} items)</p>
                <p>₹{subtotal}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>₹{subtotal}</p>
              </div>
              <Button className="w-full mt-6">
                Proceed to Checkout (₹{subtotal})
=======
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
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
