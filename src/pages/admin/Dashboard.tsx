import { useState, useEffect } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, Clock, TrendingUp, IndianRupee, Award, Building2, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { studentService } from '@/services/supabase/studentService';
import { companyServiceDB } from '@/services/supabase/companyService';
import { jobServiceDB } from '@/services/supabase/jobServiceDB';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    unplacedStudents: 0,
    inProcessStudents: 0,
    placementPercentage: 0,
  });
  const [companiesCount, setCompaniesCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [openJobsCount, setOpenJobsCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placementStats, companies, jobs, openJobs] = await Promise.all([
          studentService.getPlacementStats(),
          companyServiceDB.getCompanyCount(),
          jobServiceDB.getJobCount(),
          jobServiceDB.getOpenJobsCount(),
        ]);
        
        setStats(placementStats);
        setCompaniesCount(companies);
        setJobsCount(jobs);
        setOpenJobsCount(openJobs);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock monthly data for charts - this would come from analytics in a real implementation
  const monthlyData = [
    { month: 'Aug', placements: 0, offers: 0 },
    { month: 'Sep', placements: 0, offers: 0 },
    { month: 'Oct', placements: 0, offers: 0 },
    { month: 'Nov', placements: stats.placedStudents > 0 ? Math.floor(stats.placedStudents * 0.3) : 0, offers: 0 },
    { month: 'Dec', placements: stats.placedStudents > 0 ? Math.floor(stats.placedStudents * 0.4) : 0, offers: 0 },
    { month: 'Jan', placements: stats.placedStudents > 0 ? Math.floor(stats.placedStudents * 0.3) : 0, offers: 0 },
  ];

  // Mock skill demand data
  const skillDemand = [
    { skill: 'Python', demand: 85, trend: 'up' },
    { skill: 'React', demand: 78, trend: 'up' },
    { skill: 'Java', demand: 72, trend: 'stable' },
    { skill: 'AWS', demand: 68, trend: 'up' },
    { skill: 'Machine Learning', demand: 65, trend: 'up' },
    { skill: 'Node.js', demand: 58, trend: 'stable' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
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
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.name || 'Admin'}! Here's an overview of placement activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          variant="default" 
        />
        <StatCard 
          title="Placed" 
          value={stats.placedStudents} 
          subtitle={`${stats.placementPercentage}%`} 
          icon={UserCheck} 
          variant="success" 
        />
        <StatCard 
          title="In Process" 
          value={stats.inProcessStudents} 
          icon={Clock} 
          variant="warning" 
        />
        <StatCard 
          title="Companies" 
          value={companiesCount} 
          subtitle={`${openJobsCount} open jobs`}
          icon={Building2} 
          variant="primary" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Placements</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalStudents > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No placement data yet</p>
                  <p className="text-sm">Data will appear as students get placed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Demand Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillDemand.map((skill) => (
                <div key={skill.skill} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium">{skill.skill}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${skill.demand}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{skill.demand}%</span>
                  <span className={`text-xs ${skill.trend === 'up' ? 'text-success' : skill.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {skill.trend === 'up' ? '↑' : skill.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
