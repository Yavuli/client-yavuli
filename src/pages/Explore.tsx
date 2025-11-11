import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Eye } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Harry Potter Book Set', category: 'Books & Study Material', condition: 'Like New', price: 3000, location: 'Bangalore', college: 'Your College', views: 85, favorites: 20, image: 'https://images.unsplash.com/photo-1619967945958-60addef2f651?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEhhcnJ5JTIwUG90dGVyJTIwQm9vayUyMFNldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600' },
  { id: 2, name: 'Kindle Paperwhite', category: 'Electronics', condition: 'Excellent', price: 9000, location: 'Ahmedabad', college: 'Your College', views: 29, favorites: 5, image: 'https://images.unsplash.com/photo-1622122892817-45b38188db7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8S2luZGxlJTIwUGFwZXJ3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600' },
  { id: 3, name: 'Sneakers', category: 'Clothing', condition: 'Good', price: 3500, location: 'Kolkata', college: 'Your College', views: 76, favorites: 15, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U25lYWtlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600' },
  { id: 4, name: 'Wall Art Painting', category: 'Furniture', condition: 'Excellent', price: 5000, location: 'Jaipur', college: 'Your College', views: 38, favorites: 4, image: 'https://images.unsplash.com/photo-1549492423-0d3d37f17c3b?w=800' },
  { id: 5, name: 'Sony Headphones', category: 'Electronics', condition: 'Good', price: 8000, location: 'Delhi', college: 'Your College', views: 77, favorites: 5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  { id: 6, name: 'Gaming Laptop', category: 'Electronics', condition: 'Excellent', price: 95000, location: 'Chennai', college: 'Your College', views: 304, favorites: 104, image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  { id: 7, name: 'Stationery Bundle', category: 'Books & Study Material', condition: 'New', price: 1500, location: 'Ahmedabad', college: 'Your College', views: 47, favorites: 13, image: 'https://images.unsplash.com/photo-1593106718429-11f2653b6559?w=800' },
  { id: 8, name: 'Treadmill', category: 'Sports & Outdoors', condition: 'Excellent', price: 25000, location: 'Hyderabad', college: 'Your College', views: 205, favorites: 8, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc074?w=800' },
  { id: 9, name: 'Dumbbell Set', category: 'Sports & Outdoors', condition: 'Good', price: 4000, location: 'Hyderabad', college: 'Your College', views: 103, favorites: 10, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800' },
  { id: 10, name: 'Wooden Dining Table', category: 'Furniture', condition: 'Very Good', price: 15000, location: 'Mumbai', college: 'Your College', views: 58, favorites: 25, image: 'https://images.unsplash.com/photo-1604074134423-05a8a1f8149e?w=800' },
  { id: 11, name: 'Electric Guitar', category: 'Music & Instruments', condition: 'Excellent', price: 45000, location: 'Lucknow', college: 'Your College', views: 305, favorites: 75, image: 'https://images.unsplash.com/photo-1525201548821-4defa9844c00?w=800' },
  { id: 12, name: 'Mechanical Keyboard', category: 'Electronics', condition: 'Like New', price: 4500, location: 'Chennai', college: 'Your College', views: 147, favorites: 29, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800' },
  { id: 13, name: 'Drum Set', category: 'Music & Instruments', condition: 'Good', price: 30000, location: 'Lucknow', college: 'Your College', views: 4, favorites: 1, image: 'https://images.unsplash.com/photo-1598121213962-9728359b3fc9?w=800' },
  { id: 14, name: 'Football Shoes', category: 'Sports & Outdoors', condition: 'Good', price: 6000, location: 'Pune', college: 'Your College', views: 53, favorites: 20, image: 'https://images.unsplash.com/photo-1557891397-2d8a58b5a5c6?w=800' },
  { id: 15, name: 'Cricket Bat', category: 'Sports & Outdoors', condition: 'Excellent', price: 8000, location: 'Pune', college: 'Your College', views: 94, favorites: 41, image: 'https://images.unsplash.com/photo-1599399432485-6d0a7a395f87?w=800' },
  { id: 16, name: 'Office Chair', category: 'Furniture', condition: 'Good', price: 5000, location: 'Mumbai', college: 'Your College', views: 54, favorites: 6, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800' },
  { id: 17, name: 'Designer Handbag', category: 'Clothing', condition: 'Excellent', price: 12000, location: 'Kolkata', college: 'Your College', views: 73, favorites: 29, image: 'https://images.unsplash.com/photo-1566150905458-1bf1b299859a?w=800' },
  { id: 18, name: 'iPhone 13 Pro', category: 'Electronics', condition: 'Like New', price: 65000, location: 'Delhi', college: 'Your College', views: 205, favorites: 59, image: 'https://images.unsplash.com/photo-1632869986343-322420364349?w=800' },
  { id: 19, name: 'Table Lamp', category: 'Furniture', condition: 'Good', price: 2000, location: 'Jaipur', college: 'Your College', views: 86, favorites: 19, image: 'https://images.unsplash.com/photo-1543464275-a1f262a74c99?w=800' },
  { id: 20, name: 'Guitar', category: 'Music & Instruments', condition: 'Good', price: 7000, location: 'Bangalore', college: 'Your College', views: 15, favorites: 1, image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800' },
];

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Yavuli</h1>
          <div className="flex items-center space-x-4">
            <Input placeholder="Search products, books, services..." className="w-64 hidden md:block" />
            <Button variant="ghost">Explore</Button>
            <Button variant="ghost">Sell</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="outline">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                      {product.condition}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary">{product.name}</h3>
                    <p className="font-bold text-xl mt-1">₹{product.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-2">{product.location}, {product.college}</p>
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
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
