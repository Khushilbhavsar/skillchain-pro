import { StatCard } from '@/components/admin/StatCard';
import { mockPlacementStats, mockMonthlyPlacements, mockSkillDemand } from '@/services/mockData';
import { Users, UserCheck, Clock, TrendingUp, IndianRupee, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const formatPackage = (pkg: number) => `₹${(pkg / 100000).toFixed(1)}L`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.name || 'Admin'}! Here's an overview of placement activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={mockPlacementStats.totalStudents} icon={Users} variant="default" />
        <StatCard title="Placed" value={mockPlacementStats.placedStudents} subtitle={`${mockPlacementStats.placementPercentage}%`} icon={UserCheck} variant="success" />
        <StatCard title="In Process" value={mockPlacementStats.inProcessStudents} icon={Clock} variant="warning" />
        <StatCard title="Highest Package" value={formatPackage(mockPlacementStats.highestPackage)} icon={Award} variant="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyPlacements}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offers" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Demand Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSkillDemand.slice(0, 6).map((skill) => (
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
