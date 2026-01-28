import { supabase } from '@/integrations/supabase/client';

export interface JobData {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  type: string;
  locations: string[];
  package_min: number | null;
  package_max: number | null;
  eligibility_min_cgpa: number;
  eligibility_departments: string[];
  eligibility_skills: string[];
  eligibility_max_backlogs: number;
  application_deadline: string | null;
  drive_date: string | null;
  status: string;
  applicants_count: number;
  selected_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  company?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export const jobServiceDB = {
  // Get all jobs with company info
  async getAllJobs(): Promise<JobData[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(id, name, logo_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    return data || [];
  },

  // Get jobs by company ID
  async getJobsByCompany(companyId: string): Promise<JobData[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(id, name, logo_url)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company jobs:', error);
      return [];
    }

    return data || [];
  },

  // Get job by ID
  async getJobById(id: string): Promise<JobData | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(id, name, logo_url)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching job:', error);
      return null;
    }

    return data;
  },

  // Create job
  async createJob(jobData: Partial<JobData>): Promise<JobData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        company_id: jobData.company_id,
        title: jobData.title || 'New Job',
        description: jobData.description,
        type: jobData.type || 'full_time',
        locations: jobData.locations || [],
        package_min: jobData.package_min,
        package_max: jobData.package_max,
        eligibility_min_cgpa: jobData.eligibility_min_cgpa || 0,
        eligibility_departments: jobData.eligibility_departments || [],
        eligibility_skills: jobData.eligibility_skills || [],
        eligibility_max_backlogs: jobData.eligibility_max_backlogs || 0,
        application_deadline: jobData.application_deadline,
        drive_date: jobData.drive_date,
        status: jobData.status || 'open',
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return null;
    }

    return data;
  },

  // Update job
  async updateJob(id: string, updates: Partial<JobData>): Promise<JobData | null> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      return null;
    }

    return data;
  },

  // Delete job
  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      return false;
    }

    return true;
  },

  // Get job count
  async getJobCount(): Promise<number> {
    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting jobs:', error);
      return 0;
    }

    return count || 0;
  },

  // Get open jobs count
  async getOpenJobsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    if (error) {
      console.error('Error counting open jobs:', error);
      return 0;
    }

    return count || 0;
  },
};
