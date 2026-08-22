# ⚡ Dayflow HRMS
> **"Every workday, perfectly aligned."** — Enterprise Human Resource Management System.

Dayflow HRMS is a modern, full-stack human resource management platform designed for modern teams to streamline employee directory management, attendance tracking, leave requests with automated deduction workflows, compensation & payroll calculations, and real-time email notifications.

---

## 🚀 Key Features

- **🔐 Robust Authentication & Security**:
  - JWT session management with role-based access control (`Admin`, `HR`, `Employee`).
  - 6-digit OTP email verification and secure password reset flow.
- **👥 Employee Directory & Profiles**:
  - Full employee lifecycle management with resume, contact, skills, and banking metadata.
  - Avatar image and resume document upload support.
- **⏱️ Smart Attendance Tracker**:
  - Daily punch-in / punch-out with automated working duration & overtime calculation.
  - Interactive attendance calendar and company-wide attendance monitoring.
- **🏖️ Time-Off & Leave Management**:
  - Multi-type leave requests (`Paid Time Off`, `Sick Leave`, `Unpaid Leave`).
  - HR review portal with one-click approval/rejection and auto-calendar sync.
- **💵 Payroll & Compensation**:
  - Dynamic salary computation breakdown (HRA, Standard Allowance, PF deductions, Professional Tax).
  - Historical monthly payslip archive.
- **📊 Executive Reports & Analytics**:
  - Real-time HR analytics dashboard, headcount statistics, and attendance trend charts.
- **📧 Notification & Email Dispatch**:
  - Automated transactional HTML emails for OTP codes, password resets, and leave request decisions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Headless UI.
- **Backend**: Node.js, Express.js (ES Modules).
- **Database**: MongoDB & Mongoose ODM (MongoDB Atlas & Local MongoDB support).
- **Email**: Nodemailer (Gmail, Brevo, Mailtrap, SendGrid).

---

## 📦 Quick Start & Installation

### 1. Install Dependencies
In the root directory, install dependencies for both frontend and backend:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Environment Configuration
Configure your backend environment in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dayflow?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=f54f220c1ead130af4eb7fafcbc92e7895044dd4c7ba15b9512429fb95a1dbc4576bedd5f2a749c846914522d6da1f9812ebb59c3d64cc9c23e8f573217254b8
JWT_EXPIRES_IN=7d

# SMTP Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM="Dayflow HRMS <noreply@dayflow.internal>"
```

### 3. Run Development Servers
Start both backend API and frontend Vite servers concurrently:
```bash
# Terminal 1 - Backend Server (Port 5000)
npm run dev:backend

# Terminal 2 - Frontend Client (Port 5173)
npm run dev:frontend
```

---

## 🔑 Default Demo Accounts (Pre-Seeded)

The database automatically seeds the following initial accounts on first startup:

| Role | Email | Default Password | Employee ID |
| :--- | :--- | :--- | :--- |
| **HR Director** | `hr@dayflow.io` | `Password123!` | `HR-001` |
| **Lead Engineer** | `employee@dayflow.io` | `Password123!` | `EMP-1001` |
| **Product Designer** | `designer@dayflow.io` | `Password123!` | `EMP-1002` |

---

## 📚 Documentation

- 📐 [Architecture & System Design](docs/architecture.md)
- 🔌 [REST API Specification](docs/api.md)
- 🗄️ [Database Schema Reference](docs/database.md)

---

## 📄 License
MIT © Dayflow Team
