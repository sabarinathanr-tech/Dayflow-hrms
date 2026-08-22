# Dayflow HRMS — REST API Specification

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new account & dispatch OTP | Public |
| `POST` | `/api/auth/verify-email` | Verify email using 6-digit OTP | Public |
| `POST` | `/api/auth/resend-otp` | Request a fresh OTP code | Public |
| `POST` | `/api/auth/login` | Sign in with email & password to obtain JWT | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset token via email | Public |
| `POST` | `/api/auth/reset-password` | Set new password using reset token | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Bearer Token |

---

## 2. Employee Management (`/api/employees`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees` | List all employees (supports filtering & search) | HR / Admin |
| `GET` | `/api/employees/me` | Fetch logged-in employee detailed profile | All Authenticated |
| `GET` | `/api/employees/:id` | Get employee profile by ID | All Authenticated |
| `POST` | `/api/employees` | Onboard new employee profile | HR / Admin |
| `PUT` | `/api/employees/:id` | Update employee information | HR / Admin (Self for allowed fields) |
| `POST` | `/api/employees/:id/avatar` | Upload employee avatar picture | All Authenticated |
| `POST` | `/api/employees/:id/resume` | Upload employee resume document | All Authenticated |
| `DELETE` | `/api/employees/:id` | Archive or remove employee | Admin |

---

## 3. Attendance Tracking (`/api/attendance`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance/today` | Get today's punch in/out status | All Authenticated |
| `POST` | `/api/attendance/check-in` | Record daily check-in timestamp | All Authenticated |
| `POST` | `/api/attendance/check-out` | Record daily check-out timestamp | All Authenticated |
| `GET` | `/api/attendance/my-logs` | Get personal attendance logs | All Authenticated |
| `GET` | `/api/attendance/all` | Get company-wide attendance log table | HR / Admin |
| `GET` | `/api/attendance/stats` | Monthly attendance statistics summary | All Authenticated |

---

## 4. Leave Management (`/api/leaves`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leaves/my` | Get current user's leave requests | All Authenticated |
| `GET` | `/api/leaves/balances` | Get remaining paid/sick leave balances | All Authenticated |
| `POST` | `/api/leaves/apply` | Submit a new time-off request | All Authenticated |
| `GET` | `/api/leaves/all` | List all employee leave applications | HR / Admin |
| `PATCH` | `/api/leaves/:id/approve` | Approve leave & auto-update attendance | HR / Admin |
| `PATCH` | `/api/leaves/:id/reject` | Reject leave request with comment | HR / Admin |

---

## 5. Payroll Management (`/api/payroll`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/payroll/my` | Get personal salary structure & payslip history | All Authenticated |
| `GET` | `/api/payroll/all` | List company payroll master table | HR / Admin |
| `GET` | `/api/payroll/:employeeId` | Get specific employee payroll structure | HR / Admin |
| `PUT` | `/api/payroll/:employeeId` | Update salary components (HRA, Basic, PF) | HR / Admin |
| `POST` | `/api/payroll/process-month` | Run monthly salary disbursement batch | HR / Admin |

---

## 6. Reports & Analytics (`/api/reports`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/dashboard-stats` | Aggregated executive KPIs | HR / Admin |
| `GET` | `/api/reports/attendance-trends`| Daily/Weekly attendance analytics | HR / Admin |
| `GET` | `/api/reports/leave-breakdown` | Departmental leave distribution | HR / Admin |
| `GET` | `/api/reports/payroll-summary` | Company salary expenditure totals | HR / Admin |

---

## 7. Notifications & Audit Logs (`/api/notifications`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Get user notifications | All Authenticated |
| `PATCH` | `/api/notifications/:id/read`| Mark notification as read | All Authenticated |
| `PATCH` | `/api/notifications/read-all`| Mark all notifications as read | All Authenticated |
