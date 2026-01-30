
-- First, drop the foreign key constraint on students.id to allow seed data
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_id_fkey;

-- Insert seed companies
INSERT INTO public.companies (id, name, description, industry, location, website, status, total_hires, contact_email) VALUES
('c1000001-0001-4000-8000-000000000001', 'TechCorp Solutions', 'Leading IT services and consulting company', 'IT Services', 'Bangalore', 'https://techcorp.example.com', 'active', 12, 'hr@techcorp.example.com'),
('c1000001-0001-4000-8000-000000000002', 'InnovateTech', 'Cutting-edge software development firm', 'Software', 'Hyderabad', 'https://innovatetech.example.com', 'active', 8, 'careers@innovatetech.example.com'),
('c1000001-0001-4000-8000-000000000003', 'DataDrive Analytics', 'Data science and analytics solutions', 'Data Analytics', 'Pune', 'https://datadrive.example.com', 'active', 5, 'jobs@datadrive.example.com'),
('c1000001-0001-4000-8000-000000000004', 'CloudFirst Inc', 'Cloud infrastructure and DevOps specialists', 'Cloud Computing', 'Mumbai', 'https://cloudfirst.example.com', 'active', 10, 'recruit@cloudfirst.example.com'),
('c1000001-0001-4000-8000-000000000005', 'FinTech Pro', 'Financial technology innovations', 'Financial Technology', 'Chennai', 'https://fintechpro.example.com', 'active', 6, 'talent@fintechpro.example.com'),
('c1000001-0001-4000-8000-000000000006', 'GreenEnergy Systems', 'Renewable energy technology solutions', 'Renewable Energy', 'Delhi', 'https://greenenergy.example.com', 'active', 3, 'hr@greenenergy.example.com'),
('c1000001-0001-4000-8000-000000000007', 'HealthPlus Tech', 'Healthcare IT and digital health platforms', 'Healthcare IT', 'Bangalore', 'https://healthplus.example.com', 'active', 4, 'careers@healthplus.example.com'),
('c1000001-0001-4000-8000-000000000008', 'SmartRetail Solutions', 'E-commerce and retail technology', 'E-commerce', 'Gurgaon', 'https://smartretail.example.com', 'active', 7, 'jobs@smartretail.example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert seed jobs
INSERT INTO public.jobs (id, company_id, title, description, type, locations, package_min, package_max, eligibility_min_cgpa, eligibility_departments, eligibility_skills, status, application_deadline, drive_date, applicants_count, selected_count) VALUES
('a1000001-0001-4000-8000-000000000001', 'c1000001-0001-4000-8000-000000000001', 'Software Engineer', 'Develop and maintain web applications', 'full_time', ARRAY['Bangalore', 'Hyderabad'], 8, 12, 7.0, ARRAY['Computer Science', 'IT'], ARRAY['Java', 'Spring Boot', 'SQL'], 'open', '2026-03-15', '2026-03-20', 45, 3),
('a1000001-0001-4000-8000-000000000002', 'c1000001-0001-4000-8000-000000000001', 'Data Analyst', 'Analyze business data and create reports', 'full_time', ARRAY['Bangalore'], 6, 9, 6.5, ARRAY['Computer Science', 'IT', 'Mathematics'], ARRAY['Python', 'SQL', 'Tableau'], 'open', '2026-03-10', '2026-03-15', 32, 2),
('a1000001-0001-4000-8000-000000000003', 'c1000001-0001-4000-8000-000000000002', 'Frontend Developer', 'Build responsive user interfaces', 'full_time', ARRAY['Hyderabad'], 7, 11, 6.8, ARRAY['Computer Science', 'IT'], ARRAY['React', 'TypeScript', 'CSS'], 'open', '2026-03-12', '2026-03-18', 28, 2),
('a1000001-0001-4000-8000-000000000004', 'c1000001-0001-4000-8000-000000000003', 'Data Scientist', 'Build ML models and data pipelines', 'full_time', ARRAY['Pune', 'Remote'], 12, 18, 7.5, ARRAY['Computer Science', 'Mathematics'], ARRAY['Python', 'TensorFlow', 'Machine Learning'], 'open', '2026-03-08', '2026-03-14', 22, 1),
('a1000001-0001-4000-8000-000000000005', 'c1000001-0001-4000-8000-000000000004', 'DevOps Engineer', 'Manage cloud infrastructure and CI/CD', 'full_time', ARRAY['Mumbai', 'Bangalore'], 10, 15, 7.0, ARRAY['Computer Science', 'IT'], ARRAY['AWS', 'Docker', 'Kubernetes', 'Jenkins'], 'open', '2026-03-20', '2026-03-25', 18, 1),
('a1000001-0001-4000-8000-000000000006', 'c1000001-0001-4000-8000-000000000005', 'Backend Developer', 'Design and implement APIs', 'full_time', ARRAY['Chennai'], 9, 14, 7.2, ARRAY['Computer Science', 'IT'], ARRAY['Node.js', 'MongoDB', 'REST APIs'], 'open', '2026-03-18', '2026-03-22', 35, 2),
('a1000001-0001-4000-8000-000000000007', 'c1000001-0001-4000-8000-000000000002', 'Software Intern', 'Learn and contribute to development projects', 'internship', ARRAY['Hyderabad'], 3, 4, 6.0, ARRAY['Computer Science', 'IT', 'Electronics'], ARRAY['Programming', 'Problem Solving'], 'open', '2026-02-28', '2026-03-05', 65, 5),
('a1000001-0001-4000-8000-000000000008', 'c1000001-0001-4000-8000-000000000006', 'Embedded Systems Engineer', 'Develop firmware for IoT devices', 'full_time', ARRAY['Delhi'], 7, 10, 6.8, ARRAY['Electronics', 'Electrical'], ARRAY['C', 'Embedded C', 'RTOS'], 'open', '2026-03-25', '2026-03-30', 12, 0),
('a1000001-0001-4000-8000-000000000009', 'c1000001-0001-4000-8000-000000000007', 'Full Stack Developer', 'End-to-end application development', 'full_time', ARRAY['Bangalore'], 11, 16, 7.3, ARRAY['Computer Science', 'IT'], ARRAY['React', 'Node.js', 'PostgreSQL'], 'open', '2026-03-15', '2026-03-20', 40, 2),
('a1000001-0001-4000-8000-000000000010', 'c1000001-0001-4000-8000-000000000008', 'Product Manager', 'Lead product development initiatives', 'full_time', ARRAY['Gurgaon', 'Remote'], 15, 25, 7.5, ARRAY['Computer Science', 'IT', 'MBA'], ARRAY['Product Management', 'Agile', 'Analytics'], 'closed', '2026-02-15', '2026-02-20', 25, 1),
('a1000001-0001-4000-8000-000000000011', 'c1000001-0001-4000-8000-000000000004', 'Cloud Intern', 'Support cloud migration projects', 'internship', ARRAY['Mumbai'], 2.5, 3.5, 6.0, ARRAY['Computer Science', 'IT'], ARRAY['Linux', 'AWS Basics'], 'open', '2026-03-10', '2026-03-15', 48, 4),
('a1000001-0001-4000-8000-000000000012', 'c1000001-0001-4000-8000-000000000005', 'QA Engineer', 'Test applications and ensure quality', 'contract', ARRAY['Chennai', 'Remote'], 6, 8, 6.5, ARRAY['Computer Science', 'IT'], ARRAY['Selenium', 'Testing', 'JIRA'], 'open', '2026-03-22', '2026-03-28', 20, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert seed students (now possible without FK constraint)
INSERT INTO public.students (id, full_name, email, roll_number, phone, branch, batch, semester, cgpa, skills, placement_status, placed_company, placed_package, eligible_for_placement) VALUES
('b1000001-0001-4000-8000-000000000001', 'Rahul Sharma', 'rahul.sharma@example.edu', 'CS2024001', '9876543210', 'Computer Science', '2024', 8, 8.5, ARRAY['Java', 'Python', 'React', 'SQL'], 'placed', 'TechCorp Solutions', 10, true),
('b1000001-0001-4000-8000-000000000002', 'Priya Patel', 'priya.patel@example.edu', 'CS2024002', '9876543211', 'Computer Science', '2024', 8, 9.1, ARRAY['Python', 'Machine Learning', 'TensorFlow'], 'placed', 'DataDrive Analytics', 15, true),
('b1000001-0001-4000-8000-000000000003', 'Amit Kumar', 'amit.kumar@example.edu', 'IT2024001', '9876543212', 'IT', '2024', 8, 7.8, ARRAY['JavaScript', 'Node.js', 'MongoDB'], 'placed', 'InnovateTech', 9, true),
('b1000001-0001-4000-8000-000000000004', 'Sneha Reddy', 'sneha.reddy@example.edu', 'CS2024003', '9876543213', 'Computer Science', '2024', 8, 8.8, ARRAY['React', 'TypeScript', 'AWS'], 'placed', 'CloudFirst Inc', 12, true),
('b1000001-0001-4000-8000-000000000005', 'Vikram Singh', 'vikram.singh@example.edu', 'EC2024001', '9876543214', 'Electronics', '2024', 8, 7.5, ARRAY['Embedded C', 'VHDL', 'IoT'], 'placed', 'GreenEnergy Systems', 8, true),
('b1000001-0001-4000-8000-000000000006', 'Ananya Gupta', 'ananya.gupta@example.edu', 'CS2024004', '9876543215', 'Computer Science', '2024', 8, 9.3, ARRAY['Python', 'SQL', 'Tableau', 'Power BI'], 'placed', 'FinTech Pro', 11, true),
('b1000001-0001-4000-8000-000000000007', 'Karthik Menon', 'karthik.menon@example.edu', 'CS2024005', '9876543216', 'Computer Science', '2024', 8, 7.2, ARRAY['Java', 'Spring Boot'], 'in_process', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000008', 'Neha Joshi', 'neha.joshi@example.edu', 'IT2024002', '9876543217', 'IT', '2024', 8, 7.9, ARRAY['React', 'Node.js', 'PostgreSQL'], 'in_process', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000009', 'Arjun Nair', 'arjun.nair@example.edu', 'ME2024001', '9876543218', 'Mechanical', '2024', 8, 6.8, ARRAY['AutoCAD', 'SolidWorks', 'Python'], 'in_process', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000010', 'Divya Krishnan', 'divya.krishnan@example.edu', 'CS2024006', '9876543219', 'Computer Science', '2024', 8, 8.1, ARRAY['Python', 'Docker', 'Kubernetes'], 'in_process', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000011', 'Rohan Verma', 'rohan.verma@example.edu', 'IT2024003', '9876543220', 'IT', '2024', 8, 6.5, ARRAY['HTML', 'CSS', 'JavaScript'], 'unplaced', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000012', 'Pooja Agarwal', 'pooja.agarwal@example.edu', 'EC2024002', '9876543221', 'Electronics', '2024', 8, 7.0, ARRAY['MATLAB', 'Signal Processing'], 'unplaced', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000013', 'Suresh Babu', 'suresh.babu@example.edu', 'CE2024001', '9876543222', 'Civil', '2024', 8, 6.9, ARRAY['AutoCAD', 'Revit', 'Project Management'], 'unplaced', NULL, NULL, true),
('b1000001-0001-4000-8000-000000000014', 'Meera Iyer', 'meera.iyer@example.edu', 'CS2024007', '9876543223', 'Computer Science', '2024', 8, 5.8, ARRAY['C++', 'Data Structures'], 'unplaced', NULL, NULL, false),
('b1000001-0001-4000-8000-000000000015', 'Aditya Rao', 'aditya.rao@example.edu', 'ME2024002', '9876543224', 'Mechanical', '2024', 8, 7.4, ARRAY['CATIA', 'Ansys', 'Manufacturing'], 'unplaced', NULL, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- Insert seed applications
INSERT INTO public.applications (id, student_id, job_id, status, applied_at) VALUES
('d1000001-0001-4000-8000-000000000001', 'b1000001-0001-4000-8000-000000000001', 'a1000001-0001-4000-8000-000000000001', 'selected', '2026-01-10'),
('d1000001-0001-4000-8000-000000000002', 'b1000001-0001-4000-8000-000000000002', 'a1000001-0001-4000-8000-000000000004', 'selected', '2026-01-08'),
('d1000001-0001-4000-8000-000000000003', 'b1000001-0001-4000-8000-000000000003', 'a1000001-0001-4000-8000-000000000003', 'selected', '2026-01-12'),
('d1000001-0001-4000-8000-000000000004', 'b1000001-0001-4000-8000-000000000004', 'a1000001-0001-4000-8000-000000000005', 'selected', '2026-01-15'),
('d1000001-0001-4000-8000-000000000005', 'b1000001-0001-4000-8000-000000000005', 'a1000001-0001-4000-8000-000000000008', 'selected', '2026-01-18'),
('d1000001-0001-4000-8000-000000000006', 'b1000001-0001-4000-8000-000000000006', 'a1000001-0001-4000-8000-000000000002', 'selected', '2026-01-05'),
('d1000001-0001-4000-8000-000000000007', 'b1000001-0001-4000-8000-000000000007', 'a1000001-0001-4000-8000-000000000001', 'shortlisted', '2026-01-20'),
('d1000001-0001-4000-8000-000000000008', 'b1000001-0001-4000-8000-000000000008', 'a1000001-0001-4000-8000-000000000009', 'shortlisted', '2026-01-22'),
('d1000001-0001-4000-8000-000000000009', 'b1000001-0001-4000-8000-000000000009', 'a1000001-0001-4000-8000-000000000008', 'shortlisted', '2026-01-25'),
('d1000001-0001-4000-8000-000000000010', 'b1000001-0001-4000-8000-000000000010', 'a1000001-0001-4000-8000-000000000005', 'shortlisted', '2026-01-23'),
('d1000001-0001-4000-8000-000000000011', 'b1000001-0001-4000-8000-000000000011', 'a1000001-0001-4000-8000-000000000007', 'applied', '2026-01-28'),
('d1000001-0001-4000-8000-000000000012', 'b1000001-0001-4000-8000-000000000012', 'a1000001-0001-4000-8000-000000000008', 'applied', '2026-01-27'),
('d1000001-0001-4000-8000-000000000013', 'b1000001-0001-4000-8000-000000000013', 'a1000001-0001-4000-8000-000000000008', 'rejected', '2026-01-15'),
('d1000001-0001-4000-8000-000000000014', 'b1000001-0001-4000-8000-000000000007', 'a1000001-0001-4000-8000-000000000003', 'applied', '2026-01-26'),
('d1000001-0001-4000-8000-000000000015', 'b1000001-0001-4000-8000-000000000008', 'a1000001-0001-4000-8000-000000000006', 'applied', '2026-01-25'),
('d1000001-0001-4000-8000-000000000016', 'b1000001-0001-4000-8000-000000000010', 'a1000001-0001-4000-8000-000000000011', 'applied', '2026-01-28'),
('d1000001-0001-4000-8000-000000000017', 'b1000001-0001-4000-8000-000000000011', 'a1000001-0001-4000-8000-000000000003', 'rejected', '2026-01-18'),
('d1000001-0001-4000-8000-000000000018', 'b1000001-0001-4000-8000-000000000015', 'a1000001-0001-4000-8000-000000000008', 'applied', '2026-01-29'),
('d1000001-0001-4000-8000-000000000019', 'b1000001-0001-4000-8000-000000000007', 'a1000001-0001-4000-8000-000000000009', 'shortlisted', '2026-01-24'),
('d1000001-0001-4000-8000-000000000020', 'b1000001-0001-4000-8000-000000000012', 'a1000001-0001-4000-8000-000000000007', 'applied', '2026-01-26')
ON CONFLICT (id) DO NOTHING;

-- Insert seed certificates
INSERT INTO public.certificates (id, student_id, title, issuer, issue_date, verified, blockchain_hash) VALUES
('e1000001-0001-4000-8000-000000000001', 'b1000001-0001-4000-8000-000000000001', 'AWS Certified Solutions Architect', 'Amazon Web Services', '2025-08-15', true, '0x7f3a9c2b1e4d8a6f5c3b2e1d4a7f8c9b'),
('e1000001-0001-4000-8000-000000000002', 'b1000001-0001-4000-8000-000000000002', 'TensorFlow Developer Certificate', 'Google', '2025-09-20', true, '0x8a4b2c3d1e5f9a7b6c4d3e2f1a8b9c7d'),
('e1000001-0001-4000-8000-000000000003', 'b1000001-0001-4000-8000-000000000003', 'MongoDB Certified Developer', 'MongoDB Inc', '2025-07-10', true, '0x9b5c3d4e2f6a8b7c5d4e3f2a1b9c8d6e'),
('e1000001-0001-4000-8000-000000000004', 'b1000001-0001-4000-8000-000000000004', 'Google Cloud Professional', 'Google Cloud', '2025-10-05', true, '0xac6d4e5f3a7b9c8d6e5f4a3b2c1d9e8f'),
('e1000001-0001-4000-8000-000000000005', 'b1000001-0001-4000-8000-000000000001', 'Academic Excellence Award 2024', 'University', '2024-05-30', true, '0xbd7e5f6a4b8c9d7e6f5a4b3c2d1e9f8a'),
('e1000001-0001-4000-8000-000000000006', 'b1000001-0001-4000-8000-000000000002', 'Hackathon Winner - TechFest 2024', 'IIT Bombay', '2024-03-15', true, '0xce8f6a7b5c9d8e7f6a5b4c3d2e1f9a8b'),
('e1000001-0001-4000-8000-000000000007', 'b1000001-0001-4000-8000-000000000007', 'Java Certification', 'Oracle', '2025-06-20', false, NULL),
('e1000001-0001-4000-8000-000000000008', 'b1000001-0001-4000-8000-000000000008', 'React Developer Certification', 'Meta', '2025-11-10', true, '0xdf9a7b8c6d9e8f7a6b5c4d3e2f1a9b8c'),
('e1000001-0001-4000-8000-000000000009', 'b1000001-0001-4000-8000-000000000005', 'Embedded Systems Certification', 'ARM', '2025-04-25', true, '0xea8b9c7d6e9f8a7b6c5d4e3f2a1b9c8d'),
('e1000001-0001-4000-8000-000000000010', 'b1000001-0001-4000-8000-000000000006', 'Power BI Data Analyst', 'Microsoft', '2025-08-30', true, '0xfb9c8d7e6f9a8b7c6d5e4f3a2b1c9d8e')
ON CONFLICT (id) DO NOTHING;
