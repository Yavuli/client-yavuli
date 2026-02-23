import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, Plus, X, Loader2, Camera, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";
import SEO from "@/components/SEO";
import { usersAPI } from "@/lib/api";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and get plain text for length validation */
const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/** Returns true only if the string has at least `min` "real" alphabetic/numeric chars */
const hasRealContent = (str: string, min = 3): boolean => {
  const cleaned = str.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '');
  return cleaned.length >= min;
};

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichEditor = ({ value, onChange, placeholder = 'Write here…' }: RichEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Set initial HTML once
  useEffect(() => {
    if (isFirstRender.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      isFirstRender.current = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exec = useCallback((command: string, value?: string) => {
    // Re-focus editor so execCommand works
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    // Trigger onChange after formatting
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarBtn = (
    label: React.ReactNode,
    cmd: string,
    cmdValue?: string,
    title?: string
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // prevent blur before execCommand
        exec(cmd, cmdValue);
      }}
      className="p-1.5 rounded hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
    </button>
  );

  return (
    <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-input">
        {toolbarBtn(<Heading1 className="h-4 w-4" />, 'formatBlock', 'h1', 'Heading 1')}
        {toolbarBtn(<Heading2 className="h-4 w-4" />, 'formatBlock', 'h2', 'Heading 2')}
        {toolbarBtn(<Heading3 className="h-4 w-4" />, 'formatBlock', 'h3', 'Heading 3')}
        <span className="w-px h-5 bg-border mx-1" />
        {toolbarBtn(<Bold className="h-4 w-4" />, 'bold', undefined, 'Bold')}
        {toolbarBtn(<Italic className="h-4 w-4" />, 'italic', undefined, 'Italic')}
        {toolbarBtn(<Underline className="h-4 w-4" />, 'underline', undefined, 'Underline')}
        <span className="w-px h-5 bg-border mx-1" />
        {toolbarBtn(<List className="h-4 w-4" />, 'insertUnorderedList', undefined, 'Bullet List')}
        {toolbarBtn(<ListOrdered className="h-4 w-4" />, 'insertOrderedList', undefined, 'Numbered List')}
        <span className="w-px h-5 bg-border mx-1" />
        {toolbarBtn(
          <span className="text-[11px] font-medium">P</span>,
          'formatBlock',
          'p',
          'Paragraph'
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[160px] p-3 focus:outline-none text-sm prose prose-sm dark:prose-invert max-w-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-1
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:mt-1
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1
          [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
      />
    </div>
  );
};

// ─── Age Options ──────────────────────────────────────────────────────────────

const AGE_OPTIONS = [
  { value: 'Less than 1 year', label: 'Less than 1 year' },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: `${i + 1} ${i + 1 === 1 ? 'year' : 'years'}`,
    label: `${i + 1} ${i + 1 === 1 ? 'year' : 'years'}`,
  })),
  { value: 'More than 20 years', label: 'More than 20 years' },
];

// ─── Sell Page ────────────────────────────────────────────────────────────────

const Sell = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (newImages.length + images.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "You can upload up to 5 images per listing.",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, ...newImages]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // ── Field handlers ────────────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html: string) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

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

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    // Title
    const titleTrimmed = formData.title.trim();
    if (!titleTrimmed) {
      toast({ title: "Title required", description: "Please enter a product title.", variant: "destructive" });
      return false;
    }
    if (titleTrimmed.length < 5) {
      toast({ title: "Title too short", description: "Title must be at least 5 characters.", variant: "destructive" });
      return false;
    }

    // Category
    if (!formData.category) {
      toast({ title: "Category required", description: "Please select a product category.", variant: "destructive" });
      return false;
    }

    // Condition
    if (!formData.condition) {
      toast({ title: "Condition required", description: "Please select the product condition.", variant: "destructive" });
      return false;
    }

    // Price
    const priceNum = Number(formData.price);
    if (!formData.price.trim() || isNaN(priceNum) || priceNum <= 0) {
      toast({ title: "Valid price required", description: "Selling price must be greater than ₹0.", variant: "destructive" });
      return false;
    }

    // Original Price
    const originalNum = Number(formData.originalPrice);
    if (!formData.originalPrice.trim() || isNaN(originalNum) || originalNum <= 0) {
      toast({ title: "Original price required", description: "Please enter the original purchase price.", variant: "destructive" });
      return false;
    }
    if (originalNum < priceNum) {
      toast({ title: "Price mismatch", description: "Original price should be ≥ the selling price.", variant: "destructive" });
      return false;
    }

    // Description (rich text)
    const descText = stripHtml(formData.description).trim();
    if (!descText) {
      toast({ title: "Description required", description: "Please enter a product description.", variant: "destructive" });
      return false;
    }
    if (descText.length < 20) {
      toast({ title: "Description too short", description: "Please write at least 20 characters in the description.", variant: "destructive" });
      return false;
    }

    // City / Location
    if (!formData.city.trim()) {
      toast({ title: "Location required", description: "Please enter a campus or meeting location.", variant: "destructive" });
      return false;
    }
    if (!hasRealContent(formData.city, 3)) {
      toast({ title: "Invalid location", description: "Location must contain at least 3 meaningful characters (no symbols only).", variant: "destructive" });
      return false;
    }

    // College
    if (!formData.college.trim()) {
      toast({ title: "College required", description: "Please enter your college name.", variant: "destructive" });
      return false;
    }
    if (!hasRealContent(formData.college, 3)) {
      toast({ title: "Invalid college name", description: "College name must contain at least 3 real characters.", variant: "destructive" });
      return false;
    }

    // Reason for selling
    if (!formData.reason.trim()) {
      toast({ title: "Reason required", description: "Please provide a reason for selling.", variant: "destructive" });
      return false;
    }
    if (formData.reason.trim().length < 5) {
      toast({ title: "Reason too short", description: "Reason for selling must be at least 5 characters.", variant: "destructive" });
      return false;
    }

    // Age of item
    if (!formData.age) {
      toast({ title: "Age required", description: "Please select the age of the item.", variant: "destructive" });
      return false;
    }

    // Images
    if (images.length === 0) {
      toast({ title: "Images required", description: "Please upload at least one image of your item.", variant: "destructive" });
      return false;
    }

    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (status === 'published' && !validateForm()) return;

    if (status === 'draft' && !formData.title.trim()) {
      toast({ title: "Title required", description: "Please enter a title for your draft.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
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

      const payload = { ...formData, status, images: imageDataUrls };

      console.log('--- SUBMITTING LISTING PAYLOAD ---');
      console.log('Title:', payload.title);
      console.log('Price:', payload.price);
      console.log('Reason:', payload.reason);
      console.log('Age:', payload.age);
      console.log('Original Price:', payload.originalPrice);
      console.log('City:', payload.city);
      console.log('Full Payload:', payload);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = session?.access_token;

      if (!token) throw new Error('Authentication required. Please log in first.');

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

      if (status === 'published') {
        resetForm();

        try {
          const bankData = await usersAPI.getBankDetails();
          if (bankData?.bank_account_number) {
            setTimeout(() => navigate('/explore'), 1500);
          } else {
            setTimeout(() => navigate('/payout-setup'), 1500);
          }
        } catch {
          setTimeout(() => navigate('/payout-setup'), 1500);
        }
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

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sell Your Items on Yavuli | Student Marketplace"
        description="List your used textbooks, electronics, and other college items for sale on Yavuli. Reach thousands of students at your campus. Quick, easy, and secure."
        keywords="sell on Yavuli, student marketplace, sell textbooks, make money in college, list items for sale"
      />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">List Your Product</h1>
            <p className="text-muted-foreground">Fill in the details to sell your item on Yavuli. All fields marked * are required.</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <Card className="p-6 space-y-6">

              {/* ── Photos ─────────────────────────────────────────────── */}
              <div className="space-y-3">
                <Label htmlFor="image-upload">Product Photos *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

                  {images.length < 5 && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors bg-muted/30 flex flex-col items-center justify-center gap-2 p-3">
                      <p className="text-xs text-muted-foreground font-medium">{images.length}/5 images</p>
                      <div className="flex gap-2">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-background hover:bg-accent/10 transition-colors border border-border"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] font-semibold text-muted-foreground">Upload</span>
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
                        <label
                          htmlFor="camera-capture"
                          className="cursor-pointer flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-background hover:bg-accent/10 transition-colors border border-border"
                        >
                          <Camera className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] font-semibold text-muted-foreground">Camera</span>
                          <input
                            id="camera-capture"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                            ref={cameraInputRef}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Title ──────────────────────────────────────────────── */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., MacBook Pro 13 inch M1 2020 (min. 5 characters)"
                  minLength={5}
                  required
                />
                {formData.title.trim().length > 0 && formData.title.trim().length < 5 && (
                  <p className="text-xs text-destructive">Title must be at least 5 characters</p>
                )}
              </div>

              {/* ── Category & Condition ───────────────────────────────── */}
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
                      <SelectItem value="books">Books &amp; Study Material</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="sports">Sports &amp; Outdoors</SelectItem>
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

              {/* ── Price ──────────────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original / MRP Price (₹) *</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 8000"
                    min="1"
                    required
                  />
                  {formData.originalPrice && formData.price &&
                    Number(formData.originalPrice) < Number(formData.price) && (
                      <p className="text-xs text-destructive">Original price must be ≥ selling price</p>
                    )}
                </div>
              </div>

              {/* ── Description (Rich Text) ────────────────────────────── */}
              <div className="space-y-2">
                <Label>Description * <span className="text-xs text-muted-foreground font-normal">(min. 20 chars — supports headings, bold, lists)</span></Label>
                <RichEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe your product in detail — condition, specs, usage history…"
                />
                {formData.description && stripHtml(formData.description).trim().length > 0 && stripHtml(formData.description).trim().length < 20 && (
                  <p className="text-xs text-destructive">Description must be at least 20 characters</p>
                )}
              </div>

              {/* ── Location ───────────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Meeting / Campus Location *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., BITS Pilani — Gate 2, Delhi — Lajpat Nagar"
                    required
                  />
                  {formData.city.trim().length > 0 && !hasRealContent(formData.city, 3) && (
                    <p className="text-xs text-destructive">Enter a meaningful location (at least 3 real characters)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College Name &amp; Campus *</Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="e.g., IIT Delhi | BITS Pilani (Goa)"
                    required
                  />
                  {formData.college.trim().length > 0 && !hasRealContent(formData.college, 3) && (
                    <p className="text-xs text-destructive">Enter a valid college name (at least 3 real characters)</p>
                  )}
                </div>
              </div>

              {/* ── Reason & Age ───────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Selling *</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Upgrading to a newer model"
                    required
                  />
                  {formData.reason.trim().length > 0 && formData.reason.trim().length < 5 && (
                    <p className="text-xs text-destructive">Reason must be at least 5 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age of Item *</Label>
                  <Select
                    value={formData.age}
                    onValueChange={(value) => handleSelectChange(value, 'age')}
                    required
                  >
                    <SelectTrigger id="age">
                      <SelectValue placeholder="Select age of item" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {AGE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Submit Buttons ─────────────────────────────────────── */}
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