// Search and Filter Service
// All search logic centralized here for easy replacement with real API

export interface SearchFilters {
  query?: string;
  department?: string;
  year?: string;
  status?: string;
  jobType?: string;
  location?: string;
  minCgpa?: number;
  maxCgpa?: number;
  skills?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Generic search function
export function searchItems<T extends Record<string, any>>(
  items: T[],
  filters: SearchFilters,
  searchableFields: (keyof T)[]
): T[] {
  let filtered = [...items];

  // Text search across specified fields
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter((item) =>
      searchableFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase().includes(query));
        }
        return false;
      })
    );
  }

  // Filter by department
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter((item) => 
      item.department === filters.department || 
      item.departments?.includes(filters.department)
    );
  }

  // Filter by year
  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter((item) => item.year === filters.year);
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  // Filter by job type
  if (filters.jobType && filters.jobType !== 'all') {
    filtered = filtered.filter((item) => item.type === filters.jobType);
  }

  // Filter by location
  if (filters.location && filters.location !== 'all') {
    filtered = filtered.filter((item) => 
      item.location === filters.location ||
      item.locations?.includes(filters.location)
    );
  }

  // Filter by CGPA range
  if (filters.minCgpa !== undefined) {
    filtered = filtered.filter((item) => (item.cgpa || 0) >= filters.minCgpa!);
  }
  if (filters.maxCgpa !== undefined) {
    filtered = filtered.filter((item) => (item.cgpa || 10) <= filters.maxCgpa!);
  }

  // Filter by skills
  if (filters.skills && filters.skills.length > 0) {
    filtered = filtered.filter((item) =>
      filters.skills!.some((skill) =>
        item.skills?.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((item) => 
      new Date(item.createdAt || item.postedDate || item.date) >= new Date(filters.dateFrom!)
    );
  }
  if (filters.dateTo) {
    filtered = filtered.filter((item) => 
      new Date(item.createdAt || item.postedDate || item.date) <= new Date(filters.dateTo!)
    );
  }

  return filtered;
}

// Paginate results
export function paginateItems<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): SearchResult<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
  };
}

// Sort items
export function sortItems<T>(
  items: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return sortOrder === 'asc' 
        ? aVal.getTime() - bVal.getTime() 
        : bVal.getTime() - aVal.getTime();
    }

    return 0;
  });
}

// Specific search functions for different entity types
export function searchStudents<T extends Record<string, any>>(items: T[], filters: SearchFilters): T[] {
  return searchItems(items, filters, ['name', 'email', 'rollNumber', 'department', 'skills']);
}

export function searchJobs<T extends Record<string, any>>(items: T[], filters: SearchFilters): T[] {
  return searchItems(items, filters, ['title', 'companyName', 'description', 'locations', 'skills']);
}

export function searchCompanies<T extends Record<string, any>>(items: T[], filters: SearchFilters): T[] {
  return searchItems(items, filters, ['name', 'industry', 'description']);
}

export const searchService = {
  searchItems,
  paginateItems,
  sortItems,
  searchStudents,
  searchJobs,
  searchCompanies,
};
