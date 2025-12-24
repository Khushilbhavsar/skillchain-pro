import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Users, GraduationCap, Mail, Phone, Star } from 'lucide-react';
import { companyService } from '@/services/companyService';
import { jobService, ApplicationStatus } from '@/services/jobService';
import { Job, Application, Student } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<string, string> = {
  applied: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  shortlisted: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  interviewed: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  selected: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

type ApplicantWithStudent = Application & { student: Student | undefined };

export default function Applicants() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [applicants, setApplicants] = useState<ApplicantWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithStudent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const company = await companyService.getCurrentCompany();
        const companyJobs = await jobService.getJobsByCompany(company.id);
        setJobs(companyJobs);

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

  useEffect(() => {
    const loadApplicants = async () => {
      if (selectedJobId === 'all') {
        // Load all applicants for all jobs
        const allApplicants: ApplicantWithStudent[] = [];
        for (const job of jobs) {
          const jobApplicants = await jobService.getApplicantsByJob(job.id);
          allApplicants.push(...jobApplicants);
        }
        setApplicants(allApplicants);
      } else {
        const jobApplicants = await jobService.getApplicantsByJob(selectedJobId);
        setApplicants(jobApplicants);
      }
    };

    if (jobs.length > 0) {
      loadApplicants();
    }
  }, [selectedJobId, jobs]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await jobService.updateApplicantStatus(applicationId, newStatus);
      setApplicants(applicants.map(a =>
        a.id === applicationId ? { ...a, status: newStatus } : a
      ));
      toast({
        title: 'Status Updated',
        description: `Applicant status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
    }
  };

  const filteredApplicants = applicants.filter(a =>
    statusFilter === 'all' || a.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            Applicants ({filteredApplicants.length})
          </CardTitle>
          <CardDescription>
            {selectedJobId === 'all' ? 'All applicants across all jobs' : `Applicants for ${jobs.find(j => j.id === selectedJobId)?.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No applicants found</p>
            </div>
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
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {applicant.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{applicant.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.student?.department || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{applicant.jobTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {applicant.student?.cgpa.toFixed(1) || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(applicant.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[applicant.status]} variant="outline">
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          View
                        </Button>
                        <Select
                          value={applicant.status}
                          onValueChange={(value) => handleStatusChange(applicant.id, value as ApplicationStatus)}
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
          {selectedApplicant?.student && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedApplicant.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplicant.studentName}</h3>
                  <p className="text-muted-foreground">{selectedApplicant.student.rollNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApplicant.student.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>CGPA: {selectedApplicant.student.cgpa}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApplicant.student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApplicant.student.phone}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.student.skills.map(skill => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                      {skill.verified && <span className="ml-1 text-green-500">✓</span>}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Applied For</h4>
                <p className="text-muted-foreground">{selectedApplicant.jobTitle}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Current Status</h4>
                <Badge className={statusStyles[selectedApplicant.status]} variant="outline">
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
