import { useState } from 'react';
import { Student, PlacementStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Download, Mail, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface StudentTableProps {
  students: Student[];
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
}

const statusStyles: Record<PlacementStatus, { label: string; className: string }> = {
  placed: { label: 'Placed', className: 'bg-success/10 text-success border-success/20' },
  unplaced: { label: 'Unplaced', className: 'bg-muted text-muted-foreground border-border' },
  in_process: { label: 'In Process', className: 'bg-warning/10 text-warning border-warning/20' },
  opted_out: { label: 'Opted Out', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function StudentTable({ students, onViewStudent, onEditStudent, onDeleteStudent }: StudentTableProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const departments = [...new Set(students.map(s => s.department))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.placementStatus === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const formatPackage = (pkg?: number) => {
    if (!pkg) return '-';
    if (pkg >= 100000) {
      return `₹${(pkg / 100000).toFixed(2)} LPA`;
    }
    return `₹${pkg.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="unplaced">Unplaced</SelectItem>
            <SelectItem value="in_process">In Process</SelectItem>
            <SelectItem value="opted_out">Opted Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-accent rounded-lg animate-fade-in">
          <span className="text-sm font-medium">{selectedStudents.length} selected</span>
          <Button size="sm" variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Roll No.</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Package</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleSelectStudent(student.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{student.rollNumber}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>
                  <span className={cn('font-medium', student.cgpa >= 8 ? 'text-success' : student.cgpa >= 7 ? 'text-foreground' : 'text-warning')}>
                    {student.cgpa.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[student.placementStatus].className}>
                    {statusStyles[student.placementStatus].label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {student.placedCompany ? (
                    <div>
                      <p>{formatPackage(student.placedPackage)}</p>
                      <p className="text-xs text-muted-foreground">{student.placedCompany}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewStudent?.(student)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditStudent?.(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteStudent?.(student)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No students found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
