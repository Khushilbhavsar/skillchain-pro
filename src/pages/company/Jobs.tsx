import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Users, Eye, Edit, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '@/services/companyService';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<string, string> = {
  open: 'bg-green-500/10 text-green-600 border-green-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  closed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

const typeLabels: Record<string, string> = {
  full_time: 'Full Time',
  internship: 'Internship',
  contract: 'Contract',
};

export default function CompanyJobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const company = await companyService.getCurrentCompany();
        const companyJobs = await jobService.getJobsByCompany(company.id);
        setJobs(companyJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleCloseJob = async (jobId: string) => {
    try {
      await jobService.closeJob(jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'closed' } : j));
      toast({
        title: 'Job Closed',
        description: 'The job posting has been closed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close the job.',
        variant: 'destructive',
      });
    }
  };

  const formatPackage = (min: number, max: number) => {
    const format = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
    return `${format(min)} - ${format(max)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Button onClick={() => navigate('/company/post-job')}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>View and manage all your job listings</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No jobs posted yet</p>
              <Button onClick={() => navigate('/company/post-job')}>
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[job.type]}</Badge>
                    </TableCell>
                    <TableCell>{formatPackage(job.packageMin, job.packageMax)}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {job.locations.join(', ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {job.applicantsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[job.status]} variant="outline">
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/company/applicants?jobId=${job.id}`)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          {job.status !== 'closed' && (
                            <DropdownMenuItem
                              onClick={() => handleCloseJob(job.id)}
                              className="text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Close Job
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
