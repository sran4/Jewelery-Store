"use client";

import { SortType } from "@/types";
import { SORT_OPTIONS } from "@/lib/constants";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ProductSortProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export function ProductSort({
  sortType,
  onSortChange,
  searchQuery,
  onSearchChange,
  resultCount,
}: ProductSortProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="font-medium">{resultCount}</span>
        <span>product{resultCount !== 1 ? "s" : ""} found</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Sort */}
        <div className="w-full sm:w-48">
          <Select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
