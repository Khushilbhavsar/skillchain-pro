import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, GraduationCap, Mail, Star } from 'lucide-react';
import { applicationService, ApplicationData } from '@/services/supabase/applicationService';
import { jobServiceDB, JobData } from '@/services/supabase/jobServiceDB';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';

const statusStyles: Record<string, string> = {
  applied: 'bg-info/10 text-info border-info/20',
  shortlisted: 'bg-warning/10 text-warning border-warning/20',
  interviewed: 'bg-accent/10 text-accent-foreground border-accent/20',
  selected: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Applicants() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all jobs (company can see all jobs they have access to)
        const allJobs = await jobServiceDB.getAllJobs();
        setJobs(allJobs);

        // Get all applications
        const allApplications = await applicationService.getAllApplications();
        setApplications(allApplications);

        const jobIdParam = searchParams.get('jobId');
        if (jobIdParam) {
          setSelectedJobId(jobIdParam);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const handleStatusChange = async (applicationId: string, newStatus: string, application: ApplicationData) => {
    setUpdating(applicationId);
    try {
      const result = await applicationService.updateApplicationStatus(
        applicationId, 
        newStatus,
        {
          studentEmail: application.student?.email || '',
          studentName: application.student?.full_name || 'Applicant',
          jobTitle: application.job?.title || 'Position',
          companyName: application.job?.company?.name || 'Company',
        }
      );
      if (result) {
        setApplications(applications.map(a =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        ));
        toast({
          title: 'Status Updated',
          description: `Applicant status changed to ${newStatus}. Email notification sent.`,
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJobId === 'all' || app.job_id === selectedJobId;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-56" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Applicants</h1>
        <p className="text-muted-foreground">Review and manage job applicants</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Filter by Job</label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Applicants ({filteredApplications.length})
          </CardTitle>
          <CardDescription>
            {selectedJobId === 'all' 
              ? 'All applicants across all jobs' 
              : `Applicants for ${jobs.find(j => j.id === selectedJobId)?.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Applicants Found"
              description={applications.length === 0 
                ? "No applications have been submitted yet." 
                : "No applicants match your current filters."}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {application.student?.full_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.student?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {application.student?.branch || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.job?.title || 'Unknown Job'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {application.student?.cgpa?.toFixed(1) || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[application.status] || ''} variant="outline">
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplicant(application)}
                        >
                          View
                        </Button>
                        <Select
                          value={application.status}
                          onValueChange={(value) => handleStatusChange(application.id, value, application)}
                          disabled={updating === application.id}
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="interviewed">Interviewed</SelectItem>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Applicant Detail Modal */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              View complete profile and update status
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedApplicant.student?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedApplicant.student?.full_name || 'Unknown'}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedApplicant.student?.email || 'No email'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApplicant.student?.branch || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>CGPA: {selectedApplicant.student?.cgpa || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApplicant.student?.email || 'N/A'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Applied For</h4>
                <p className="text-muted-foreground">
                  {selectedApplicant.job?.title} at {selectedApplicant.job?.company?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Application Date</h4>
                <p className="text-muted-foreground">
                  {new Date(selectedApplicant.applied_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Current Status</h4>
                <Badge className={statusStyles[selectedApplicant.status] || ''} variant="outline">
                  {selectedApplicant.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApplicant(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
