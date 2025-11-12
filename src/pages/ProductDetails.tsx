import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Eye, Heart, ShoppingCart, MessageCircle, Calendar, Package, Receipt, ArrowLeft } from "lucide-react";
import dummyListings from "@/data/dummyListings.json";

const ProductDetails = () => {
  const { id } = useParams();
  const product = dummyListings.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <Link to="/explore" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </Link>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary">{product.title}</h1>
                <Button variant="ghost" size="icon" className="hover:text-destructive">
                  <Heart className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-accent text-white">{product.condition}</Badge>
                {product.verified && (
                  <Badge variant="outline" className="border-accent text-accent">
                    ✓ Verified Seller
                  </Badge>
                )}
              </div>

              <p className="text-4xl font-bold text-primary mb-2">₹{product.price.toLocaleString()}</p>
              {product.original_price && (
                <p className="text-lg text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</p>
              )}
            </div>

            <Separator />

            {/* Seller Info */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{product.location_city}, {product.location_state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{product.college_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted on {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{product.views} views • {product.favorites} favorites</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link to="/cart" className="flex-1">
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </Link>
              <Link to="/cart" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-accent hover:text-accent-foreground">
                  Buy Now
                </Button>
              </Link>
            </div>
            
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Seller
            </Button>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Additional Details */}
            {product.why_selling && (
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold text-sm mb-2">Reason for Selling</h4>
                <p className="text-sm text-muted-foreground">{product.why_selling}</p>
              </Card>
            )}

            {product.age_of_item && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Age: {product.age_of_item}</span>
                </div>
                {product.bill_uploaded && (
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-accent" />
                    <span className="text-accent font-medium">Bill Available</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
