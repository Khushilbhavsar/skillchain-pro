import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Plus, MapPin, Users, Trash2, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { interviewService, InterviewSlot, PlacementDrive } from '@/services/interviewService';
import { companyServiceDB, CompanyData } from '@/services/supabase/companyService';
import { jobServiceDB, JobData } from '@/services/supabase/jobServiceDB';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { useToast } from '@/hooks/use-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const typeColors: Record<string, string> = {
  technical: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  hr: 'bg-green-500/10 text-green-600 border-green-500/20',
  group_discussion: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  aptitude: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

export default function InterviewScheduling() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [showAssignStudent, setShowAssignStudent] = useState<string | null>(null);
  
  // Real data from Supabase
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);

  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    endTime: '09:30',
    companyId: '',
    jobId: '',
    location: '',
    type: 'technical' as const,
    capacity: 1,
  });

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [drivesData, slotsData, companiesData, jobsData, studentsData] = await Promise.all([
        interviewService.getPlacementDrives(),
        interviewService.getInterviewSlots(),
        companyServiceDB.getAllCompanies(),
        jobServiceDB.getAllJobs(),
        studentService.getAllStudents(),
      ]);
      setDrives(drivesData);
      setSlots(slotsData);
      setCompanies(companiesData);
      setJobs(jobsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayDrives = drives.filter(d => d.date === dateStr);
    const daySlots = slots.filter(s => s.date === dateStr);
    return { drives: dayDrives, slots: daySlots };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCreateSlot = async () => {
    try {
      const company = companies.find(c => c.id === newSlot.companyId);
      const job = jobs.find(j => j.id === newSlot.jobId);
      if (!company || !job) return;

      await interviewService.createSlot({
        ...newSlot,
        companyName: company.name,
        jobTitle: job.title,
      });

      await loadData();
      setShowCreateSlot(false);
      setNewSlot({
        date: '',
        startTime: '09:00',
        endTime: '09:30',
        companyId: '',
        jobId: '',
        location: '',
        type: 'technical',
        capacity: 1,
      });
      toast({ title: 'Slot Created', description: 'Interview slot has been created.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create slot.', variant: 'destructive' });
    }
  };

  const handleAssignStudent = async (slotId: string, studentId: string) => {
    try {
      await interviewService.assignStudent(slotId, studentId);
      await loadData();
      setShowAssignStudent(null);
      toast({ title: 'Student Assigned', description: 'Student has been assigned to the slot.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to assign student.', variant: 'destructive' });
    }
  };

  const handleRemoveStudent = async (slotId: string, studentId: string) => {
    try {
      await interviewService.removeStudent(slotId, studentId);
      await loadData();
      toast({ title: 'Student Removed', description: 'Student has been removed from the slot.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove student.', variant: 'destructive' });
    }
  };

  const selectedDateSlots = selectedDate ? slots.filter(s => s.date === selectedDate) : [];
  const selectedDateDrives = selectedDate ? drives.filter(d => d.date === selectedDate) : [];

  // Filter jobs by selected company
  const filteredJobs = jobs.filter(j => j.company_id === newSlot.companyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Interview Scheduling</h1>
          <p className="text-muted-foreground">Manage placement drives and interview slots</p>
        </div>
        <Dialog open={showCreateSlot} onOpenChange={setShowCreateSlot}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Slot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Interview Slot</DialogTitle>
              <DialogDescription>Schedule a new interview slot</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={newSlot.date} onChange={e => setNewSlot(prev => ({ ...prev, date: e.target.value }))} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={newSlot.type} onValueChange={(value: any) => setNewSlot(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="group_discussion">Group Discussion</SelectItem>
                      <SelectItem value="aptitude">Aptitude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={newSlot.startTime} onChange={e => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))} />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={newSlot.endTime} onChange={e => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Company</Label>
                <Select value={newSlot.companyId} onValueChange={(value) => setNewSlot(prev => ({ ...prev, companyId: value, jobId: '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job</Label>
                <Select value={newSlot.jobId} onValueChange={(value) => setNewSlot(prev => ({ ...prev, jobId: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select job" /></SelectTrigger>
                  <SelectContent>
                    {filteredJobs.map(j => (
                      <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input value={newSlot.location} onChange={e => setNewSlot(prev => ({ ...prev, location: e.target.value }))} placeholder="Conference Room A" />
                </div>
                <div>
                  <Label>Capacity</Label>
                  <Input type="number" min="1" value={newSlot.capacity} onChange={e => setNewSlot(prev => ({ ...prev, capacity: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateSlot(false)}>Cancel</Button>
              <Button onClick={handleCreateSlot}>Create Slot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const { drives: dayDrives, slots: daySlots } = getEventsForDate(day);
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-24 p-1 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    {dayDrives.slice(0, 1).map(drive => (
                      <div key={drive.id} className="text-xs bg-primary/20 text-primary rounded px-1 truncate mb-0.5">
                        {drive.companyName}
                      </div>
                    ))}
                    {daySlots.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {daySlots.length} slot{daySlots.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Drives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Upcoming Drives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {drives.filter(d => d.status !== 'completed').slice(0, 5).map(drive => (
              <div key={drive.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{drive.companyName}</span>
                  <Badge variant={drive.status === 'ongoing' ? 'default' : 'secondary'} className="capitalize">
                    {drive.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{drive.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(drive.date).toLocaleDateString()}
                </p>
              </div>
            ))}
            {drives.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No upcoming drives</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
            <CardDescription>
              {selectedDateDrives.length} drive(s), {selectedDateSlots.length} interview slot(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateSlots.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No interview slots scheduled for this date</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDateSlots.map(slot => (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{slot.companyName}</TableCell>
                      <TableCell>{slot.jobTitle}</TableCell>
                      <TableCell>
                        <Badge className={typeColors[slot.type]} variant="outline">
                          {slot.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {slot.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {slot.assignedStudents.length}/{slot.capacity}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {slot.assignedStudents.map(studentId => {
                            const student = students.find(s => s.id === studentId);
                            return (
                              <Badge key={studentId} variant="secondary" className="text-xs gap-1">
                                {student?.full_name?.split(' ')[0] || 'Unknown'}
                                <Trash2 className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveStudent(slot.id, studentId)} />
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {slot.assignedStudents.length < slot.capacity && (
                          <Dialog open={showAssignStudent === slot.id} onOpenChange={(open) => setShowAssignStudent(open ? slot.id : null)}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-1" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Student</DialogTitle>
                                <DialogDescription>Select a student to assign to this interview slot</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {students
                                  .filter(s => !slot.assignedStudents.includes(s.id))
                                  .map(student => (
                                    <div
                                      key={student.id}
                                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                                      onClick={() => handleAssignStudent(slot.id, student.id)}
                                    >
                                      <div>
                                        <p className="font-medium">{student.full_name}</p>
                                        <p className="text-sm text-muted-foreground">{student.roll_number || student.email}</p>
                                      </div>
                                      <Badge variant="secondary">{student.branch || 'N/A'}</Badge>
                                    </div>
                                  ))}
                                {students.filter(s => !slot.assignedStudents.includes(s.id)).length === 0 && (
                                  <p className="text-center text-muted-foreground py-4">No students available</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
