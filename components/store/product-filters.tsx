"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subcategory {
  id: string | number;
  name: string;
  categoryId: string | number;
}

interface Category {
  id: string | number;
  name: string;
  subcategories?: Subcategory[];
}

interface ProductFiltersProps {
  categories: Category[];
  subcategories?: Subcategory[];
}

export function ProductFilters({
  categories
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category") || []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    searchParams.getAll("subcategory") || []
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Update price range from URL params on initial load
  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number.parseInt(minPrice) : 0,
        maxPrice ? Number.parseInt(maxPrice) : 500,
      ]);
    }
  }, [searchParams]);

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // If deselecting a category, also deselect its subcategories
        const categorySubcategories =
          categories
            .find((cat) => cat.id.toString() === categoryId)
            ?.subcategories?.map((sub) => sub.id.toString()) || [];

        setSelectedSubcategories((prevSubs) =>
          prevSubs.filter((subId) => !categorySubcategories.includes(subId))
        );

        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (
    subcategoryId: string,
    parentCategoryId: string
  ) => {
    setSelectedSubcategories((prev) => {
      const newSelection = prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId];

      // Check if we need to update parent category selection
      const categorySubcategories =
        categories
          .find((cat) => cat.id.toString() === parentCategoryId)
          ?.subcategories?.map((sub) => sub.id.toString()) || [];

      const selectedCategorySubcategories = categorySubcategories.filter(
        (subId) => newSelection.includes(subId)
      );

      // If all subcategories are selected, select the parent category
      if (
        selectedCategorySubcategories.length === categorySubcategories.length &&
        categorySubcategories.length > 0
      ) {
        setSelectedCategories((prevCats) =>
          prevCats.includes(parentCategoryId)
            ? prevCats
            : [...prevCats, parentCategoryId]
        );
      }
      // If no subcategories are selected, deselect the parent category
      else if (selectedCategorySubcategories.length === 0) {
        setSelectedCategories((prevCats) =>
          prevCats.filter((id) => id !== parentCategoryId)
        );
      }

      return newSelection;
    });
  };

  // Apply filters to URL
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Add selected categories
    selectedCategories.forEach((categoryId) => {
      params.append("category", categoryId);
    });

    // Add selected subcategories
    selectedSubcategories.forEach((subcategoryId) => {
      params.append("subcategory", subcategoryId);
    });

    // Add price range
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < 500) {
      params.set("maxPrice", priceRange[1].toString());
    }

    // Preserve other params
    for (const [key, value] of Array.from(searchParams.entries())) {
      if (!["category", "subcategory", "minPrice", "maxPrice"].includes(key)) {
        params.append(key, value);
      }
    }

    router.push(`/products?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange([0, 500]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subcategory");
    params.delete("minPrice");
    params.delete("maxPrice");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Filters</h3>
        <div className="flex flex-col space-y-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["categories", "price"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(
                        category.id.toString()
                      )}
                      onCheckedChange={() =>
                        handleCategoryChange(category.id.toString())
                      }
                    />
                    <div className="flex items-center space-x-1 flex-1">
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {category.name}
                      </label>

                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleCategoryExpansion(category.id.toString());
                            }}
                          >
                            {expandedCategories.includes(
                              category.id.toString()
                            ) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div
                        className={cn(
                          "pl-6 space-y-3 overflow-hidden transition-all",
                          expandedCategories.includes(category.id.toString())
                            ? "max-h-40"
                            : "max-h-0"
                        )}
                      >
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`subcategory-${subcategory.id}`}
                              checked={selectedSubcategories.includes(
                                subcategory.id.toString()
                              )}
                              onCheckedChange={() =>
                                handleSubcategoryChange(
                                  subcategory.id.toString(),
                                  category.id.toString()
                                )
                              }
                            />
                            <label
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {subcategory.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 500]}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active filters summary */}
      {(selectedCategories.length > 0 ||
        selectedSubcategories.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 500) && (
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.length > 0 && (
              <div className="text-xs bg-secondary px-2 py-1 rounded-md">
                {selectedCategories.length}{" "}
                {selectedCategories.length === 1 ? "category" : "categories"}
              </div>
            )}
            {selectedSubcategories.length > 0 && (
              <div className="text-xs bg-secondary px-2 py-1 rounded-md">
                {selectedSubcategories.length}{" "}
                {selectedSubcategories.length === 1
                  ? "subcategory"
                  : "subcategories"}
              </div>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <div className="text-xs bg-secondary px-2 py-1 rounded-md">
                Price: ${priceRange[0]} - ${priceRange[1]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
