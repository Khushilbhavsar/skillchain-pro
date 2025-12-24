import { useState, useMemo } from 'react';
import { CompanyCard } from '@/components/admin/CompanyCard';
import { mockCompanies } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { searchService } from '@/services/searchService';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export default function CompaniesPage() {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    department: 'all',
    status: 'all',
  });

  const filteredCompanies = useMemo(() => {
    return searchService.searchCompanies(mockCompanies, filters);
  }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage recruiting partners</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Company</Button>
      </div>

      <SearchAndFilter
        placeholder="Search companies by name or industry..."
        filters={filters}
        onFiltersChange={setFilters}
        statusOptions={statusOptions}
        showDepartmentFilter={false}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No companies found matching your criteria.
        </div>
      )}
    </div>
  );
}
