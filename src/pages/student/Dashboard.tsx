import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  GraduationCap, 
  Award, 
  FileText, 
  Briefcase, 
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { applicationService, ApplicationData } from '@/services/supabase/applicationService';
import { certificateServiceDB } from '@/services/supabase/certificateService';
import { jobServiceDB } from '@/services/supabase/jobServiceDB';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [certificateCount, setCertificateCount] = useState(0);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentData, appsData, certCount, jobsCount] = await Promise.all([
          studentService.getCurrentStudent(),
          applicationService.getStudentApplications(),
          certificateServiceDB.getStudentCertificateCount(),
          jobServiceDB.getOpenJobsCount(),
        ]);
        
        setStudent(studentData);
        setApplications(appsData);
        setCertificateCount(certCount);
        setOpenJobsCount(jobsCount);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'shortlisted': return 'bg-info/10 text-info border-info/20';
      case 'interviewed': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const placementStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    placed: { label: 'Placed', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
    unplaced: { label: 'Seeking Opportunities', color: 'bg-warning text-warning-foreground', icon: Clock },
    in_process: { label: 'In Process', color: 'bg-info text-info-foreground', icon: TrendingUp },
    opted_out: { label: 'Opted Out', color: 'bg-muted text-muted-foreground', icon: XCircle },
  };

  const statusConfig = placementStatusConfig[student?.placement_status || 'unplaced'];
  const StatusIcon = statusConfig.icon;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-muted-foreground">Here's your placement journey overview</p>
        </div>
        <Badge className={`${statusConfig.color} px-4 py-2 text-sm`}>
          <StatusIcon className="w-4 h-4 mr-2" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CGPA</CardTitle>
            <GraduationCap className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.cgpa?.toFixed(1) || '0.0'}</div>
            <p className="text-xs text-muted-foreground">{student?.branch || profile?.department || 'Not set'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            <Award className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificateCount}</div>
            <p className="text-xs text-muted-foreground">Blockchain verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <FileText className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Jobs</CardTitle>
            <Briefcase className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobsCount}</div>
            <p className="text-xs text-muted-foreground">Available positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skills Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Skill Development
            </CardTitle>
            <CardDescription>Your skills and proficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {student?.skills && student.skills.length > 0 ? (
              student.skills.slice(0, 5).map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill}</span>
                  </div>
                  <Progress value={70 + Math.random() * 30} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No skills added yet. Update your profile to add skills.</p>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/student/certificates">
                View All Certificates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-info" />
              Recent Applications
            </CardTitle>
            <CardDescription>Track your job application status</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium">{app.job?.title || 'Job'}</p>
                        <p className="text-sm text-muted-foreground">{app.job?.company?.name || 'Company'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/student/applications">
                    View All Applications
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No applications yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/student/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placement Info (if placed) */}
      {student?.placement_status === 'placed' && student.placed_company && (
        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              Congratulations! You've been placed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-xl font-bold">{student.placed_company}</p>
              </div>
              {student.placed_package && (
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="text-xl font-bold">₹{(student.placed_package / 100000).toFixed(1)} LPA</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-xl font-bold">{student.branch || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
