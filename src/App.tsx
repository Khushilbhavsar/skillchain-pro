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
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Auth Pages
import AdminAuth from "./pages/auth/AdminAuth";
import StudentAuth from "./pages/auth/StudentAuth";
import CompanyAuth from "./pages/auth/CompanyAuth";
import ResetPassword from "./pages/auth/ResetPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import StudentsPage from "./pages/admin/Students";
import CompaniesPage from "./pages/admin/Companies";
import JobsPage from "./pages/admin/Jobs";
import AnalyticsPage from "./pages/admin/Analytics";
import VerificationPage from "./pages/admin/Verification";
import AdvancedAnalyticsPage from "./pages/admin/AdvancedAnalytics";
import InterviewSchedulingPage from "./pages/admin/InterviewScheduling";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentCertificates from "./pages/student/Certificates";
import StudentApplications from "./pages/student/Applications";
import StudentJobs from "./pages/student/Jobs";
import ResumeBuilder from "./pages/student/ResumeBuilder";

// Company Pages
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyJobs from "./pages/company/Jobs";
import PostJob from "./pages/company/PostJob";
import Applicants from "./pages/company/Applicants";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<RouteErrorBoundary><Index /></RouteErrorBoundary>} />
                <Route path="/auth/admin" element={<RouteErrorBoundary><AdminAuth /></RouteErrorBoundary>} />
                <Route path="/auth/student" element={<RouteErrorBoundary><StudentAuth /></RouteErrorBoundary>} />
                <Route path="/auth/company" element={<RouteErrorBoundary><CompanyAuth /></RouteErrorBoundary>} />
                <Route path="/reset-password" element={<RouteErrorBoundary><ResetPassword /></RouteErrorBoundary>} />

                {/* Protected Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['tpo']}>
                      <RouteErrorBoundary>
                        <DashboardLayout />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RouteErrorBoundary><AdminDashboard /></RouteErrorBoundary>} />
                  <Route path="students" element={<RouteErrorBoundary><StudentsPage /></RouteErrorBoundary>} />
                  <Route path="companies" element={<RouteErrorBoundary><CompaniesPage /></RouteErrorBoundary>} />
                  <Route path="jobs" element={<RouteErrorBoundary><JobsPage /></RouteErrorBoundary>} />
                  <Route path="analytics" element={<RouteErrorBoundary><AnalyticsPage /></RouteErrorBoundary>} />
                  <Route path="advanced-analytics" element={<RouteErrorBoundary><AdvancedAnalyticsPage /></RouteErrorBoundary>} />
                  <Route path="interviews" element={<RouteErrorBoundary><InterviewSchedulingPage /></RouteErrorBoundary>} />
                  <Route path="verification" element={<RouteErrorBoundary><VerificationPage /></RouteErrorBoundary>} />
                </Route>

                {/* Protected Student Routes */}
                <Route 
                  path="/student" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <RouteErrorBoundary>
                        <StudentLayout />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RouteErrorBoundary><StudentDashboard /></RouteErrorBoundary>} />
                  <Route path="profile" element={<RouteErrorBoundary><StudentProfile /></RouteErrorBoundary>} />
                  <Route path="certificates" element={<RouteErrorBoundary><StudentCertificates /></RouteErrorBoundary>} />
                  <Route path="applications" element={<RouteErrorBoundary><StudentApplications /></RouteErrorBoundary>} />
                  <Route path="jobs" element={<RouteErrorBoundary><StudentJobs /></RouteErrorBoundary>} />
                  <Route path="resume" element={<RouteErrorBoundary><ResumeBuilder /></RouteErrorBoundary>} />
                </Route>

                {/* Protected Company Routes */}
                <Route 
                  path="/company" 
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <RouteErrorBoundary>
                        <CompanyLayout />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RouteErrorBoundary><CompanyDashboard /></RouteErrorBoundary>} />
                  <Route path="jobs" element={<RouteErrorBoundary><CompanyJobs /></RouteErrorBoundary>} />
                  <Route path="post-job" element={<RouteErrorBoundary><PostJob /></RouteErrorBoundary>} />
                  <Route path="applicants" element={<RouteErrorBoundary><Applicants /></RouteErrorBoundary>} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
