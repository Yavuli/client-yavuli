import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, Plus, X, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

interface FormData {
  title: string;
  category: string;
  condition: string;
  price: string;
  originalPrice: string;
  description: string;
  city: string;
  college: string;
  reason: string;
  age: string;
  status: 'draft' | 'published';
}

const Sell = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    description: '',
    city: '',
    college: '',
    reason: '',
    age: '',
    status: 'published'
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (newImages.length + images.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "You can upload up to 5 images per listing.",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, ...newImages]);
    
    // Reset file input to allow uploading same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      condition: '',
      price: '',
      originalPrice: '',
      description: '',
      city: '',
      college: '',
      reason: '',
      age: '',
      status: 'published'
    });
    setImages([]);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a product title.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.price.trim()) {
      toast({
        title: "Price required",
        description: "Please enter a selling price.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a product description.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select a product category.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.condition) {
      toast({
        title: "Condition required",
        description: "Please select the product condition.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.city.trim()) {
      toast({
        title: "City required",
        description: "Please enter your city.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.college.trim()) {
      toast({
        title: "College required",
        description: "Please enter your college name.",
        variant: "destructive",
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your item.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (status === 'published' && !validateForm()) {
      return;
    }

    // For drafts, only require minimal validation
    if (status === 'draft' && !formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your draft.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert images to data URLs for now
      const imageDataUrls: string[] = [];
      
      for (const image of images) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        imageDataUrls.push(dataUrl);
      }

      const payload = {
        ...formData,
        status,
        images: imageDataUrls
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Get the access token from Supabase session
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${apiUrl}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: status === 'draft' ? "Draft saved!" : "Listing published!",
        description: status === 'draft' 
          ? "Your listing has been saved as a draft." 
          : "Your item is now live!",
      });

      // Reset form and redirect on successful publication
      if (status === 'published') {
        resetForm();
        // Redirect to explore page after 2 seconds
        setTimeout(() => {
          navigate('/explore');
        }, 2000);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save listing",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit('published');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sell Your Items on Yavuli | Student Marketplace"
        description="List your used textbooks, electronics, and other college items for sale on Yavuli. Reach thousands of students at your campus. Quick, easy, and secure."
        keywords="sell on Yavuli, student marketplace, sell textbooks, make money in college, list items for sale, Kishlaya Mishra"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">List Your Product</h1>
            <p className="text-muted-foreground">Fill in the details to sell your item on Yavuli</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <Card className="p-6 space-y-6">
              {/* Photos */}
              <div className="space-y-3">
                <Label htmlFor="image-upload">Product Photos *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Display selected images */}
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  {images.length < 5 && (
                    <label 
                      htmlFor="image-upload"
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer flex items-center justify-center bg-muted/30"
                    >
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Upload (max 5)</p>
                        <p className="text-xs text-muted-foreground mt-1">{images.length}/5</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., MacBook Pro 13 inch M1 2020"
                  required
                />
              </div>

              {/* Category and Condition */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, 'category')}
                    required
                  >
                    <SelectTrigger id="category">
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
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange(value, 'condition')}
                    required
                  >
                    <SelectTrigger id="condition">
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
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="5000"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="8000"
                    min="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product in detail..."
                  rows={5}
                  required
                />
              </div>

              {/* Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Delhi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College Name *</Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="e.g., IIT Delhi"
                    required
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Selling</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Upgrading to a newer model"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age of Item</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-hero text-white hover:shadow-glow"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Publish Listing
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSubmit('draft')}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save as Draft'
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By publishing, you agree to Yavuli's terms and conditions. Only verified college students can list items.
              </p>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;