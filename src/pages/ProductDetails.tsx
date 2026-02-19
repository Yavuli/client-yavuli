import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactSellerBtn } from "@/components/ContactSellerBtn";
import {
  MapPin,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Package,
  Phone,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";
import SEO from "@/components/SEO";
import HighlightText from "@/components/HighlightText";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // 1. Fetch Product Data
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
      <SEO
        title={product.title}
        description={product.description || `Buy ${product.title} on Yavuli.`}
        image={product.images && product.images[0]}
        schema={{
          "@type": "Product",
          "name": product.title,
          "description": product.description || `Buy ${product.title} on Yavuli.`,
          "image": product.images || [],
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "INR", // Assuming Rupees based on earlier context
            "availability": "https://schema.org/InStock"
          }
        }}
      />
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Image Section */}
          <div className="space-y-3 animate-fade-in">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={(product.images && product.images[selectedImage]) || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {/* Thumbnail strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? 'border-accent ring-2 ring-accent/30 scale-105'
                      : 'border-border opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary"><HighlightText text={product.title} query={searchQuery} /></h1>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {product.condition && <Badge className="bg-accent text-white"><HighlightText text={product.condition} query={searchQuery} /></Badge>}
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
                      <HighlightText text={product.location_city + (product.location_state ? `, ${product.location_state}` : '')} query={searchQuery} />
                    </span>
                  </div>
                )}
                {product.college_name && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span><HighlightText text={product.college_name} query={searchQuery} /></span>
                  </div>
                )}
                {product.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted on {new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {product.seller_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">
                      {product.seller_name || "Verified Seller"}
                    </span>
                    <Button
                      variant="link"
                      className="h-auto px-0 text-primary"
                      onClick={() => {
                        if (user) {
                          window.open(`tel:${product.seller_phone}`);
                        } else {
                          toast.info("Please sign in to call the seller");
                          navigate("/auth/login");
                        }
                      }}
                    >
                      Call
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-hero text-white hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.some(item => item.id === product?.id)}
                onClick={() => {
                  if (!product) return;
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.images[0],
                    sellerId: product.seller_id
                  });
                  toast.success('Added to cart!');
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cartItems.some(item => item.id === product?.id) ? 'Already in Cart' : 'Add to Cart'}
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

                  navigate(
                    `/checkout?listingId=${product.id}&price=${product.price}`
                  );
                }}
              >
                Buy Now
              </Button>
            </div>


            <div className="space-y-3 mt-4">
              {/* Only show Chat button if I am NOT the seller */}
              {user?.id !== product.seller_id && (
                <ContactSellerBtn
                  listingId={product.id}
                  sellerId={product.seller_id}
                  currentUserId={user?.id || ""}
                />
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (!user) {
                  toast.info("Please sign in to call the seller");
                  navigate("/auth/login");
                  return;
                }
                if (product.seller_phone) {
                  window.open(`tel:${product.seller_phone}`);
                } else {
                  toast.info("Seller hasn't provided a phone number");
                }
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Seller
            </Button>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed"><HighlightText text={product.description || 'No description provided.'} query={searchQuery} /></p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Condition</h4>
                <p className="font-medium capitalize"><HighlightText text={product.condition} query={searchQuery} /></p>
              </Card>
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Age</h4>
                <p className="font-medium"><HighlightText text={product.age_of_item && product.age_of_item !== 'null' ? product.age_of_item : 'Not specified'} query={searchQuery} /></p>
              </Card>
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Original Price</h4>
                <p className="font-medium">{product.original_price ? `₹${Number(product.original_price).toLocaleString()}` : "Not specified"}</p>
              </Card>
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Reason for Selling</h4>
                <p className="font-medium text-sm line-clamp-2" title={product.why_selling}>
                  <HighlightText text={product.why_selling && product.why_selling !== 'null' ? product.why_selling : 'Not specified'} query={searchQuery} />
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;