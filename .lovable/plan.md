

# Plan: Add Sample Seed Data to the Database

## Overview
Your database is currently empty, which is why the admin dashboard shows zeros everywhere. I'll add realistic sample data to populate the system so you can see how everything looks and works.

## What Will Be Added

### 1. Companies (8 companies)
Realistic tech companies with varied industries:
- TechCorp Solutions (IT Services)
- InnovateTech (Software)
- DataDrive Analytics (Data Analytics)
- CloudFirst Inc (Cloud Computing)
- FinTech Pro (Financial Technology)
- GreenEnergy Systems (Renewable Energy)
- HealthPlus Tech (Healthcare IT)
- SmartRetail Solutions (E-commerce)

### 2. Jobs (12 job postings)
Various positions linked to companies:
- Software Engineer roles
- Data Analyst positions
- Frontend/Backend developers
- DevOps Engineer
- Product Manager
- Different job types (full-time, internship, contract)
- Varying salary packages (6-25 LPA)
- Different eligibility criteria (CGPA requirements, departments, skills)

### 3. Students (15 students)
Mix of placement statuses to show realistic dashboard metrics:
- 6 Placed students (with company names and packages)
- 5 Unplaced students (actively looking)
- 4 In-process students (interviewing)
- Various departments: Computer Science, Electronics, Mechanical, IT, Civil
- Different CGPAs, skills, and batches

### 4. Applications (20 applications)
Simulated job applications with various statuses:
- Applied (pending review)
- Shortlisted (interview stage)
- Selected (offer received)
- Rejected (unsuccessful)

### 5. Certificates (10 certificates)
Sample academic and professional certificates:
- AWS certifications
- Google Cloud certificates
- Academic excellence awards
- Coding competition certificates

## Technical Approach

Since this project uses Lovable Cloud, I'll use a database migration to insert the seed data. This approach:
- Bypasses RLS policies (runs as admin)
- Works with all tables regardless of foreign key constraints
- Uses fixed UUIDs for proper relationship linking
- Can be easily extended or modified later

## Expected Result After Implementation

**Dashboard Stats:**
- Total Students: 15
- Placed: 6 (40%)
- In Process: 4
- Unplaced: 5
- Companies: 8
- Open Jobs: 8+

**Pages with data:**
- Students page → 15 student records with filters working
- Companies page → 8 company cards
- Jobs page → 12 job postings
- Analytics → Real placement percentages and trends

## Notes
- Student records will use generated UUIDs (not linked to actual auth users) so they appear in admin views
- The TPO role can view all this data due to existing RLS policies
- You can still register real student accounts that will appear alongside this seed data

