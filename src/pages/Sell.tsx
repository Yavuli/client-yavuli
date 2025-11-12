import { useRef } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, Plus, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';

const Sell = () => {
  const photosInputRef = useRef<HTMLInputElement>(null);
  const billInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/explore" className="inline-block mb-4">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">List Your Product</h1>
            <p className="text-muted-foreground">Fill in the details to sell your item on Yavuli</p>
          </div>

          <Card className="p-6 space-y-6 animate-fade-up">
            {/* Photos */}
            <div className="space-y-3">
              <Label htmlFor="photos">Product Photos *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div 
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer flex items-center justify-center bg-muted/30"
                  onClick={() => photosInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Upload</p>
                  </div>
                </div>
              </div>
              <Input 
                ref={photosInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="e.g., MacBook Pro 13 inch M1 2020"
                className="focus:ring-accent"
              />
            </div>

            {/* Category */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="books">Books & Study Material</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  className="focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="original-price">Original Price (₹)</Label>
                <Input
                  id="original-price"
                  type="number"
                  placeholder="8000"
                  className="focus:ring-accent"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail..."
                rows={5}
                className="focus:ring-accent resize-none"
              />
            </div>

            {/* Location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Delhi"
                  className="focus:ring-.accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College Name *</Label>
                <Input
                  id="college"
                  placeholder="e.g., IIT Delhi"
                  className="focus:ring-accent"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Selling</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Upgrading to a newer model"
                  className="focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age of Item</Label>
                <Input
                  id="age"
                  placeholder="e.g., 2 years"
                  className="focus:ring-accent"
                />
              </div>
            </div>

            {/* Bill Upload */}
            <div className="space-y-2">
              <Label>Bill / Receipt (Optional)</Label>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 hover:border-accent transition-colors cursor-pointer bg-muted/30"
                onClick={() => billInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload bill or purchase receipt</p>
                  <p className="text-xs text-muted-foreground mt-1">Helps build trust with buyers</p>
                </div>
              </div>
              <Input 
                ref={billInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*,application/pdf" 
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button className="flex-1 bg-gradient-hero text-white hover:shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Publish Listing
              </Button>
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By publishing, you agree to Yavuli's terms and conditions. Only verified college students can list items.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sell;
