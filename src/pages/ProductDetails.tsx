import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext"; 
import { supabase } from "@/integrations/supabase/client"; 
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Eye,
  Heart,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Package,
  Receipt,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- New State for Favorites ---
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();   // Get current user
  const navigate = useNavigate();

  // 1. Record View Count and update product data
  useEffect(() => {
    const recordView = async () => {
      if (!id) return;
      try {
        const updatedListing = await listingsAPI.incrementViewCount(id);
        if (updatedListing) {
          // Update the product with the new view count
          setProduct((prev: any) => ({
            ...prev,
            views: updatedListing.views || 0,
          }));
        }
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };
    recordView();
  }, [id]);

  // 2. Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID found in URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Use the getById method directly
        const productData = await listingsAPI.getById(id);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 3. Check if Favorited Database Check
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !id) return;
      
      try {
        const { data } = await (supabase as any)
          .from('favorites')
          .select('id')
          .eq('listing_id', id)
          .eq('user_id', user.id)
          .maybeSingle(); // Returns data if exists, null if not

        if (data) setIsFavorited(true);
      } catch (err) {
        console.error("Error checking favorite:", err);
      }
    };
    checkFavoriteStatus();
  }, [id, user]);

  // 3.5 Subscribe to real-time updates for views and favorites count
  useEffect(() => {
    if (!id) return;

    try {
      const subscription = (supabase as any)
        .channel(`product:${id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `id=eq.${id}`,
          },
          (payload: any) => {
            if (payload.new?.id === id) {
              // Update product with new views and favorites count
              setProduct((prev: any) => ({
                ...prev,
                views: payload.new.views || 0,
                favorites: payload.new.favorites || 0,
              }));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
    }
  }, [id]);

  // 4. Handle Heart Click 
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Please sign in to favorite items");
      return;
    }
    if (!id) return;

    setFavLoading(true);
    try {
      if (isFavorited) {
        // Remove from DB
        const { error } = await (supabase as any)
          .from('favorites')
          .delete()
          .eq('listing_id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update the listing's favorite count
        const newCount = Math.max(0, (product.favorites || 0) - 1);
        const { error: updateError } = await (supabase as any)
          .from('listings')
          .update({ favorites: newCount })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating favorite count:', updateError);
        }

        // Update local product state
        setProduct((prev: any) => ({
          ...prev,
          favorites: newCount
        }));
        
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        // Add to DB
        const { error } = await (supabase as any)
          .from('favorites')
          .insert({ listing_id: id, user_id: user.id });

        if (error) throw error;

        // Update the listing's favorite count
        const newCount = (product.favorites || 0) + 1;
        const { error: updateError } = await (supabase as any)
          .from('listings')
          .update({ favorites: newCount })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating favorite count:', updateError);
        }

        // Update local product state
        setProduct((prev: any) => ({
          ...prev,
          favorites: newCount
        }));

        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Favorite error:", err);
      toast.error("Something went wrong");
    } finally {
      setFavLoading(false);
    }
  };

  // --- Loading State ---
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

  // --- Error State ---
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary">Product not found</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const priceStr =
    product?.price != null && !isNaN(Number(product.price))
      ? `₹${Number(product.price).toLocaleString()}`
      : "₹0";

  const originalPriceStr =
    product?.original_price != null && !isNaN(Number(product.original_price))
      ? `₹${Number(product.original_price).toLocaleString()}`
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Image Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={(product.images && product.images[0]) || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary">{product.title}</h1>
                
                {/* --- ❤️ THE ACTIVE HEART BUTTON --- */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`hover:text-destructive transition-colors ${isFavorited ? 'text-destructive' : 'text-muted-foreground'}`}
                  onClick={handleToggleFavorite}
                  disabled={favLoading}
                >
                  <Heart className={`h-8 w-8 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                {/* ---------------------------------- */}
                
              </div>

              <div className="flex items-center gap-2 mb-4">
                {product.condition && <Badge className="bg-accent text-white">{product.condition}</Badge>}
                {product.verified && (
                  <Badge variant="outline" className="border-accent text-accent">
                    ✓ Verified Seller
                  </Badge>
                )}
              </div>

              <p className="text-4xl font-bold text-primary mb-2">{priceStr}</p>
              {originalPriceStr && <p className="text-lg text-muted-foreground line-through">{originalPriceStr}</p>}
            </div>

            <Separator />

            {/* Seller Info Card */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="space-y-2 text-sm">
                {product.location_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {product.location_city}
                      {product.location_state ? `, ${product.location_state}` : ""}
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
                    <span>Posted on {new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {product.views || 0} views
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-hero text-white hover:shadow-glow"
                onClick={() => {
                  if (!product) return;
                  addToCart({
                    id: product.id, // Use product.id from database
                    title: product.title,
                    price: product.price,
                    image: product.images[0],
                    sellerId: product.seller_id
                  });
                  toast.success('Added to cart!');
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => {
                  if (!product || !user) {
                    toast.info("Please sign in to purchase");
                    navigate("/auth/login");
                    return;
                  }
                  
                  if (product.seller_id === user.id) {
                    toast.error("You cannot buy your own listing");
                    return;
                  }
                  
                  // Direct checkout - bypass cart
                  navigate(
                    `/checkout?listingId=${product.id}&price=${product.price}`
                  );
                }}
              >
                Buy Now
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Seller
            </Button>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description || "No description provided."}</p>
            </div>

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