import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6 animate-fade-up">
            <div className="flex justify-center">
              <ShoppingBag className="h-24 w-24 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild>
              <Link to="/explore">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
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
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
