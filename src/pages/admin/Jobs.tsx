import { useState, useEffect, useMemo } from 'react';
import { MemoizedJobCard } from '@/components/admin/MemoizedJobCard';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { DataPagination, PaginationState } from '@/components/ui/data-pagination';
import { jobServiceDB, JobData } from '@/services/supabase/jobServiceDB';
import { toast } from '@/hooks/use-toast';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'in_progress', label: 'In Progress' },
];

const jobTypeOptions = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

export default function JobsPage() {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    department: 'all',
    status: 'all',
    jobType: 'all',
  });
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 9,
    totalItems: 0,
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await jobServiceDB.getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load jobs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesQuery = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        (job.company?.name?.toLowerCase().includes(filters.query.toLowerCase())) ||
        job.locations.some(loc => loc.toLowerCase().includes(filters.query.toLowerCase()));
      
      const matchesStatus = filters.status === 'all' || 
        job.status === filters.status;

      const matchesType = !filters.jobType || filters.jobType === 'all' ||
        job.type === filters.jobType;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [jobs, filters]);

  // Update pagination total when filtered results change
  useEffect(() => {
    setPagination(prev => ({ ...prev, totalItems: filteredJobs.length, page: 1 }));
  }, [filteredJobs.length]);

  // Paginate the filtered results
  const paginatedJobs = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredJobs.slice(start, end);
  }, [filteredJobs, pagination.page, pagination.pageSize]);

  // Convert to format expected by JobCard
  const displayJobs = paginatedJobs.map(j => ({
    id: j.id,
    companyId: j.company_id,
    companyName: j.company?.name || 'Unknown Company',
    title: j.title,
    description: j.description || '',
    type: j.type as 'full_time' | 'internship' | 'contract',
    locations: j.locations,
    packageMin: Number(j.package_min) || 0,
    packageMax: Number(j.package_max) || 0,
    eligibilityCriteria: {
      minCgpa: Number(j.eligibility_min_cgpa) || 0,
      departments: j.eligibility_departments,
      skills: j.eligibility_skills,
      backlogs: j.eligibility_max_backlogs,
    },
    applicationDeadline: j.application_deadline || '',
    driveDate: j.drive_date || undefined,
    status: j.status as 'open' | 'closed' | 'in_progress' | 'completed',
    applicantsCount: j.applicants_count,
    selectedCount: j.selected_count,
    createdAt: j.created_at,
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-24 mb-2" />
            <Skeleton className="h-5 w-56" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-[250px] w-full" />
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
          <h1 className="text-3xl font-display font-bold">Jobs</h1>
          <p className="text-muted-foreground">Manage job postings and placement drives</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Post Job</Button>
      </div>

      <SearchAndFilter
        placeholder="Search jobs by title, company, or location..."
        filters={filters}
        onFiltersChange={setFilters}
        statusOptions={statusOptions}
        showJobTypeFilter
        jobTypeOptions={jobTypeOptions}
      />

      {displayJobs.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayJobs.map((job) => (
              <MemoizedJobCard key={job.id} job={job} />
            ))}
          </div>
          <DataPagination
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
            pageSizeOptions={[9, 18, 36]}
          />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Jobs Posted Yet"
          description="Create your first job posting to start receiving applications from students."
          action={{ label: 'Post Job', onClick: () => {} }}
        />
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No Jobs Found"
          description="No jobs match your current filters. Try adjusting your search criteria."
        />
      )}
    </div>
  );
}
