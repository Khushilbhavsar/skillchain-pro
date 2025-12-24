export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
}

// Default empty resume template
const defaultResume: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
};

// Sample resume for demo
const sampleResume: ResumeData = {
  personalInfo: {
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/rahulsharma',
    github: 'github.com/rahulsharma',
    summary: 'Passionate software engineer with expertise in full-stack development. Experienced in building scalable web applications using modern technologies. Strong problem-solving skills and team collaboration abilities.',
  },
  education: [
    {
      id: 'edu1',
      institution: 'Indian Institute of Technology',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      startDate: '2021',
      endDate: '2025',
      gpa: '8.5/10',
    },
  ],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Startup Inc.',
      position: 'Software Engineering Intern',
      location: 'Remote',
      startDate: 'May 2023',
      endDate: 'Jul 2023',
      current: false,
      description: [
        'Developed REST APIs using Node.js and Express',
        'Implemented responsive UI components with React',
        'Improved application performance by 30%',
      ],
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'],
  projects: [
    {
      id: 'proj1',
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application with payment integration',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: 'github.com/rahul/ecommerce',
    },
    {
      id: 'proj2',
      name: 'ML Image Classifier',
      description: 'Deep learning model for image classification with 95% accuracy',
      technologies: ['Python', 'TensorFlow', 'Flask'],
    },
  ],
};

// Store resume in memory (would be localStorage or backend in production)
let currentResume: ResumeData = { ...sampleResume };

export const resumeService = {
  // Get current resume data
  getResume(): ResumeData {
    return { ...currentResume };
  },

  // Save resume data
  saveResume(data: ResumeData): void {
    currentResume = { ...data };
  },

  // Reset to empty template
  resetResume(): ResumeData {
    currentResume = { ...defaultResume };
    return currentResume;
  },

  // Load sample resume
  loadSampleResume(): ResumeData {
    currentResume = { ...sampleResume };
    return currentResume;
  },

  // Generate unique ID for sections
  generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Add education entry
  addEducation(education: Omit<Education, 'id'>): Education {
    const newEdu = { ...education, id: this.generateId() };
    currentResume.education.push(newEdu);
    return newEdu;
  },

  // Remove education entry
  removeEducation(id: string): void {
    currentResume.education = currentResume.education.filter(e => e.id !== id);
  },

  // Add experience entry
  addExperience(experience: Omit<Experience, 'id'>): Experience {
    const newExp = { ...experience, id: this.generateId() };
    currentResume.experience.push(newExp);
    return newExp;
  },

  // Remove experience entry
  removeExperience(id: string): void {
    currentResume.experience = currentResume.experience.filter(e => e.id !== id);
  },

  // Add project entry
  addProject(project: Omit<Project, 'id'>): Project {
    const newProj = { ...project, id: this.generateId() };
    currentResume.projects.push(newProj);
    return newProj;
  },

  // Remove project entry
  removeProject(id: string): void {
    currentResume.projects = currentResume.projects.filter(p => p.id !== id);
  },

  // Add skill
  addSkill(skill: string): void {
    if (!currentResume.skills.includes(skill)) {
      currentResume.skills.push(skill);
    }
  },

  // Remove skill
  removeSkill(skill: string): void {
    currentResume.skills = currentResume.skills.filter(s => s !== skill);
  },
};
