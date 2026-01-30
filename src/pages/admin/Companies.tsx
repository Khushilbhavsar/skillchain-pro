import { useState, useEffect, useMemo } from 'react';
import { MemoizedCompanyCard } from '@/components/admin/MemoizedCompanyCard';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { DataPagination, PaginationState } from '@/components/ui/data-pagination';
import { companyServiceDB, CompanyData } from '@/services/supabase/companyService';
import { toast } from '@/hooks/use-toast';

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
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 9,
    totalItems: 0,
  });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await companyServiceDB.getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load companies. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesQuery = !filters.query || 
        company.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        (company.industry?.toLowerCase().includes(filters.query.toLowerCase()));
      
      const matchesStatus = filters.status === 'all' || 
        company.status === filters.status;

      return matchesQuery && matchesStatus;
    });
  }, [companies, filters]);

  // Update pagination total when filtered results change
  useEffect(() => {
    setPagination(prev => ({ ...prev, totalItems: filteredCompanies.length, page: 1 }));
  }, [filteredCompanies.length]);

  // Paginate the filtered results
  const paginatedCompanies = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredCompanies.slice(start, end);
  }, [filteredCompanies, pagination.page, pagination.pageSize]);

  // Convert to format expected by CompanyCard
  const displayCompanies = paginatedCompanies.map(c => ({
    id: c.id,
    name: c.name,
    logo: c.logo_url || undefined,
    industry: c.industry || 'Technology',
    website: c.website || '',
    contactPerson: '',
    contactEmail: c.contact_email || '',
    contactPhone: c.contact_phone || '',
    status: c.status as 'active' | 'inactive' | 'blacklisted',
    description: c.description || '',
    locations: c.location ? [c.location] : [],
    totalHires: c.total_hires,
    averagePackage: 0,
    createdAt: c.created_at,
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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

      {displayCompanies.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayCompanies.map((company) => (
              <MemoizedCompanyCard key={company.id} company={company} />
            ))}
          </div>
          <DataPagination
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
            pageSizeOptions={[9, 18, 36]}
          />
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Companies Yet"
          description="Add recruiting partners to start posting jobs and managing placements."
          action={{ label: 'Add Company', onClick: () => {} }}
        />
      ) : (
        <EmptyState
          icon={Building2}
          title="No Companies Found"
          description="No companies match your current filters. Try adjusting your search."
        />
      )}
    </div>
  );
}
