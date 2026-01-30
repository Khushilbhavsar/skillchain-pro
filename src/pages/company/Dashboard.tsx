import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Users, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { jobServiceDB, JobData } from '@/services/supabase/jobServiceDB';
import { companyServiceDB, CompanyData } from '@/services/supabase/companyService';
import { applicationService } from '@/services/supabase/applicationService';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    totalHires: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get the logged-in user's company based on their profile company_name
        const companyName = profile?.company_name;
        let currentCompany: CompanyData | null = null;
        
        if (companyName) {
          // Find company by name matching the logged-in user's company_name
          const companies = await companyServiceDB.getAllCompanies();
          currentCompany = companies.find(c => c.name === companyName) || null;
        }
        
        setCompany(currentCompany);

        if (currentCompany) {
          const companyJobs = await jobServiceDB.getJobsByCompany(currentCompany.id);
          setJobs(companyJobs);

          // Calculate stats
          const activeJobs = companyJobs.filter(j => j.status === 'open' || j.status === 'in_progress');
          const totalApplicants = companyJobs.reduce((sum, j) => sum + j.applicants_count, 0);
          const totalSelected = companyJobs.reduce((sum, j) => sum + j.selected_count, 0);

          setStats({
            totalJobs: companyJobs.length,
            activeJobs: activeJobs.length,
            totalApplicants: totalApplicants,
            totalHires: currentCompany.total_hires || totalSelected,
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profile?.company_name]);

  const formatPackage = (amount: number | null) => {
    if (!amount) return '₹0';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome, {profile?.company_name || profile?.name || 'Company'}</h1>
          <p className="text-muted-foreground">Manage your job postings and applicants</p>
        </div>
        <Button onClick={() => navigate('/company/post-job')}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">{stats.activeJobs} active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">Across all jobs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHires}</div>
            <p className="text-xs text-muted-foreground">Candidates selected</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted to-muted/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHires}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your latest job listings</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/company/jobs')}>
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge
                      variant={job.status === 'open' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatPackage(job.package_min)} - {formatPackage(job.package_max)} • {job.locations.join(', ') || 'Remote'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{job.applicants_count}</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No jobs posted yet</p>
                <Button variant="link" onClick={() => navigate('/company/post-job')}>
                  Post your first job
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
