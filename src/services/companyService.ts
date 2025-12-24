import { Company } from '@/types';
import { mockCompanies } from './mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store (replaceable with real API later)
let companies = [...mockCompanies];

export const companyService = {
  // Get company by ID
  async getCompanyById(id: string): Promise<Company | undefined> {
    await delay(200);
    return companies.find(c => c.id === id);
  },

  // Get all companies
  async getAllCompanies(): Promise<Company[]> {
    await delay(200);
    return [...companies];
  },

  // Get current company (mock - returns first active company)
  async getCurrentCompany(): Promise<Company> {
    await delay(200);
    return companies.find(c => c.status === 'active') || companies[0];
  },

  // Update company profile
  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    await delay(300);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    
    companies[index] = { ...companies[index], ...data };
    return companies[index];
  },

  // Get company stats
  async getCompanyStats(companyId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    totalHires: number;
  }> {
    await delay(200);
    const company = companies.find(c => c.id === companyId);
    return {
      totalJobs: 4,
      activeJobs: 2,
      totalApplicants: 156,
      totalHires: company?.totalHires || 0,
    };
  },
};
