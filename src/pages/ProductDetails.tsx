import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listingsAPI } from "@/lib/api"; // ✅ make sure this exists like in Explore.jsx
import {
  MapPin,
  Eye,
  Heart,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Package,
  Receipt
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch product by ID
        const response = await fetch(`https://server-yavuli.onrender.com/api/listings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
          setError("Product not found");
        } else {
          setProduct(data);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
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
                {product.condition && (
                  <Badge className="bg-accent text-white">{product.condition}</Badge>
                )}
                {product.verified && (
                  <Badge variant="outline" className="border-accent text-accent">
                    ✓ Verified Seller
                  </Badge>
                )}
              </div>

              <p className="text-4xl font-bold text-primary mb-2">₹{product.price?.toLocaleString()}</p>
              {product.original_price && (
                <p className="text-lg text-muted-foreground line-through">
                  ₹{product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            <Separator />

            {/* Seller Info */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="space-y-2 text-sm">
                {product.location_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {product.location_city}, {product.location_state}
                    </span>
                  </div>
                )}
                {product.college_name && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{product.college_name}</span>
                  </div>
                )}
                {product.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Posted on {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {product.views || 0} views • {product.favorites || 0} favorites
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-hero text-white hover:shadow-glow">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-accent text-accent hover:bg-accent hover:text-white"
              >
                Buy Now
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Seller
            </Button>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "No description provided."}
              </p>
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
                  <span className="text-muted-foreground">
                    Age: {product.age_of_item}
                  </span>
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
