import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Filters {
  category: string;
  priceRange: [number, number];
  condition: string;
  verified: boolean;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filter: Partial<Filters>) => void;
  onClearAll: () => void;
}

const FilterSidebar = ({ filters, onFilterChange, onClearAll }: FilterSidebarProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 100000]);

  const categories = [
    "Electronics",
    "Books & Study Material",
    "Furniture",
    "Clothing",
    "Services",
    "Sports & Outdoors",
    "Music & Instruments",
  ];

  const conditions = ["New", "Like New", "Used"];

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFilterChange({ category: checked ? category : "" });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    // Normalize condition to standard format: "new", "like-new", "used"
    let normalized = "";
    if (checked) {
      const lower = condition.toLowerCase();
      if (lower === "new") normalized = "new";
      else if (lower.includes("like")) normalized = "like-new";
      else if (lower === "used") normalized = "used";
    }
    onFilterChange({ condition: normalized });
  };

  const handleVerifiedChange = (checked: boolean) => {
    onFilterChange({ verified: checked });
  };

  const handlePriceRangeChange = (value: number[]) => {
    // ✅ FIX: cast to tuple
    setLocalPriceRange([value[0], value[1]] as [number, number]);
  };

  const handlePriceRangeCommit = (value: number[]) => {
    onFilterChange({ priceRange: [value[0], value[1]] as [number, number] });
  };

  const handleClearAll = () => {
    setLocalPriceRange([0, 100000]);
    onClearAll();
  };

  const isCategoryChecked = (category: string) => filters.category === category;
  const isConditionChecked = (condition: string) => filters.condition === condition;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" className="text-accent" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["category", "price", "condition"]} className="w-full">
        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={isCategoryChecked(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked === true)
                    }
                  />
                  <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={localPriceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                max={100000}
                step={1000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">₹{localPriceRange[0].toLocaleString()}</span>
                <span className="text-muted-foreground">₹{localPriceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition">
          <AccordionTrigger className="text-sm font-semibold">Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={isConditionChecked(condition)}
                    onCheckedChange={(checked) =>
                      handleConditionChange(condition, checked === true)
                    }
                  />
                  <Label htmlFor={condition} className="text-sm font-normal cursor-pointer">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Verified Sellers */}
        <AccordionItem value="verified">
          <AccordionTrigger className="text-sm font-semibold">Seller Type</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="verified-only"
                checked={filters.verified || false}
                onCheckedChange={(checked) => handleVerifiedChange(checked === true)}
              />
              <Label htmlFor="verified-only" className="text-sm font-normal cursor-pointer">
                Only verified sellers
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full bg-gradient-hero text-white hover:opacity-90"
        onClick={() => onFilterChange({ priceRange: localPriceRange })}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
