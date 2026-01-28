import { supabase } from '@/integrations/supabase/client';

export interface CertificateData {
  id: string;
  student_id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  file_url: string | null;
  verified: boolean;
  blockchain_hash: string | null;
  created_at: string;
  // Joined data
  student?: {
    id: string;
    full_name: string;
  };
}

export const certificateServiceDB = {
  // Get certificates for current student
  async getStudentCertificates(): Promise<CertificateData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }

    return data || [];
  },

  // Get all certificates (for admin)
  async getAllCertificates(): Promise<CertificateData[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        student:students(id, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all certificates:', error);
      return [];
    }

    return data || [];
  },

  // Get certificate by ID
  async getCertificateById(id: string): Promise<CertificateData | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        student:students(id, full_name)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }

    return data;
  },

  // Create certificate
  async createCertificate(certData: Partial<CertificateData>): Promise<CertificateData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        student_id: user.id,
        title: certData.title || 'New Certificate',
        issuer: certData.issuer || 'Unknown',
        issue_date: certData.issue_date,
        file_url: certData.file_url,
        verified: certData.verified || false,
        blockchain_hash: certData.blockchain_hash,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating certificate:', error);
      return null;
    }

    return data;
  },

  // Verify certificate by hash
  async verifyCertificateByHash(hash: string): Promise<CertificateData | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        student:students(id, full_name)
      `)
      .eq('blockchain_hash', hash)
      .maybeSingle();

    if (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }

    return data;
  },

  // Get certificate count for current student
  async getStudentCertificateCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id);

    if (error) {
      console.error('Error counting certificates:', error);
      return 0;
    }

    return count || 0;
  },

  // Get verified certificates count
  async getVerifiedCertificateCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('verified', true);

    if (error) {
      console.error('Error counting verified certificates:', error);
      return 0;
    }

    return count || 0;
  },
};
