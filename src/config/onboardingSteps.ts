import { OnboardingStep } from '@/hooks/useOnboarding';

export const adminOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '[data-onboarding="sidebar"]',
    title: 'Welcome to PlaceChain!',
    content: 'This is your admin dashboard. Use the sidebar to navigate between different sections.',
    placement: 'right',
  },
  {
    id: 'students',
    target: '[data-onboarding="students"]',
    title: 'Manage Students',
    content: 'View and manage all registered students, their profiles, and placement status.',
    placement: 'right',
  },
  {
    id: 'analytics',
    target: '[data-onboarding="analytics"]',
    title: 'View Analytics',
    content: 'Track placement trends, department statistics, and generate reports.',
    placement: 'right',
  },
  {
    id: 'theme',
    target: '[data-onboarding="theme"]',
    title: 'Switch Theme',
    content: 'Toggle between light and dark mode for comfortable viewing.',
    placement: 'bottom',
  },
];

export const studentOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '[data-onboarding="sidebar"]',
    title: 'Welcome Student!',
    content: 'Your placement portal. Track applications, build your resume, and find jobs.',
    placement: 'right',
  },
  {
    id: 'jobs',
    target: '[data-onboarding="jobs"]',
    title: 'Browse Jobs',
    content: 'Explore job openings from top companies and apply directly.',
    placement: 'right',
  },
  {
    id: 'resume',
    target: '[data-onboarding="resume"]',
    title: 'Build Your Resume',
    content: 'Create a professional resume and export it as PDF.',
    placement: 'right',
  },
];

export const companyOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '[data-onboarding="sidebar"]',
    title: 'Welcome Company!',
    content: 'Post jobs, manage applications, and find the best candidates.',
    placement: 'right',
  },
  {
    id: 'post-job',
    target: '[data-onboarding="post-job"]',
    title: 'Post New Jobs',
    content: 'Create job postings with requirements and eligibility criteria.',
    placement: 'right',
  },
];
