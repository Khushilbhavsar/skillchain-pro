import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { SearchFilters } from '@/services/searchService';

// Re-export for convenience
export type FilterState = SearchFilters;

interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterProps {
  placeholder?: string;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  departmentOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  jobTypeOptions?: FilterOption[];
  locationOptions?: FilterOption[];
  yearOptions?: FilterOption[];
  showDepartmentFilter?: boolean;
  showJobTypeFilter?: boolean;
  showCgpaFilter?: boolean;
}

export function SearchAndFilter({
  placeholder = 'Search...',
  filters,
  onFiltersChange,
  departmentOptions = [],
  statusOptions = [],
  jobTypeOptions = [],
  locationOptions = [],
  yearOptions = [],
  showDepartmentFilter = true,
  showJobTypeFilter = false,
  showCgpaFilter = false,
}: SearchAndFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ query: filters.query });
  };

  const activeFilterCount = [
    filters.department && filters.department !== 'all',
    filters.year && filters.year !== 'all',
    filters.status && filters.status !== 'all',
    filters.jobType && filters.jobType !== 'all',
    filters.location && filters.location !== 'all',
    filters.minCgpa !== undefined,
    filters.maxCgpa !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={filters.query || ''}
          onChange={(e) => updateFilter('query', e.target.value)}
          className="pl-9"
        />
        {filters.query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => updateFilter('query', '')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {showDepartmentFilter && departmentOptions.length > 0 && (
          <Select
            value={filters.department || 'all'}
            onValueChange={(v) => updateFilter('department', v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {statusOptions.length > 0 && (
          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => updateFilter('status', v)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Advanced Filters Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {yearOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select
                    value={filters.year || 'all'}
                    onValueChange={(v) => updateFilter('year', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showJobTypeFilter && jobTypeOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={filters.jobType || 'all'}
                    onValueChange={(v) => updateFilter('jobType', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {jobTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {locationOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={filters.location || 'all'}
                    onValueChange={(v) => updateFilter('location', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locationOptions.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showCgpaFilter && (
                <div className="space-y-4">
                  <Label>CGPA Range</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.minCgpa || 0, filters.maxCgpa || 10]}
                      min={0}
                      max={10}
                      step={0.1}
                      onValueChange={([min, max]) => {
                        onFiltersChange({ ...filters, minCgpa: min, maxCgpa: max });
                      }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{filters.minCgpa?.toFixed(1) || '0.0'}</span>
                      <span>{filters.maxCgpa?.toFixed(1) || '10.0'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button className="flex-1" onClick={() => setIsOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
