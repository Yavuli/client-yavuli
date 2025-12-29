// src/lib/api.ts
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api" ||
  "https://server-yavuli.onrender.com/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  signup: (userData: any) => api.post("/auth/signup", userData),
  test: () => api.get("/auth"),
};

// Listings API
export const listingsAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/listings");
      console.log("Raw API Response:", response);

      // Handle case where response.data is the array directly
      if (Array.isArray(response.data)) {
        return response.data.map(transformListing);
      }

      // Handle case where response.data is an object with a data property
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformListing);
      }

      // Handle case where response.data is an object with a listings property
      if (response.data && response.data.listings) {
        return Array.isArray(response.data.listings)
          ? response.data.listings.map(transformListing)
          : [response.data.listings].map(transformListing);
      }

      // If we get here, the response format is unexpected
      console.warn("Unexpected API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching listings:", error);
      throw error;
    }
  },

  // Get user's favorites
  getFavorites: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      // Transform the favorites data if needed
      if (Array.isArray(response.data)) {
        return response.data.map(transformListing);
      }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformListing);
      }
      if (response.data && response.data.favorites) {
        return Array.isArray(response.data.favorites)
          ? response.data.favorites.map(transformListing)
          : [response.data.favorites].map(transformListing);
      }
      return [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  // Add favorite
  addFavorite: async (listingId: string) => {
    try {
      const response = await api.post(`/listings/${listingId}/favorite`);
      return response.data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  // Remove favorite
  removeFavorite: async (listingId: string) => {
    try {
      const response = await api.delete(`/listings/${listingId}/favorite`);
      return response.data;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  },

  // Increment view count by fetching the listing (GET /listings/:id already handles view counting)
  incrementViewCount: async (listingId: string) => {
    try {
      // Fetch the listing, which will automatically increment the view count on the server
      const response = await api.get(`/listings/${listingId}`);
      
      // Handle the response structure
      let listingData = response.data;
      if (response.data?.data) {
        listingData = response.data.data;
      }
      
      // Transform and return the listing with updated view count
      return transformListing(listingData);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      throw error;
    }
  },

  // Get single listing by ID
  // In api.ts
  getById: async (listingId: string) => {
    try {
      console.log(`[api] Fetching listing with ID: ${listingId}`);
      const response = await api.get(`/listings/${listingId}`);
      console.log("[api] Raw API response:", response);

      // Check if the response has a data property
      if (!response.data) {
        console.error("[api] No data in API response");
        throw new Error("No data received from server");
      }

      // Handle different response structures
      let listingData = response.data;
      if (response.data.data) {
        listingData = response.data.data; // Handle { data: {...} } wrapper
      }

      if (!listingData) {
        console.error("[api] No listing data found in response");
        throw new Error("No listing data found");
      }

      console.log("[api] Transformed listing data:", listingData);
      const transformed = transformListing(listingData);
      console.log("[api] After transformation:", transformed);
      return transformed;
    } catch (error) {
      console.error("[api] Error in getById:", error);
      throw error;
    }
  },
};

// Helper function to transform listing data
function transformListing(listing: any) {
  if (!listing) {
    console.warn('transformListing received null/undefined listing');
    return {
      id: 'error',
      title: 'Error Loading Product',
      price: 0,
      images: [],
      location_city: 'N/A',
      college_name: 'Error',
      condition: 'N/A',
      views: 0,
      favorites: 0,
      verified: false,
      description: 'There was an error loading this product.',
      original_price: null,
      location_state: '',
      created_at: new Date().toISOString(),
      why_selling: '',
      age_of_item: '',
      bill_uploaded: false,
      seller_id: '',
    };
  }

  return {
    id: listing.id || listing._id || 'unknown',
    title: listing.title || 'Untitled Listing',
    price: listing.price || 0,
    images: Array.isArray(listing.images) ? listing.images : [],
    location_city: listing.location || listing.location_city || 'N/A',
    college_name: listing.college_name || 'Your College',
    condition: listing.condition || 'N/A',
    views: listing.views || 0,
    favorites: listing.favorites || 0,
    verified: listing.verified || false,
    description: listing.description || '',
    original_price: listing.original_price || null,
    location_state: listing.location_state || '',
    created_at: listing.created_at || listing.createdAt || new Date().toISOString(),
    why_selling: listing.why_selling || '',
    age_of_item: listing.age_of_item || '',
    bill_uploaded: listing.bill_uploaded || false,
    seller_id: listing.seller_id || listing.userId || listing.user_id || '',
  };
}
// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[api] Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[api] Response error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const reportsAPI = {
  submitReport: (reportData: any) => api.post("/reports", reportData),
};

export default api;
