import { useState, useEffect } from "react";
import { listingsAPI } from '@/lib/api';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import SEO from "@/components/SEO";

const Explore = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { label: "All", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Books", value: "books" },
    { label: "Fashion", value: "fashion" },
    { label: "Furniture", value: "furniture" },
    { label: "Others", value: "others" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll();
      setProducts(Array.isArray(response) ? response : []);
      setFilteredProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || product.category?.toLowerCase() === activeCategory;

      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white selection:bg-primary/20">
      <SEO
        title="Yavuli – Explore Marketplace"
        description="Browse thousands of student-listed items. Find affordable textbooks, dorm essentials, and electronics at your campus."
        keywords="Yavuli explore, buy used textbooks, student marketplace, cheap electronics, college dorm essentials"
      />
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">Explore</h1>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              A curated collection of items from your trusted campus community.
            </p>
          </div>
          <div className="w-full md:w-[400px] relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              className="h-16 pl-14 pr-6 bg-slate-50 border-slate-100 rounded-[2rem] text-lg font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Categories */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "ghost"}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-full px-8 h-12 text-sm font-bold transition-all ${activeCategory === cat.value ? "shadow-lg shadow-primary/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {filteredProducts.length} Results
          </p>
          {(searchQuery || activeCategory !== "all") && (
            <Button
              variant="link"
              onClick={() => { setSearchQuery(""); setActiveCategory("all") }}
              className="h-auto p-0 text-primary font-bold"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-medium text-muted-foreground animate-pulse">Fetching items...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-50">
              <X className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">No matches found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search or category.</p>
            </div>
            <Button
              onClick={() => { setSearchQuery(""); setActiveCategory("all") }}
              className="rounded-xl px-10 h-14 font-bold"
            >
              Show all items
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;