import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  Calendar,
  ArrowRight,
  MessageSquare,
  Users
} from 'lucide-react';
import { applicationService, ApplicationData } from '@/services/supabase/applicationService';

export default function StudentApplications() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await applicationService.getStudentApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

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
    if (tab === 'all') return applications;
    return applications.filter(app => app.status === tab);
  };

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interviewed: applications.filter(a => a.status === 'interviewed').length,
    selected: applications.filter(a => a.status === 'selected').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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

        <TabsContent value={selectedTab} className="space-y-4 animate-fade-in">
          {filterApplications(selectedTab).length > 0 ? filterApplications(selectedTab).map((app) => {
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
                            <h3 className="text-lg font-semibold">{app.job?.title || 'Job Title'}</h3>
                            <Badge variant="outline" className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{app.job?.company?.name || 'Company'}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                            </div>
                          </div>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }) : null}

          {filterApplications(selectedTab).length === 0 && applications.length > 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Applications Here</h3>
                <p className="text-muted-foreground">You don't have any applications in this category.</p>
              </CardContent>
            </Card>
          )}

          {applications.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Start applying to jobs to track your progress here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
