import { supabase } from '../supabase';

export const listingsAPI = {
  // Get all listings
  getAll: async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get a single listing by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get popular listings
  getPopular: async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('views', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  // Add to favorites
  addFavorite: async (listingId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .upsert([{ listing_id: listingId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove from favorites
  removeFavorite: async (listingId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('listing_id', listingId);
    
    if (error) throw error;
    return true;
  },

  // Get user's favorites
  getFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        listing:listings!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(item => ({
      ...item.listing,
      is_favorited: true
    }));
  },

  // Increment view count
  incrementViewCount: async (listingId: string) => {
    const { data, error } = await supabase.rpc('increment_view_count', {
      listing_id_param: listingId
    });
    
    if (error) throw error;
    return data;
  },
};
