import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStudents, mockApplications, mockJobs } from '@/services/mockData';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  Calendar,
  MapPin,
  Banknote,
  ArrowRight,
  MessageSquare,
  Users
} from 'lucide-react';

// Using first student as the logged-in user
const currentStudent = mockStudents[0];

// Expanded mock applications for demo
const studentApplications = [
  ...mockApplications.filter(a => a.studentId === currentStudent.id),
  {
    id: 'app-2',
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    jobId: 'j2',
    jobTitle: 'SDE Intern',
    companyName: 'Amazon',
    status: 'interviewed' as const,
    appliedAt: '2024-02-10',
    updatedAt: '2024-02-25',
  },
  {
    id: 'app-3',
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    jobId: 'j3',
    jobTitle: 'Product Manager',
    companyName: 'Microsoft',
    status: 'shortlisted' as const,
    appliedAt: '2024-02-15',
    updatedAt: '2024-02-20',
  },
];

export default function StudentApplications() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      case 'shortlisted': return <Users className="w-5 h-5 text-info" />;
      case 'interviewed': return <MessageSquare className="w-5 h-5 text-warning" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
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

  const getStepNumber = (status: string) => {
    const steps = ['applied', 'shortlisted', 'interviewed', 'selected'];
    return steps.indexOf(status) + 1;
  };

  const filterApplications = (tab: string) => {
    if (tab === 'all') return studentApplications;
    return studentApplications.filter(app => app.status === tab);
  };

  const statusCounts = {
    all: studentApplications.length,
    applied: studentApplications.filter(a => a.status === 'applied').length,
    shortlisted: studentApplications.filter(a => a.status === 'shortlisted').length,
    interviewed: studentApplications.filter(a => a.status === 'interviewed').length,
    selected: studentApplications.filter(a => a.status === 'selected').length,
    rejected: studentApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track your job application progress</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{statusCounts.all}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-muted-foreground">{statusCounts.applied}</p>
            <p className="text-sm text-muted-foreground">Applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-info">{statusCounts.shortlisted}</p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-warning">{statusCounts.interviewed}</p>
            <p className="text-sm text-muted-foreground">Interviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success">{statusCounts.selected}</p>
            <p className="text-sm text-muted-foreground">Selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
          <TabsTrigger value="selected">Selected</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filterApplications(selectedTab).map((app) => {
            const job = mockJobs.find(j => j.id === app.jobId);
            const stepNumber = getStepNumber(app.status);

            return (
              <Card key={app.id}>
                <CardContent className="py-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Company & Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
                            <Badge variant="outline" className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{app.companyName}</p>
                          
                          {job && (
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.locations.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Banknote className="w-4 h-4" />
                                <span>₹{(job.packageMin / 100000).toFixed(0)} - {(job.packageMax / 100000).toFixed(0)} LPA</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="lg:w-80">
                      <div className="flex items-center justify-between">
                        {['Applied', 'Shortlisted', 'Interview', 'Selected'].map((step, index) => {
                          const stepNum = index + 1;
                          const isComplete = stepNumber > stepNum || app.status === 'selected';
                          const isCurrent = stepNumber === stepNum;
                          const isRejected = app.status === 'rejected';

                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                                ${isComplete ? 'bg-success text-success-foreground' : ''}
                                ${isCurrent && !isRejected ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' : ''}
                                ${!isComplete && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                                ${isRejected && isCurrent ? 'bg-destructive text-destructive-foreground' : ''}
                              `}>
                                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                              </div>
                              <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      {app.status === 'applied' && (
                        <Button variant="ghost" size="sm" className="text-destructive flex-1 lg:flex-none">
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filterApplications(selectedTab).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground">You don't have any applications in this category.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
