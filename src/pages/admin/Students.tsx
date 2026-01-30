import { useState, useEffect, useMemo } from 'react';
import { StudentTable } from '@/components/admin/StudentTable';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { DataPagination, PaginationState } from '@/components/ui/data-pagination';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { toast } from '@/hooks/use-toast';

const departmentOptions = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Information Technology', label: 'Information Technology' },
];

const statusOptions = [
  { value: 'placed', label: 'Placed' },
  { value: 'unplaced', label: 'Not Placed' },
  { value: 'in_process', label: 'In Progress' },
];

export default function StudentsPage() {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    department: 'all',
    status: 'all',
  });
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error loading students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesQuery = !filters.query || 
        student.full_name.toLowerCase().includes(filters.query.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.query.toLowerCase()) ||
        (student.roll_number?.toLowerCase().includes(filters.query.toLowerCase()));
      
      const matchesDepartment = filters.department === 'all' || 
        student.branch === filters.department;
      
      const matchesStatus = filters.status === 'all' || 
        student.placement_status === filters.status;

      return matchesQuery && matchesDepartment && matchesStatus;
    });
  }, [students, filters]);

  // Update pagination total when filtered results change
  useEffect(() => {
    setPagination(prev => ({ ...prev, totalItems: filteredStudents.length, page: 1 }));
  }, [filteredStudents.length]);

  // Paginate the filtered results
  const paginatedStudents = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, pagination.page, pagination.pageSize]);

  // Convert to format expected by StudentTable
  const tableStudents = paginatedStudents.map(s => ({
    id: s.id,
    name: s.full_name,
    email: s.email,
    phone: s.phone || '',
    rollNumber: s.roll_number || '',
    department: s.branch || '',
    batch: s.batch || '',
    cgpa: Number(s.cgpa) || 0,
    skills: (s.skills || []).map((skill, idx) => ({
      id: `s${idx}`,
      name: skill,
      level: 'intermediate' as const,
      verified: false,
    })),
    placementStatus: s.placement_status as 'placed' | 'unplaced' | 'in_process' | 'opted_out',
    placedCompany: s.placed_company || undefined,
    placedPackage: s.placed_package || undefined,
    eligibleForPlacement: s.eligible_for_placement,
    createdAt: s.created_at,
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {tableStudents.length > 0 ? (
        <div className="animate-fade-in space-y-4">
          <StudentTable students={tableStudents} />
          <DataPagination
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
          />
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Students Yet"
          description="Students will appear here after they register for the placement portal."
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No Students Found"
          description="No students match your current filters. Try adjusting your search criteria."
        />
      )}

    </div>
  );
}
