import { useState, useEffect } from 'react';
import { StudentTable } from '@/components/admin/StudentTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchAndFilter, FilterState } from '@/components/search/SearchAndFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { studentService, StudentData } from '@/services/supabase/studentService';

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

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
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

  // Convert to format expected by StudentTable
  const tableStudents = filteredStudents.map(s => ({
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

      <StudentTable students={tableStudents} />

      {tableStudents.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          {students.length === 0 
            ? "No students registered yet. Students will appear here after they sign up."
            : "No students found matching your criteria."
          }
        </div>
      )}
    </div>
  );
}
