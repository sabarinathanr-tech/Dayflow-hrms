# Dayflow HRMS — Architecture & System Design

## 1. System Overview
**Dayflow HRMS** is an enterprise-grade Human Resource Management System built on a modern MERN-stack architecture (MongoDB, Express.js, React, Node.js + Vite & Tailwind CSS). It provides end-to-end workflows for employee record management, attendance tracking, leave requests with multi-tier HR approval, automated payroll computation, real-time activity auditing, and email notifications.

```
┌──────────────────────────────────────────────────────────┐
│                   Dayflow Client (Vite + React)          │
│  - React Router DOM (Role-Based Protected Routes)        │
│  - Tailwind CSS + Lucide Icons + Heroicons               │
│  - Theme Context (Dark / Light) & Toast Feedback         │
└────────────────────────────┬─────────────────────────────┘
                             │  HTTP / REST / JWT Auth
                             ▼
┌──────────────────────────────────────────────────────────┐
│             Dayflow API Server (Express.js)              │
│  - Auth Middleware (JWT Verification & Bearer Token)     │
│  - Role-Based Access Control (Admin, HR, Employee)       │
│  - Global Error Handling & Request Logging               │
│  - File Uploads & Document Storage (Multer)              │
│  - Audit Logger & Real-time Notification Engine          │
└──────────────┬────────────────────────────┬──────────────┘
               │ Mongoose ODM               │ SMTP / Nodemailer
               ▼                            ▼
┌──────────────────────────┐ ┌─────────────────────────────┐
│      MongoDB Atlas       │ │     Email Service (SMTP)    │
│  - Users & Credentials   │ │  - 6-Digit OTP Verification │
│  - Employee Directory    │ │  - Password Reset Links     │
│  - Attendance Logs       │ │  - Leave Approvals/Declines │
│  - Leaves & Balances     │ │  - Payslip Notifications    │
│  - Payroll & Audit Logs  │ │  - Welcome Onboarding       │
└──────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Directory Structure

```
Dayflow-hrms/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & environment variables
│   │   ├── controllers/     # Route controllers for business operations
│   │   ├── middleware/      # Auth, role-checking, errors, uploads
│   │   ├── models/          # Mongoose schemas (User, Employee, Leave, etc.)
│   │   ├── routes/          # Express route declarations
│   │   ├── seed/            # Enterprise demo database seeder
│   │   ├── services/        # Email, Auth, Payroll business logic
│   │   └── utils/           # Token generation, ID formatting, Audit logger
│   ├── uploads/             # Avatars & document attachments
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (attendance, employee, etc.)
│   │   ├── context/         # Auth, Theme, Toast React Contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # View pages (Dashboard, Employees, Leaves, etc.)
│   │   ├── routes/          # Protected and public route trees
│   │   ├── services/        # Axios API client integrations
│   │   └── types/           # Data shapes and constants
│   └── package.json
└── docs/                    # Architecture, API, and DB documentation
```

---

## 3. Core Modules & Flow

### 3.1 Authentication & Authorization
- **JWT Authentication**: Encrypted JSON Web Tokens signed with 256-bit secret keys.
- **Two-Factor OTP**: 6-digit numeric OTP code dispatched via SMTP email or returned in frictionless test mode.
- **Role Hierarchy**:
  - `Admin`: Full system access, audit logs, role assignments.
  - `HR`: Employee CRUD, payroll processing, leave reviews, company-wide attendance.
  - `Employee`: Personal dashboard, check-in/out, self leave application, salary slip download.

### 3.2 Attendance Engine
- Auto-calculates daily hours, overtime/extra hours, and standard working minutes (480 mins).
- Dynamic calendar view showing status: `Present`, `Late`, `Half Day`, `Absent`, `Leave`.

### 3.3 Leave Management Workflow
- Deducts balances automatically upon HR approval (`paidTimeOff`, `sickLeave`).
- Automatically updates employee attendance records for approved leave spans.
- Dispatches instant email notifications to the employee.

### 3.4 Payroll Computation Engine
- Formula: `Gross Salary = Basic Salary + HRA + Standard Allowance + Performance Bonus + LTA + Fixed Allowance`
- Formula: `Deductions = PF Deduction + Professional Tax + Other Deductions`
- Formula: `Net Disbursed Salary = Gross Salary - Deductions`
- Supports monthly history archiving and payslip generation.
