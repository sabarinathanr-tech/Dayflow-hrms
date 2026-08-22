# Dayflow HRMS — Frontend Application

> **Tagline:** *Every workday, perfectly aligned.*

Dayflow is a modern, high-performance Human Resource Management System built for streamlined workforce operations, real-time shift tracking, leave workflows, role-based profiles, and comprehensive salary management.

---

## 🛠 Tech Stack

- **Core:** React 18, Vite 6, JavaScript / JSX
- **Styling & UI:** Tailwind CSS v3 (Dark Charcoal/Purple/Cyan Theme), Lucide React Icons
- **Routing:** React Router v6 (Role-Protected Routes & Dynamic Redirects)
- **Data Visualization:** Recharts (Shift Trends, Departmental Headcount, Leave Breakdown)
- **Date & Currency:** `date-fns`, Custom localized formatters
- **HTTP & Resilience:** Axios API Client + Local-storage Fallback State Engine

---

## 🚀 Quick Start

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### 4. Build Production Bundle
```bash
npm run build
```

---

## 🔐 Credentials & Quick Demo Access

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@dayflow.io` | `password123` | Employee Dashboard, Timesheets, Leave Requests, Compensation & Payslips |
| **HR Admin** | `hr@dayflow.io` | `password123` | HR Operations, Workforce Directory, Approvals, Salary Structures, Reports |

*(One-click quick demo buttons are also provided directly on the Login screen).*

---

## 🧭 Application Routes

### Public / Authentication
- `/login` — Sign In with email/password and remember me
- `/register` — Account registration with role selection & password strength
- `/verify-email` — Verification code screen with resend timer
- `/forgot-password` — Password reset link request

### Employee Portal (`/employee/*`)
- `/employee/dashboard` — Greeting, real-time check-in/out, KPI cards, quick actions
- `/employee/profile` — Personal & job details, verified documents, editable contact info
- `/employee/attendance` — Shift timers, attendance calendar & timesheet tables
- `/employee/leaves` — Time-off balances, leave application modal & status tracking
- `/employee/payroll` — Read-only salary breakdown & printable disbursement slips

### Admin & HR Portal (`/admin/*`)
- `/admin/dashboard` — Executive overview, presence metrics, pending approval queue
- `/admin/employees` — Searchable employee directory, add/edit/delete modals
- `/admin/employees/:id` — Full multi-tab employee dossier & salary editor
- `/admin/attendance` — Company-wide shift logs, overtime tracking & CSV export
- `/admin/leaves` — Pending leave approval/rejection modal with HR comments
- `/admin/payroll` — Corporate salary structure management with live calculations
- `/admin/reports` — Shift distribution, department headcount & time-off analytics

---

## 🏗 Architecture & Service Layer

```
src/
├── components/
│   ├── attendance/    # Check-in card, Timesheet tables, Attendance calendar
│   ├── common/        # Navbar, Sidebar, Mobile Drawer, Modals, Buttons, Badges
│   ├── dashboard/     # Stat cards, Quick actions, Charts, Summaries
│   ├── employee/      # Profile cards, Directory tables, Employee form
│   ├── leave/         # Leave application form, Approval modals, Leave calendar
│   └── payroll/       # Salary breakdown cards, Structure editor, Payslip UI
├── context/           # AuthContext & ToastContext
├── hooks/             # useAuth, useToast, useDebounce
├── layouts/           # AuthLayout, EmployeeLayout, AdminLayout
├── pages/             # Auth, Employee, and Admin views
├── routes/            # AppRoutes with role-based ProtectedRoute guards
├── services/          # api.js, auth, employee, attendance, leave, payroll
└── utils/             # validation, formatting, constants
```
