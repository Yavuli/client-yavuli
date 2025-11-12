<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
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

<<<<<<< HEAD
const FilterSidebar = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
=======
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
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c

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

<<<<<<< HEAD
=======
  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFilterChange({ category: checked ? category : "" });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    onFilterChange({ condition: checked ? condition : "" });
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

>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
<<<<<<< HEAD
        <Button variant="ghost" size="sm" className="text-accent">
=======
        <Button variant="ghost" size="sm" className="text-accent" onClick={handleClearAll}>
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
          Clear All
        </Button>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["category", "price", "condition"]} className="w-full">
<<<<<<< HEAD
        {/* Categories */}
=======
        {/* Category */}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
<<<<<<< HEAD
                  <Checkbox id={category} />
                  <Label
                    htmlFor={category}
                    className="text-sm font-normal cursor-pointer"
                  >
=======
                  <Checkbox
                    id={category}
                    checked={isCategoryChecked(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked === true)
                    }
                  />
                  <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

<<<<<<< HEAD
        {/* Price Range */}
=======
        {/* Price */}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
<<<<<<< HEAD
                value={priceRange}
                onValueChange={setPriceRange}
=======
                value={localPriceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
                max={100000}
                step={1000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
<<<<<<< HEAD
                <span className="text-muted-foreground">₹{priceRange[0].toLocaleString()}</span>
                <span className="text-muted-foreground">₹{priceRange[1].toLocaleString()}</span>
=======
                <span className="text-muted-foreground">₹{localPriceRange[0].toLocaleString()}</span>
                <span className="text-muted-foreground">₹{localPriceRange[1].toLocaleString()}</span>
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
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
<<<<<<< HEAD
                  <Checkbox id={condition} />
                  <Label
                    htmlFor={condition}
                    className="text-sm font-normal cursor-pointer"
                  >
=======
                  <Checkbox
                    id={condition}
                    checked={isConditionChecked(condition)}
                    onCheckedChange={(checked) =>
                      handleConditionChange(condition, checked === true)
                    }
                  />
                  <Label htmlFor={condition} className="text-sm font-normal cursor-pointer">
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
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
<<<<<<< HEAD
              <Checkbox id="verified-only" />
=======
              <Checkbox
                id="verified-only"
                checked={filters.verified || false}
                onCheckedChange={(checked) => handleVerifiedChange(checked === true)}
              />
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              <Label htmlFor="verified-only" className="text-sm font-normal cursor-pointer">
                Only verified sellers
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

<<<<<<< HEAD
      <Button className="w-full bg-gradient-hero text-white hover:opacity-90">
=======
      <Button
        className="w-full bg-gradient-hero text-white hover:opacity-90"
        onClick={() => onFilterChange({ priceRange: localPriceRange })}
      >
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
