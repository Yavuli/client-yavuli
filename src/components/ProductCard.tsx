import { Heart, MapPin, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { listingsAPI } from "@/lib/api";
import { supabase } from "@/lib/supabase";

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
  const [currentViews, setCurrentViews] = useState(views);
  const [viewCountedSession, setViewCountedSession] = useState<string>(`${id}-${Date.now()}`);

  // Update local state when props change
  useEffect(() => {
    setCurrentFavorites(favorites);
    setCurrentViews(views);
  }, [favorites, views]);

  // Increment view count when card is rendered (once per session)
  useEffect(() => {
    const incrementView = async () => {
      try {
        // Call the API to increment view count
        // This works for anonymous users too
        const response = await listingsAPI.incrementViewCount(id);
        
        // Update view count immediately from response
        if (response?.views) {
          setCurrentViews(response.views);
        } else {
          // If response doesn't have views, fetch the full listing
          const updatedListing = await listingsAPI.getById(id);
          if (updatedListing) {
            setCurrentViews(updatedListing.views || 0);
          }
        }
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    incrementView();
  }, [id]);

  // Check if the current user has favorited this item
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user) {
        setIsFavorited(false);
        return;
      }
      
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
        setIsFavorited(false);
      }
    };
    
    checkIfFavorited();
  }, [id, user]);

  // Subscribe to real-time updates for both views and favorites from other devices
  useEffect(() => {
    if (!id) return;

    try {
      const subscription = supabase
        .channel(`listings:${id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `id=eq.${id}`,
          },
          (payload) => {
            if (payload.new?.id === id) {
              // Update both favorites and views count from real-time update
              setCurrentFavorites(payload.new.favorites || 0);
              setCurrentViews(payload.new.views || 0);
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

  const handleFavoriteClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please sign in to add items to favorites');
      return;
    }

    // Prevent double clicks while loading
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // UNFAVORITE - Direct Supabase Call
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('listing_id', id)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Update the listing's favorite count
        const newCount = Math.max(0, currentFavorites - 1);
        const { error: updateError } = await supabase
          .from('listings')
          .update({ favorites: newCount })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating favorite count:', updateError);
          // Don't throw, the favorite was removed even if count update failed
        }

        setCurrentFavorites(newCount);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        // ADD FAVORITE - Direct Supabase Call
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({ 
            listing_id: id, 
            user_id: user.id 
          });

        if (insertError) throw insertError;

        // Update the listing's favorite count
        const newCount = currentFavorites + 1;
        const { error: updateError } = await supabase
          .from('listings')
          .update({ favorites: newCount })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating favorite count:', updateError);
          // Don't throw, the favorite was added even if count update failed
        }

        setCurrentFavorites(newCount);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id, isFavorited, user, currentFavorites]);

return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      
      {/* Container for Image + Heart + Badge */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        
        {/* 1. LINK: Wraps ONLY the image now */}
        <Link to={`/product/${id}`} className="block h-full w-full">
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* 2. BUTTON: Lives outside the link, floating on top */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full z-10 ${
            isFavorited 
              ? 'bg-white text-destructive hover:bg-white/90' 
              : 'bg-white/90 hover:bg-white hover:text-destructive'
          }`}
          onClick={handleFavoriteClick}
          disabled={isLoading}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* 3. BADGE: Also outside the link */}
        <Badge className="absolute top-2 left-2 bg-accent text-white pointer-events-none z-10">
          {condition}
        </Badge>
      </div>

      {/* Card Details Section */}
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
            <span>{currentViews}</span>
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