import { useState, useEffect } from "react";
import { listingsAPI } from '@/lib/api';
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X, Search } from "lucide-react";

const Explore = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [filters, setFilters] = useState<{
  category: string;
  priceRange: [number, number];
  condition: string;
  verified: boolean;
  sortBy: string;
}>({
  category: "",
  priceRange: [0, 100000],
  condition: "",
  verified: false,
  sortBy: "relevance",
});


  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll();
      setProducts(Array.isArray(response) ? response : []);
      setFilteredProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Subscribe to real-time updates for views and favorites
  useEffect(() => {
    try {
      const subscription = supabase
        .channel('public:listings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
          },
          (payload) => {
            // When a listing is updated (view/favorite count changed)
            const updatedListing = payload.new;
            
            // Update the products list with the new data
            setProducts(prevProducts =>
              prevProducts.map(product =>
                product.id === updatedListing.id
                  ? {
                      ...product,
                      views: updatedListing.views || 0,
                      favorites: updatedListing.favorites || 0,
                    }
                  : product
              )
            );
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      (product.price ?? 0) >= filters.priceRange[0] && (product.price ?? 0) <= filters.priceRange[1]
    );

    // Apply condition filter (exact match with normalized values)
    if (filters.condition) {
      filtered = filtered.filter(product => 
        product.condition === filters.condition
      );
    }

    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter(product => product.verified === true);
    }

    // Apply quick filters
    if (activeQuickFilter) {
      switch (activeQuickFilter) {
        case "trending":
        case "most-viewed":
          filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case "low-price":
          filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "new-arrivals":
          filtered = filtered.sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "views":
        filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "newest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      case "relevance":
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters, activeQuickFilter]);

  // Quick filter handlers
  const quickFilters = [
    { key: "trending", label: "🔥 Trending" },
    { key: "most-viewed", label: "👁️ Most Viewed" },
    { key: "low-price", label: "💰 Low Price" },
    { key: "new-arrivals", label: "✨ New Arrivals" }
  ];

  const handleQuickFilter = (filterKey: string) => {
    if (activeQuickFilter === filterKey) {
      setActiveQuickFilter("");
    } else {
      setActiveQuickFilter(filterKey);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      priceRange: [0, 100000],
      condition: "",
      verified: false,
      sortBy: "relevance"
    });
    setActiveQuickFilter("");
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.category || 
    filters.condition || 
    activeQuickFilter || 
    searchQuery || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 100000 ||
    filters.verified;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="text-lg font-semibold">Error loading products</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Hero Banner */}
        <div className="mb-6 rounded-xl bg-gradient-hero p-8 text-white animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Discover Student Marketplace</h1>
          <p className="text-white/90">Find amazing deals from verified students across India</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-fade-in">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for products, categories, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-card border-border focus:ring-accent"
            />
          </form>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange({ category: "" })}
                />
              </Badge>
            )}
            {filters.condition && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Condition: {filters.condition}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange({ condition: "" })}
                />
              </Badge>
            )}
            {filters.verified && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Verified Sellers
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange({ verified: false })}
                />
              </Badge>
            )}
            {activeQuickFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {quickFilters.find(f => f.key === activeQuickFilter)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setActiveQuickFilter("")}
                />
              </Badge>
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange({ priceRange: [0, 100000] })}
                />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs h-6 px-2"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in">
          {quickFilters.map((filter) => (
            <Badge 
              key={filter.key}
              variant={activeQuickFilter === filter.key ? "default" : "secondary"}
              className={`cursor-pointer whitespace-nowrap transition-all ${
                activeQuickFilter === filter.key 
                  ? "bg-accent text-white" 
                  : "hover:bg-accent hover:text-white"
              }`}
              onClick={() => handleQuickFilter(filter.key)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 animate-fade-in">
            <div className="sticky top-20">
              <FilterSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
              <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border overflow-y-auto p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>

              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange({ sortBy: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      images={product.images}
                      location_city={product.location_city}
                      college_name={product.college_name}
                      condition={product.condition}
                      views={product.views}
                      favorites={product.favorites}
                      verified={product.verified}
                    />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-muted-foreground mb-4">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-semibold">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="mt-2"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;