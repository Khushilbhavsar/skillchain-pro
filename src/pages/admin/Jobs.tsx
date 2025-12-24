import { useState, useMemo } from 'react';
import { JobCard } from '@/components/admin/JobCard';
import { mockJobs } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { searchService } from '@/services/searchService';

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

  const filteredJobs = useMemo(() => {
    return searchService.searchJobs(mockJobs, filters);
  }, [filters]);

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  );
}
