import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Banknote,
  Calendar,
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { jobServiceDB, JobData } from '@/services/supabase/jobServiceDB';
import { applicationService } from '@/services/supabase/applicationService';

export default function StudentJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allJobs, studentData, applications] = await Promise.all([
          jobServiceDB.getAllJobs(),
          studentService.getCurrentStudent(),
          applicationService.getStudentApplications(),
        ]);

        setJobs(allJobs.filter(j => j.status === 'open' || j.status === 'in_progress'));
        setStudent(studentData);
        setAppliedJobIds(new Set(applications.map(a => a.job_id)));
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isEligible = (job: JobData) => {
    if (!student) return false;
    return (
      (student.cgpa || 0) >= (job.eligibility_min_cgpa || 0) &&
      (job.eligibility_departments.length === 0 || 
        job.eligibility_departments.includes(student.branch || '')) &&
      student.eligible_for_placement
    );
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const result = await applicationService.applyToJob(jobId);
      if (result) {
        setAppliedJobIds(prev => new Set([...prev, jobId]));
        toast.success('Application submitted successfully!');
      } else {
        toast.error('Failed to apply. Please try again.');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to apply. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-success/10 text-success';
      case 'internship': return 'bg-info/10 text-info';
      case 'contract': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const eligibleJobsCount = jobs.filter(j => isEligible(j)).length;
  const appliedCount = appliedJobIds.size;
  const upcomingDrivesCount = jobs.filter(j => j.drive_date).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Job Openings</h1>
          <p className="text-muted-foreground">Browse and apply to available positions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Open Positions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eligibleJobsCount}</p>
                <p className="text-sm text-muted-foreground">Eligible For</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appliedCount}</p>
                <p className="text-sm text-muted-foreground">Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingDrivesCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid - animate container only */}
      <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
        {filteredJobs.map((job) => {
          const eligible = isEligible(job);
          const hasApplied = appliedJobIds.has(job.id);
          const isApplying = applying === job.id;

          return (
            <Card key={job.id} className={!eligible ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company?.name || 'Company'}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getJobTypeColor(job.type)}>
                    {job.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description || 'No description available'}</p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{job.locations.slice(0, 2).join(', ') || 'Remote'}</span>
                  </div>
                  {job.package_min && job.package_max && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Banknote className="w-4 h-4" />
                      <span>₹{(job.package_min / 100000).toFixed(0)} - {(job.package_max / 100000).toFixed(0)} LPA</span>
                    </div>
                  )}
                </div>

                {/* Eligibility Criteria */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">ELIGIBILITY CRITERIA</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={(student?.cgpa || 0) >= (job.eligibility_min_cgpa || 0) ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'}>
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Min CGPA: {job.eligibility_min_cgpa || 0}
                    </Badge>
                    {job.eligibility_skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between text-sm">
                  {job.application_deadline && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <span className="text-muted-foreground">{job.applicants_count} applicants</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {hasApplied ? (
                    <Button disabled className="flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Applied
                    </Button>
                  ) : eligible ? (
                    <Button 
                      className="flex-1" 
                      onClick={() => handleApply(job.id)}
                      disabled={isApplying}
                    >
                      {isApplying ? 'Applying...' : 'Apply Now'}
                    </Button>
                  ) : (
                    <Button disabled variant="secondary" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Not Eligible
                    </Button>
                  )}
                  <Button variant="outline">Details</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredJobs.length === 0 && jobs.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Matching Jobs</h3>
            <p className="text-muted-foreground">Try adjusting your search to find more opportunities.</p>
          </CardContent>
        </Card>
      )}

      {jobs.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground">Check back later for new job openings from companies.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
