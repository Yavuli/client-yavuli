import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await listingsAPI.getFavorites(user.id);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);
  
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
        <p>Please sign in to view your favorite items.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <p>You haven't added any items to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;