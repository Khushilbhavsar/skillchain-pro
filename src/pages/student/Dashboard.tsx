import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { mockStudents, mockApplications, mockCertificates, mockJobs } from '@/services/mockData';
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

export default function StudentDashboard() {
  const { profile } = useAuth();
  
  // Using first student as fallback for demo data
  const currentStudent = mockStudents[0];
  const studentApplications = mockApplications.filter(a => a.studentId === currentStudent.id);
  const studentCertificates = mockCertificates.filter(c => c.studentId === currentStudent.id);
  const eligibleJobs = mockJobs.filter(j => 
    j.status === 'open' && 
    currentStudent.cgpa >= j.eligibilityCriteria.minCgpa
  );
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

  const placementStatusConfig = {
    placed: { label: 'Placed', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
    unplaced: { label: 'Seeking Opportunities', color: 'bg-warning text-warning-foreground', icon: Clock },
    in_process: { label: 'In Process', color: 'bg-info text-info-foreground', icon: TrendingUp },
    opted_out: { label: 'Opted Out', color: 'bg-muted text-muted-foreground', icon: XCircle },
  };

  const statusConfig = placementStatusConfig[currentStudent.placementStatus];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-muted-foreground">Here's your placement journey overview</p>
        </div>
        <Badge className={`${statusConfig.color} px-4 py-2 text-sm`}>
          <statusConfig.icon className="w-4 h-4 mr-2" />
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
            <div className="text-2xl font-bold">{currentStudent.cgpa.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{profile?.department || currentStudent.department}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            <Award className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCertificates.length}</div>
            <p className="text-xs text-muted-foreground">Blockchain verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <FileText className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentApplications.length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eligible Jobs</CardTitle>
            <Briefcase className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleJobs.length}</div>
            <p className="text-xs text-muted-foreground">Open positions</p>
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
            <CardDescription>Your verified and in-progress skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStudent.skills.map((skill) => {
              const levelPercent = {
                beginner: 25,
                intermediate: 50,
                advanced: 75,
                expert: 100,
              }[skill.level];

              return (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      {skill.verified && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">{skill.level}</span>
                  </div>
                  <Progress value={levelPercent} className="h-2" />
                </div>
              );
            })}
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
            {studentApplications.length > 0 ? (
              <div className="space-y-4">
                {studentApplications.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium">{app.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{app.companyName}</p>
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
      {currentStudent.placementStatus === 'placed' && currentStudent.placedCompany && (
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
                <p className="text-xl font-bold">{currentStudent.placedCompany}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="text-xl font-bold">₹{(currentStudent.placedPackage! / 100000).toFixed(1)} LPA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-xl font-bold">{currentStudent.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
