import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Eye, ArrowLeft } from 'lucide-react';
import dummyListings from "@/data/dummyListings.json";
import Navbar from "@/components/Navbar";

const mockProducts = dummyListings;

const Explore = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const applyFilters = () => {
    let products = mockProducts;

    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedConditions.length > 0) {
      products = products.filter(p => selectedConditions.includes(p.condition));
    }

    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(products);
  };

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setSelectedConditions([]);
    setFilteredProducts(mockProducts);
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Discover Student Marketplace</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find amazing deals from verified students across India
          </p>
          <div className="mt-6 flex justify-center">
            <Input placeholder="Search for products, categories, or descriptions..." className="w-full max-w-lg" />
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm">🔥 Trending</Button>
            <Button variant="outline" size="sm">👁️ Most Viewed</Button>
            <Button variant="outline" size="sm">💰 Low Price</Button>
            <Button variant="outline" size="sm">✨ New Arrivals</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 bg-card p-6 rounded-lg self-start top-8 sticky">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            <Button variant="ghost" className="mb-4 w-full" onClick={clearFilters}>Clear All</Button>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <div className="space-y-2">
                  {['Electronics', 'Books & Study Material', 'Furniture', 'Clothing', 'Services', 'Sports & Outdoors', 'Music & Instruments'].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={category} checked={selectedCategories.includes(category)} onCheckedChange={() => handleCategoryChange(category)} />
                      <label htmlFor={category} className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Price Range</h4>
                <Slider value={priceRange} onValueChange={setPriceRange} max={100000} step={1000} />
                <div className="flex justify-between text-sm mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Condition</h4>
                <div className="space-y-2">
                  {['New', 'Like New', 'Excellent', 'Good', 'Very Good', 'Used'].map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox id={condition} checked={selectedConditions.includes(condition)} onCheckedChange={() => handleConditionChange(condition)} />
                      <label htmlFor={condition} className="text-sm">{condition}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Seller Type</h4>
                <p className="text-sm text-muted-foreground">No options currently</p>
              </div>
            </div>

            <Button className="w-full mt-6" onClick={applyFilters}>Apply Filters</Button>
          </aside>

          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">{filteredProducts.length} products found</p>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105">
                    <div className="relative">
                      <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                        {product.condition}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                      <p className="font-bold text-xl mt-1">₹{product.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-2">{product.location_city}, {product.college_name}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{product.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{product.favorites}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
