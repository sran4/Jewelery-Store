"use client";

import { FilterOptions } from "@/types";
import { PRICE_RANGES } from "@/lib/constants";
import { Select } from "@/components/ui/Select";
import storeData from "@/data/products.json";
import { X } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      category: "all",
      priceRange: null,
      availability: "all",
      showDiscounted: false,
      showNew: false,
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.priceRange !== null ||
    filters.availability !== "all" ||
    filters.showDiscounted ||
    filters.showNew;

  return (
    <div className="bg-background border border-border rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={filters.category}
            onChange={(e) =>
              onFiltersChange({ ...filters, category: e.target.value })
            }
            options={storeData.categories.map((cat) => ({
              value: cat.slug,
              label: cat.name,
            }))}
          />
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    JSON.stringify(filters.priceRange) ===
                    JSON.stringify(range.value)
                  }
                  onChange={() =>
                    onFiltersChange({
                      ...filters,
                      priceRange: range.value as [number, number] | null,
                    })
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Availability</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="all"
                checked={filters.availability === "all"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    availability: e.target
                      .value as FilterOptions["availability"],
                  })
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">All Products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="inStock"
                checked={filters.availability === "inStock"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    availability: e.target
                      .value as FilterOptions["availability"],
                  })
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="outOfStock"
                checked={filters.availability === "outOfStock"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    availability: e.target
                      .value as FilterOptions["availability"],
                  })
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Out of Stock</span>
            </label>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="border-t border-border pt-6 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showDiscounted}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  showDiscounted: e.target.checked,
                })
              }
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">On Sale</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showNew}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  showNew: e.target.checked,
                })
              }
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">New Arrivals</span>
          </label>
        </div>
      </div>
    </div>
  );
}
