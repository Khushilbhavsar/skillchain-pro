
# Plan: Display Logged-in User's Name in UI

## Problem Identified
The application currently displays hardcoded mock data (e.g., "Rahul Sharma") instead of the actual logged-in user's name from the authentication context. This affects multiple pages across all three portals (Admin, Student, Company).

## Current State
- The `AuthContext` correctly fetches and stores user profile data (`profile.name`) from the database
- The layout components (DashboardLayout, StudentLayout, CompanyLayout) already use `profile?.name` for the sidebar avatar dropdown
- However, individual dashboard pages still use mock data with hardcoded names
- The Index page shows a static "Placement Management System" without personalization

## Files to Modify

### 1. Admin Dashboard (`src/pages/admin/Dashboard.tsx`)
- Import `useAuth` hook
- Replace static "Welcome back!" with personalized greeting using `profile?.name`
- Example: "Welcome back, {profile?.name || 'Admin'}!"

### 2. Student Dashboard (`src/pages/student/Dashboard.tsx`)
- Import `useAuth` hook
- Replace `currentStudent.name.split(' ')[0]` with logged-in user's name from profile
- Use profile data for CGPA, department display (or show placeholder if not available)
- Keep mock data for skills, applications, certificates (until real data is implemented)

### 3. Company Dashboard (`src/pages/company/Dashboard.tsx`)
- Import `useAuth` hook
- Replace `company?.name` greeting with profile name or company_name from auth context
- Use profile data: `profile?.company_name || profile?.name`

### 4. Fix Console Warning - Logo Component (`src/components/Logo.tsx`)
- Add `React.forwardRef` to the Logo component to fix the ref warning in console logs
- This is a minor fix but improves code quality

## Implementation Details

### For Student Dashboard:
```text
Changes:
- Import useAuth hook
- Get profile from useAuth()
- Update welcome header: "Welcome back, {profile?.name?.split(' ')[0] || 'Student'}!"
- Show profile's department if available
- Keep mock data for skills/applications until real data tables exist
```

### For Admin Dashboard:
```text
Changes:
- Import useAuth hook
- Get profile from useAuth()
- Update greeting: "Welcome back, {profile?.name || 'Admin'}!"
```

### For Company Dashboard:
```text
Changes:
- Import useAuth hook
- Get profile from useAuth()
- Update greeting: "Welcome, {profile?.company_name || profile?.name || 'Company'}!"
```

### For Logo Component:
```text
Changes:
- Wrap component with React.forwardRef
- Accept ref parameter and pass to the div element
```

## Summary of Changes
| File | Change |
|------|--------|
| `src/pages/admin/Dashboard.tsx` | Add personalized greeting with auth profile name |
| `src/pages/student/Dashboard.tsx` | Use auth profile name instead of mockStudents[0] |
| `src/pages/company/Dashboard.tsx` | Use auth profile company_name/name in greeting |
| `src/components/Logo.tsx` | Add forwardRef to fix console warning |

## Notes
- The sidebar layouts already correctly display the logged-in user's name
- This plan focuses on making dashboard content personalized
- Mock data for jobs, applications, certificates will remain until those features are connected to real database tables
