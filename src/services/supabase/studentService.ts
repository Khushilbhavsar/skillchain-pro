import { supabase } from '@/integrations/supabase/client';

export interface StudentData {
  id: string;
  full_name: string;
  email: string;
  roll_number: string | null;
  phone: string | null;
  branch: string | null;
  batch: string | null;
  semester: number;
  cgpa: number;
  skills: string[];
  resume_url: string | null;
  placement_status: string;
  placed_company: string | null;
  placed_package: number | null;
  eligible_for_placement: boolean;
  created_at: string;
  updated_at: string;
}

export const studentService = {
  // Get current logged-in student's profile
  async getCurrentStudent(): Promise<StudentData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }

    return data;
  },

  // Get student by ID
  async getStudentById(id: string): Promise<StudentData | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }

    return data;
  },

  // Get all students (for admin/TPO)
  async getAllStudents(): Promise<StudentData[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    return data || [];
  },

  // Create or update student profile
  async upsertStudent(studentData: Partial<StudentData>): Promise<StudentData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('students')
      .upsert({
        id: user.id,
        email: user.email || '',
        full_name: studentData.full_name || user.user_metadata?.name || 'Student',
        ...studentData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting student:', error);
      return null;
    }

    return data;
  },

  // Update student profile
  async updateStudent(id: string, updates: Partial<StudentData>): Promise<StudentData | null> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      return null;
    }

    return data;
  },

  // Get placement statistics
  async getPlacementStats(): Promise<{
    totalStudents: number;
    placedStudents: number;
    unplacedStudents: number;
    inProcessStudents: number;
    placementPercentage: number;
  }> {
    const { data, error } = await supabase
      .from('students')
      .select('placement_status');

    if (error || !data) {
      return {
        totalStudents: 0,
        placedStudents: 0,
        unplacedStudents: 0,
        inProcessStudents: 0,
        placementPercentage: 0,
      };
    }

    const total = data.length;
    const placed = data.filter(s => s.placement_status === 'placed').length;
    const unplaced = data.filter(s => s.placement_status === 'unplaced').length;
    const inProcess = data.filter(s => s.placement_status === 'in_process').length;

    return {
      totalStudents: total,
      placedStudents: placed,
      unplacedStudents: unplaced,
      inProcessStudents: inProcess,
      placementPercentage: total > 0 ? Math.round((placed / total) * 100 * 10) / 10 : 0,
    };
  },
};
