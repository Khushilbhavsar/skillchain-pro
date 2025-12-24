// User & Auth Types
export type UserRole = 'tpo' | 'student' | 'company';

// Blockchain Transaction
export interface BlockchainTransaction {
  hash: string;
  type: 'issue' | 'verify' | 'revoke';
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  timestamp: string;
  gasUsed: number;
  certificateId?: string;
  from: string;
  to: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Student Types
export type PlacementStatus = 'placed' | 'unplaced' | 'in_process' | 'opted_out';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  verified: boolean;
  certificateHash?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  batch: string;
  cgpa: number;
  skills: Skill[];
  placementStatus: PlacementStatus;
  placedCompany?: string;
  placedPackage?: number;
  resume?: string;
  avatar?: string;
  eligibleForPlacement: boolean;
  createdAt: string;
}

// Company Types
export type CompanyStatus = 'active' | 'inactive' | 'blacklisted';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: CompanyStatus;
  description: string;
  locations: string[];
  totalHires: number;
  averagePackage: number;
  createdAt: string;
}

// Job Types
export type JobStatus = 'open' | 'closed' | 'in_progress' | 'completed';
export type JobType = 'full_time' | 'internship' | 'contract';

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  type: JobType;
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
  status: JobStatus;
  applicantsCount: number;
  selectedCount: number;
  createdAt: string;
}

// Blockchain/Certificate Types
export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  type: 'skill' | 'degree' | 'placement' | 'achievement';
  title: string;
  issuer: string;
  issueDate: string;
  transactionHash: string;
  blockNumber: number;
  verified: boolean;
  metadata: Record<string, string>;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
  timestamp: string;
}

// Analytics Types
export interface PlacementStats {
  totalStudents: number;
  placedStudents: number;
  unplacedStudents: number;
  inProcessStudents: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  totalOffers: number;
}

export interface DepartmentStats {
  department: string;
  totalStudents: number;
  placedStudents: number;
  placementPercentage: number;
  averagePackage: number;
}

export interface CompanyStats {
  companyId: string;
  companyName: string;
  totalHires: number;
  averagePackage: number;
  offers: number;
}

export interface SkillDemand {
  skill: string;
  demand: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyPlacement {
  month: string;
  placements: number;
  offers: number;
}

// Application Types
export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}
