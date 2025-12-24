import { useState, useMemo } from 'react';
import { StudentTable } from '@/components/admin/StudentTable';
import { mockStudents } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { searchService } from '@/services/searchService';

const departmentOptions = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
];

const statusOptions = [
  { value: 'placed', label: 'Placed' },
  { value: 'not_placed', label: 'Not Placed' },
  { value: 'in_progress', label: 'In Progress' },
];

export default function StudentsPage() {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    department: 'all',
    status: 'all',
  });

  const filteredStudents = useMemo(() => {
    return searchService.searchStudents(mockStudents, filters);
  }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and placement status</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Student</Button>
      </div>

      <SearchAndFilter
        placeholder="Search students by name, email, or roll number..."
        filters={filters}
        onFiltersChange={setFilters}
        departmentOptions={departmentOptions}
        statusOptions={statusOptions}
      />

      <StudentTable students={filteredStudents} />
    </div>
  );
}
