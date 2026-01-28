import { supabase } from '@/integrations/supabase/client';

export interface CompanyData {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  logo_url: string | null;
  status: string;
  total_hires: number;
  contact_email: string | null;
  contact_phone: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const companyServiceDB = {
  // Get all companies
  async getAllCompanies(): Promise<CompanyData[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return data || [];
  },

  // Get company by ID
  async getCompanyById(id: string): Promise<CompanyData | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching company:', error);
      return null;
    }

    return data;
  },

  // Create company
  async createCompany(companyData: Partial<CompanyData>): Promise<CompanyData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: companyData.name || 'New Company',
        description: companyData.description,
        industry: companyData.industry,
        location: companyData.location,
        website: companyData.website,
        logo_url: companyData.logo_url,
        status: companyData.status || 'active',
        contact_email: companyData.contact_email,
        contact_phone: companyData.contact_phone,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return null;
    }

    return data;
  },

  // Update company
  async updateCompany(id: string, updates: Partial<CompanyData>): Promise<CompanyData | null> {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      return null;
    }

    return data;
  },

  // Delete company
  async deleteCompany(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      return false;
    }

    return true;
  },

  // Get company count
  async getCompanyCount(): Promise<number> {
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting companies:', error);
      return 0;
    }

    return count || 0;
  },

  // Get active companies count
  async getActiveCompaniesCount(): Promise<number> {
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      console.error('Error counting active companies:', error);
      return 0;
    }

    return count || 0;
  },
};
