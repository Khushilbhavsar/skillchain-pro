import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { analyticsService, PlacementStats, DepartmentStats, MonthlyPlacement } from '@/services/analyticsService';
import { Briefcase } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--info))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [placementStats, setPlacementStats] = useState<PlacementStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [monthlyPlacements, setMonthlyPlacements] = useState<MonthlyPlacement[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, deptStats, monthly] = await Promise.all([
          analyticsService.getPlacementStats(),
          analyticsService.getDepartmentStats(),
          analyticsService.getMonthlyPlacements(),
        ]);
        setPlacementStats(stats);
        setDepartmentStats(deptStats);
        setMonthlyPlacements(monthly);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pieData = placementStats ? [
    { name: 'Placed', value: placementStats.placedStudents },
    { name: 'Unplaced', value: placementStats.unplacedStudents },
    { name: 'In Process', value: placementStats.inProcessStudents },
  ] : [];

  const hasData = placementStats && placementStats.totalStudents > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Analytics</h1>
        <p className="text-muted-foreground">Placement statistics and insights</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Placement Distribution</CardTitle></CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                    {pieData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No placement data available</p>
                  <p className="text-sm">Data will appear as students get placed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Department-wise Placement</CardTitle></CardHeader>
          <CardContent>
            {departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={120} className="text-xs" />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Bar dataKey="placementPercentage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No department data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
          <CardContent>
            {monthlyPlacements.some(m => m.placements > 0 || m.offers > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPlacements}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="placements" stroke="hsl(var(--primary))" strokeWidth={2} name="Placements" />
                  <Line type="monotone" dataKey="offers" stroke="hsl(var(--success))" strokeWidth={2} name="Offers" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No monthly data available yet</p>
                  <p className="text-sm">Data will appear as applications are processed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
