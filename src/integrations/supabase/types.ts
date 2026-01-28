export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          id: string
          job_id: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          id?: string
          job_id: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          id?: string
          job_id?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          blockchain_hash: string | null
          created_at: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          issuer: string
          student_id: string
          title: string
          verified: boolean | null
        }
        Insert: {
          blockchain_hash?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          student_id: string
          title: string
          verified?: boolean | null
        }
        Update: {
          blockchain_hash?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          student_id?: string
          title?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          status: string | null
          total_hires: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          status?: string | null
          total_hires?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          status?: string | null
          total_hires?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          applicants_count: number | null
          application_deadline: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          drive_date: string | null
          eligibility_departments: string[] | null
          eligibility_max_backlogs: number | null
          eligibility_min_cgpa: number | null
          eligibility_skills: string[] | null
          id: string
          locations: string[] | null
          package_max: number | null
          package_min: number | null
          selected_count: number | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          applicants_count?: number | null
          application_deadline?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drive_date?: string | null
          eligibility_departments?: string[] | null
          eligibility_max_backlogs?: number | null
          eligibility_min_cgpa?: number | null
          eligibility_skills?: string[] | null
          id?: string
          locations?: string[] | null
          package_max?: number | null
          package_min?: number | null
          selected_count?: number | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          applicants_count?: number | null
          application_deadline?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          drive_date?: string | null
          eligibility_departments?: string[] | null
          eligibility_max_backlogs?: number | null
          eligibility_min_cgpa?: number | null
          eligibility_skills?: string[] | null
          id?: string
          locations?: string[] | null
          package_max?: number | null
          package_min?: number | null
          selected_count?: number | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          roll_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          department?: string | null
          email: string
          id: string
          name: string
          roll_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          roll_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          batch: string | null
          branch: string | null
          cgpa: number | null
          created_at: string | null
          eligible_for_placement: boolean | null
          email: string
          full_name: string
          id: string
          phone: string | null
          placed_company: string | null
          placed_package: number | null
          placement_status: string | null
          resume_url: string | null
          roll_number: string | null
          semester: number | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          batch?: string | null
          branch?: string | null
          cgpa?: number | null
          created_at?: string | null
          eligible_for_placement?: boolean | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          placed_company?: string | null
          placed_package?: number | null
          placement_status?: string | null
          resume_url?: string | null
          roll_number?: string | null
          semester?: number | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          batch?: string | null
          branch?: string | null
          cgpa?: number | null
          created_at?: string | null
          eligible_for_placement?: boolean | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          placed_company?: string | null
          placed_package?: number | null
          placement_status?: string | null
          resume_url?: string | null
          roll_number?: string | null
          semester?: number | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tpo" | "student" | "company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["tpo", "student", "company"],
    },
  },
} as const
