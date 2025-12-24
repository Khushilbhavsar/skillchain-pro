import { mockPlacementStats, mockDepartmentStats, mockSkillDemand, mockMonthlyPlacements } from './mockData';

export interface FilterOptions {
  year?: string;
  department?: string;
}

// Extended mock data for different years
const yearlyData: Record<string, typeof mockMonthlyPlacements> = {
  '2024': mockMonthlyPlacements,
  '2023': [
    { month: 'Aug', placements: 10, offers: 15 },
    { month: 'Sep', placements: 22, offers: 30 },
    { month: 'Oct', placements: 40, offers: 55 },
    { month: 'Nov', placements: 60, offers: 75 },
    { month: 'Dec', placements: 48, offers: 62 },
    { month: 'Jan', placements: 70, offers: 88 },
    { month: 'Feb', placements: 28, offers: 40 },
  ],
  '2022': [
    { month: 'Aug', placements: 8, offers: 12 },
    { month: 'Sep', placements: 18, offers: 25 },
    { month: 'Oct', placements: 35, offers: 48 },
    { month: 'Nov', placements: 52, offers: 68 },
    { month: 'Dec', placements: 42, offers: 55 },
    { month: 'Jan', placements: 62, offers: 78 },
    { month: 'Feb', placements: 25, offers: 35 },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  // Get placement stats with optional filters
  async getPlacementStats(filters?: FilterOptions) {
    await delay(200);
    let stats = { ...mockPlacementStats };
    
    if (filters?.department && filters.department !== 'all') {
      const deptStats = mockDepartmentStats.find(d => d.department === filters.department);
      if (deptStats) {
        stats = {
          ...stats,
          totalStudents: deptStats.totalStudents,
          placedStudents: deptStats.placedStudents,
          placementPercentage: deptStats.placementPercentage,
          averagePackage: deptStats.averagePackage,
        };
      }
    }
    
    return stats;
  },

  // Get department-wise stats
  async getDepartmentStats(filters?: FilterOptions) {
    await delay(200);
    return mockDepartmentStats;
  },

  // Get skill demand data
  async getSkillDemand(filters?: FilterOptions) {
    await delay(200);
    return mockSkillDemand;
  },

  // Get monthly placement trends
  async getMonthlyPlacements(filters?: FilterOptions) {
    await delay(200);
    const year = filters?.year || '2024';
    return yearlyData[year] || yearlyData['2024'];
  },

  // Get placement comparison by year
  async getYearComparison() {
    await delay(200);
    return [
      { year: '2022', placed: 242, total: 380 },
      { year: '2023', placed: 278, total: 420 },
      { year: '2024', placed: 312, total: 450 },
    ];
  },

  // Get top recruiting companies
  async getTopRecruiters() {
    await delay(200);
    return [
      { company: 'Google', hires: 15, package: 2800000 },
      { company: 'Amazon', hires: 22, package: 3100000 },
      { company: 'Microsoft', hires: 18, package: 3500000 },
      { company: 'TCS', hires: 60, package: 750000 },
      { company: 'Infosys', hires: 45, package: 850000 },
    ];
  },

  // Get available filter options
  getFilterOptions() {
    return {
      years: ['2024', '2023', '2022'],
      departments: ['all', ...mockDepartmentStats.map(d => d.department)],
    };
  },
};
