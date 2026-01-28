import { supabase } from '@/integrations/supabase/client';

export interface ApplicationData {
  id: string;
  student_id: string;
  job_id: string;
  status: string;
  applied_at: string;
  updated_at: string;
  // Joined data
  student?: {
    id: string;
    full_name: string;
    email: string;
    branch: string | null;
    cgpa: number;
  };
  job?: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
  };
}

export const applicationService = {
  // Get applications for current student
  async getStudentApplications(): Promise<ApplicationData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          id,
          title,
          company:companies(id, name)
        )
      `)
      .eq('student_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    return data || [];
  },

  // Get all applications (for admin)
  async getAllApplications(): Promise<ApplicationData[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student:students(id, full_name, email, branch, cgpa),
        job:jobs(
          id,
          title,
          company:companies(id, name)
        )
      `)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching all applications:', error);
      return [];
    }

    return data || [];
  },

  // Get applications for a specific job
  async getJobApplications(jobId: string): Promise<ApplicationData[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student:students(id, full_name, email, branch, cgpa)
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }

    return data || [];
  },

  // Apply to a job (with duplicate check)
  async applyToJob(jobId: string): Promise<{ data: ApplicationData | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    // Check for existing application
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'You have already applied to this job' };
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        student_id: user.id,
        job_id: jobId,
        status: 'applied',
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying to job:', error);
      return { data: null, error: 'Failed to submit application' };
    }

    // Update applicants count on the job (best effort, won't fail if this fails)
    try {
      const { data: job } = await supabase
        .from('jobs')
        .select('applicants_count')
        .eq('id', jobId)
        .single();
      
      if (job) {
        await supabase
          .from('jobs')
          .update({ applicants_count: (job.applicants_count || 0) + 1 })
          .eq('id', jobId);
      }
    } catch {
      // Ignore count update errors
    }

    return { data, error: null };
  },

  // Update application status (for admin/company)
  async updateApplicationStatus(id: string, status: string): Promise<ApplicationData | null> {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return null;
    }

    return data;
  },

  // Get application count for current student
  async getStudentApplicationCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id);

    if (error) {
      console.error('Error counting applications:', error);
      return 0;
    }

    return count || 0;
  },

  // Check if student has applied to a job
  async hasApplied(jobId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error checking application:', error);
      return false;
    }

    return !!data;
  },

  // Get application statistics
  async getApplicationStats(): Promise<{
    total: number;
    applied: number;
    shortlisted: number;
    interviewed: number;
    selected: number;
    rejected: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { total: 0, applied: 0, shortlisted: 0, interviewed: 0, selected: 0, rejected: 0 };
    }

    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('student_id', user.id);

    if (error || !data) {
      return { total: 0, applied: 0, shortlisted: 0, interviewed: 0, selected: 0, rejected: 0 };
    }

    return {
      total: data.length,
      applied: data.filter(a => a.status === 'applied').length,
      shortlisted: data.filter(a => a.status === 'shortlisted').length,
      interviewed: data.filter(a => a.status === 'interviewed').length,
      selected: data.filter(a => a.status === 'selected').length,
      rejected: data.filter(a => a.status === 'rejected').length,
    };
  },
};
