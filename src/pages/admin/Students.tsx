import { StudentTable } from '@/components/admin/StudentTable';
import { mockStudents } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and placement status</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Student</Button>
      </div>
      <StudentTable students={mockStudents} />
    </div>
  );
}
