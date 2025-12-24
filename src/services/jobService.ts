import { Job, Application } from '@/types';
import { mockJobs, mockApplications, mockStudents } from './mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores (replaceable with real API later)
let jobs = [...mockJobs];
let applications = [...mockApplications];

export type ApplicationStatus = 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';

export interface JobFormData {
  title: string;
  description: string;
  type: 'full_time' | 'internship' | 'contract';
  locations: string[];
  packageMin: number;
  packageMax: number;
  eligibilityCriteria: {
    minCgpa: number;
    departments: string[];
    skills: string[];
    backlogs: number;
  };
  applicationDeadline: string;
  driveDate?: string;
}

export const jobService = {
  // Get all jobs for a company
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    await delay(200);
    return jobs.filter(j => j.companyId === companyId);
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job | undefined> {
    await delay(200);
    return jobs.find(j => j.id === id);
  },

  // Create a new job posting
  async createJob(companyId: string, companyName: string, data: JobFormData): Promise<Job> {
    await delay(300);
    const newJob: Job = {
      id: `j${Date.now()}`,
      companyId,
      companyName,
      ...data,
      status: 'open',
      applicantsCount: 0,
      selectedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    jobs.push(newJob);
    return newJob;
  },

  // Update job
  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    await delay(300);
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');
    
    jobs[index] = { ...jobs[index], ...data };
    return jobs[index];
  },

  // Close job
  async closeJob(id: string): Promise<Job> {
    return this.updateJob(id, { status: 'closed' });
  },

  // Get applicants for a job
  async getApplicantsByJob(jobId: string): Promise<(Application & { student: typeof mockStudents[0] | undefined })[]> {
    await delay(200);
    const jobApplications = applications.filter(a => a.jobId === jobId);
    return jobApplications.map(app => ({
      ...app,
      student: mockStudents.find(s => s.id === app.studentId),
    }));
  },

  // Update applicant status
  async updateApplicantStatus(applicationId: string, status: ApplicationStatus): Promise<Application> {
    await delay(300);
    const index = applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');
    
    applications[index] = {
      ...applications[index],
      status,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return applications[index];
  },

  // Get all applications for a company's jobs
  async getApplicationsByCompany(companyId: string): Promise<Application[]> {
    await delay(200);
    const companyJobIds = jobs.filter(j => j.companyId === companyId).map(j => j.id);
    return applications.filter(a => companyJobIds.includes(a.jobId));
  },

  // Get application stats for a company
  async getApplicationStats(companyId: string): Promise<{
    total: number;
    applied: number;
    shortlisted: number;
    interviewed: number;
    selected: number;
    rejected: number;
  }> {
    await delay(200);
    const companyApps = await this.getApplicationsByCompany(companyId);
    return {
      total: companyApps.length,
      applied: companyApps.filter(a => a.status === 'applied').length,
      shortlisted: companyApps.filter(a => a.status === 'shortlisted').length,
      interviewed: companyApps.filter(a => a.status === 'interviewed').length,
      selected: companyApps.filter(a => a.status === 'selected').length,
      rejected: companyApps.filter(a => a.status === 'rejected').length,
    };
  },
};
