import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStudents, mockJobs, mockApplications } from '@/services/mockData';
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
  Clock,
  Filter
} from 'lucide-react';

// Using first student as the logged-in user
const currentStudent = mockStudents[0];
const appliedJobIds = mockApplications
  .filter(a => a.studentId === currentStudent.id)
  .map(a => a.jobId);

export default function StudentJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>(appliedJobIds);

  const openJobs = mockJobs.filter(job => job.status === 'open' || job.status === 'in_progress');

  const isEligible = (job: typeof mockJobs[0]) => {
    return (
      currentStudent.cgpa >= job.eligibilityCriteria.minCgpa &&
      job.eligibilityCriteria.departments.includes(currentStudent.department) &&
      currentStudent.eligibleForPlacement
    );
  };

  const filteredJobs = openJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => [...prev, jobId]);
    toast.success('Application submitted successfully!');
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-success/10 text-success';
      case 'internship': return 'bg-info/10 text-info';
      case 'contract': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
                <p className="text-2xl font-bold">{openJobs.length}</p>
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
                <p className="text-2xl font-bold">{openJobs.filter(j => isEligible(j)).length}</p>
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
                <p className="text-2xl font-bold">{appliedJobs.length}</p>
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
                <p className="text-2xl font-bold">{openJobs.filter(j => j.driveDate).length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.map((job) => {
          const eligible = isEligible(job);
          const hasApplied = appliedJobs.includes(job.id);

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
                      <CardDescription>{job.companyName}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getJobTypeColor(job.type)}>
                    {job.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{job.locations.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Banknote className="w-4 h-4" />
                    <span>₹{(job.packageMin / 100000).toFixed(0)} - {(job.packageMax / 100000).toFixed(0)} LPA</span>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">ELIGIBILITY CRITERIA</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={currentStudent.cgpa >= job.eligibilityCriteria.minCgpa ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'}>
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Min CGPA: {job.eligibilityCriteria.minCgpa}
                    </Badge>
                    {job.eligibilityCriteria.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                  <span className="text-muted-foreground">{job.applicantsCount} applicants</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {hasApplied ? (
                    <Button disabled className="flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Applied
                    </Button>
                  ) : eligible ? (
                    <Button className="flex-1" onClick={() => handleApply(job.id)}>
                      Apply Now
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

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
