# PlaceChain - Placement Management System

A modern placement management system with role-based dashboards, real-time notifications, analytics, resume builder, and interview scheduling.

## Features

- **Dark/Light Theme** - Toggle with localStorage persistence
- **Role-Based Dashboards** - Admin/TPO, Student, Company portals
- **Real-Time Notifications** - Mock updates via timers
- **Analytics Charts** - Placement trends, skill demand, department stats
- **Resume Builder** - Live preview + PDF export
- **Interview Scheduling** - Calendar view with slot management
- **Search & Filters** - Advanced filtering across all entities
- **Report Export** - PDF and Excel (CSV) generation

## Service Layer Architecture

All data operations use service files for easy API replacement:

```
src/services/
├── analyticsService.ts, companyService.ts, exportService.ts
├── interviewService.ts, jobService.ts, notificationService.ts
├── resumeService.ts, searchService.ts
```

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Recharts, html2pdf.js, next-themes

## Getting Started

```bash
npm install && npm run dev
```
