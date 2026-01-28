-- Create students table
CREATE TABLE public.students (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  roll_number text,
  phone text,
  branch text,
  batch text,
  semester integer DEFAULT 1,
  cgpa numeric(3,2) DEFAULT 0.00,
  skills text[] DEFAULT '{}',
  resume_url text,
  placement_status text DEFAULT 'unplaced' CHECK (placement_status IN ('placed', 'unplaced', 'in_process', 'opted_out')),
  placed_company text,
  placed_package numeric,
  eligible_for_placement boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  industry text,
  location text,
  website text,
  logo_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  total_hires integer DEFAULT 0,
  contact_email text,
  contact_phone text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text DEFAULT 'full_time' CHECK (type IN ('full_time', 'internship', 'contract')),
  locations text[] DEFAULT '{}',
  package_min numeric,
  package_max numeric,
  eligibility_min_cgpa numeric(3,2) DEFAULT 0.00,
  eligibility_departments text[] DEFAULT '{}',
  eligibility_skills text[] DEFAULT '{}',
  eligibility_max_backlogs integer DEFAULT 0,
  application_deadline date,
  drive_date date,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'in_progress')),
  applicants_count integer DEFAULT 0,
  selected_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interviewed', 'selected', 'rejected')),
  applied_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(student_id, job_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date,
  file_url text,
  verified boolean DEFAULT false,
  blockchain_hash text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Students can view their own data"
  ON public.students FOR SELECT
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'tpo'));

CREATE POLICY "Students can update their own data"
  ON public.students FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Students can insert their own data"
  ON public.students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Companies policies (viewable by all authenticated, manageable by TPO)
CREATE POLICY "Authenticated users can view companies"
  ON public.companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "TPO can manage companies"
  ON public.companies FOR ALL
  USING (public.has_role(auth.uid(), 'tpo'));

-- Jobs policies
CREATE POLICY "Authenticated users can view jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "TPO can manage jobs"
  ON public.jobs FOR ALL
  USING (public.has_role(auth.uid(), 'tpo'));

CREATE POLICY "Companies can manage their jobs"
  ON public.jobs FOR ALL
  USING (public.has_role(auth.uid(), 'company'));

-- Applications policies
CREATE POLICY "Students can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'tpo') OR public.has_role(auth.uid(), 'company'));

CREATE POLICY "Students can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "TPO can manage all applications"
  ON public.applications FOR ALL
  USING (public.has_role(auth.uid(), 'tpo'));

-- Certificates policies
CREATE POLICY "Students can view their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'tpo'));

CREATE POLICY "Students can manage their own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "TPO can manage all certificates"
  ON public.certificates FOR ALL
  USING (public.has_role(auth.uid(), 'tpo'));

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();