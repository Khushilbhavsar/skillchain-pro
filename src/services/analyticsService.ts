import { supabase } from '@/integrations/supabase/client';
import { studentService } from './supabase/studentService';
import { companyServiceDB } from './supabase/companyService';
import { jobServiceDB } from './supabase/jobServiceDB';

export interface FilterOptions {
  year?: string;
  department?: string;
}

export interface PlacementStats {
  totalStudents: number;
  placedStudents: number;
  unplacedStudents: number;
  inProcessStudents: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  totalOffers: number;
}

export interface DepartmentStats {
  department: string;
  totalStudents: number;
  placedStudents: number;
  placementPercentage: number;
  averagePackage: number;
}

export interface SkillDemand {
  skill: string;
  demand: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyPlacement {
  month: string;
  placements: number;
  offers: number;
}

export const analyticsService = {
  // Get placement stats from real data
  async getPlacementStats(filters?: FilterOptions): Promise<PlacementStats> {
    const stats = await studentService.getPlacementStats();
    
    // Get package information from placed students
    const { data: placedStudents } = await supabase
      .from('students')
      .select('placed_package')
      .eq('placement_status', 'placed')
      .not('placed_package', 'is', null);

    const packages = placedStudents?.map(s => Number(s.placed_package) || 0).filter(p => p > 0) || [];
    const averagePackage = packages.length > 0 ? packages.reduce((a, b) => a + b, 0) / packages.length : 0;
    const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;

    // Get total offers from applications
    const { count: totalOffers } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'selected');

    return {
      totalStudents: stats.totalStudents,
      placedStudents: stats.placedStudents,
      unplacedStudents: stats.unplacedStudents,
      inProcessStudents: stats.inProcessStudents,
      placementPercentage: stats.placementPercentage,
      averagePackage: Math.round(averagePackage),
      highestPackage,
      totalOffers: totalOffers || 0,
    };
  },

  // Get department-wise stats from real data
  async getDepartmentStats(filters?: FilterOptions): Promise<DepartmentStats[]> {
    const { data: students } = await supabase
      .from('students')
      .select('branch, placement_status, placed_package');

    if (!students) return [];

    // Group by department
    const deptMap = new Map<string, { total: number; placed: number; packages: number[] }>();

    students.forEach(student => {
      const dept = student.branch || 'Unknown';
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { total: 0, placed: 0, packages: [] });
      }
      const stats = deptMap.get(dept)!;
      stats.total++;
      if (student.placement_status === 'placed') {
        stats.placed++;
        if (student.placed_package) {
          stats.packages.push(Number(student.placed_package));
        }
      }
    });

    return Array.from(deptMap.entries()).map(([department, stats]) => ({
      department,
      totalStudents: stats.total,
      placedStudents: stats.placed,
      placementPercentage: stats.total > 0 ? Math.round((stats.placed / stats.total) * 100 * 10) / 10 : 0,
      averagePackage: stats.packages.length > 0 
        ? Math.round(stats.packages.reduce((a, b) => a + b, 0) / stats.packages.length)
        : 0,
    })).sort((a, b) => b.placementPercentage - a.placementPercentage);
  },

  // Get skill demand from job requirements
  async getSkillDemand(filters?: FilterOptions): Promise<SkillDemand[]> {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('eligibility_skills')
      .eq('status', 'open');

    if (!jobs) return [];

    // Count skill occurrences
    const skillCount = new Map<string, number>();
    jobs.forEach(job => {
      (job.eligibility_skills || []).forEach((skill: string) => {
        skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
      });
    });

    // Convert to array and sort
    const totalJobs = jobs.length || 1;
    return Array.from(skillCount.entries())
      .map(([skill, count]) => ({
        skill,
        demand: Math.round((count / totalJobs) * 100),
        trend: 'stable' as const, // Would need historical data for actual trend
      }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 10);
  },

  // Get monthly placement data
  async getMonthlyPlacements(filters?: FilterOptions): Promise<MonthlyPlacement[]> {
    // Get applications with their status changes
    const { data: applications } = await supabase
      .from('applications')
      .select('status, applied_at, updated_at')
      .order('applied_at', { ascending: true });

    if (!applications || applications.length === 0) {
      // Return empty months if no data
      return [
        { month: 'Aug', placements: 0, offers: 0 },
        { month: 'Sep', placements: 0, offers: 0 },
        { month: 'Oct', placements: 0, offers: 0 },
        { month: 'Nov', placements: 0, offers: 0 },
        { month: 'Dec', placements: 0, offers: 0 },
        { month: 'Jan', placements: 0, offers: 0 },
        { month: 'Feb', placements: 0, offers: 0 },
      ];
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = new Map<string, { placements: number; offers: number }>();

    applications.forEach(app => {
      const date = new Date(app.applied_at || app.updated_at || Date.now());
      const monthName = months[date.getMonth()];
      
      if (!monthlyData.has(monthName)) {
        monthlyData.set(monthName, { placements: 0, offers: 0 });
      }
      
      const data = monthlyData.get(monthName)!;
      data.offers++;
      if (app.status === 'selected') {
        data.placements++;
      }
    });

    // Return last 7 months of data
    const currentMonth = new Date().getMonth();
    const result: MonthlyPlacement[] = [];
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      const data = monthlyData.get(monthName) || { placements: 0, offers: 0 };
      result.push({ month: monthName, ...data });
    }

    return result;
  },

  // Get placement comparison by year
  async getYearComparison() {
    const stats = await studentService.getPlacementStats();
    // Return current year data - would need historical data for actual comparison
    return [
      { year: new Date().getFullYear().toString(), placed: stats.placedStudents, total: stats.totalStudents },
    ];
  },

  // Get top recruiting companies
  async getTopRecruiters() {
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name, total_hires')
      .order('total_hires', { ascending: false })
      .limit(5);

    if (!companies) return [];

    return companies.map(c => ({
      company: c.name,
      hires: c.total_hires || 0,
      package: 0, // Would need job data to calculate average
    }));
  },

  // Get available filter options
  async getFilterOptions() {
    const deptStats = await this.getDepartmentStats();
    return {
      years: [new Date().getFullYear().toString()],
      departments: ['all', ...deptStats.map(d => d.department)],
    };
  },
};
