import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { CompanyLayout } from "@/components/layout/CompanyLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentsPage from "./pages/admin/Students";
import CompaniesPage from "./pages/admin/Companies";
import JobsPage from "./pages/admin/Jobs";
import AnalyticsPage from "./pages/admin/Analytics";
import VerificationPage from "./pages/admin/Verification";
import AdvancedAnalyticsPage from "./pages/admin/AdvancedAnalytics";
import InterviewSchedulingPage from "./pages/admin/InterviewScheduling";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentCertificates from "./pages/student/Certificates";
import StudentApplications from "./pages/student/Applications";
import StudentJobs from "./pages/student/Jobs";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyJobs from "./pages/company/Jobs";
import PostJob from "./pages/company/PostJob";
import Applicants from "./pages/company/Applicants";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="companies" element={<CompaniesPage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="advanced-analytics" element={<AdvancedAnalyticsPage />} />
                <Route path="interviews" element={<InterviewSchedulingPage />} />
                <Route path="verification" element={<VerificationPage />} />
              </Route>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="applications" element={<StudentApplications />} />
                <Route path="jobs" element={<StudentJobs />} />
                <Route path="resume" element={<ResumeBuilder />} />
              </Route>
              <Route path="/company" element={<CompanyLayout />}>
                <Route index element={<CompanyDashboard />} />
                <Route path="jobs" element={<CompanyJobs />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="applicants" element={<Applicants />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
