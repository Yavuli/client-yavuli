import { Heart, MapPin, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { listingsAPI } from "@/lib/api";
import { supabase } from "@/lib/supabase"; // Make sure you have supabase configured

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  location_city: string;
  college_name: string;
  condition: string;
  views: number;
  favorites: number;
  verified?: boolean;
}

const ProductCard = ({
  id,
  title,
  price,
  images,
  location_city,
  college_name,
  condition,
  views,
  favorites,
  verified,
}: ProductCardProps) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFavorites, setCurrentFavorites] = useState(favorites);

  // Update local state when favorites prop changes
  useEffect(() => {
    setCurrentFavorites(favorites);
  }, [favorites]);

  // Check if the current user has favorited this item
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('listing_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
          
        setIsFavorited(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkIfFavorited();
  }, [id, user]);

  const handleFavoriteClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please sign in to add items to favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        await listingsAPI.removeFavorite(id);
        setCurrentFavorites(prev => Math.max(0, prev - 1));
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await listingsAPI.addFavorite(id);
        setCurrentFavorites(prev => prev + 1);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  }, [id, isFavorited, user]);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full ${isFavorited ? 'bg-white text-destructive hover:bg-white/90' : 'bg-white/90 hover:bg-white hover:text-destructive'}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          <Badge className="absolute top-2 left-2 bg-accent text-white">
            {condition}
          </Badge>
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-lg font-bold text-primary">₹{price.toLocaleString()}</p>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{location_city}</span>
          {verified && (
            <Badge variant="outline" className="ml-auto text-xs h-5 px-1 border-accent text-accent">
              ✓ Verified
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1">{college_name}</p>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current text-destructive' : ''}`} />
            <span>{currentFavorites}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;