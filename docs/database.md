# Dayflow HRMS — Database Schema Specification

Dayflow utilizes **MongoDB** with **Mongoose ODM**. Below is the data model dictionary.

---

## 1. Collections Overview

| Collection | Model Name | Description | Key Relationships |
| :--- | :--- | :--- | :--- |
| `users` | `User` | User credentials, roles, and auth tokens | Maps to `Employee` via `employeeId` |
| `employees` | `Employee` | Core employee profile, resume, private & bank info | Primary profile anchor for the entire system |
| `attendances` | `Attendance` | Daily punch-in/out timestamps, status, hours | References `employeeId` + unique `date` index |
| `leaverequests` | `LeaveRequest`| Employee leave requests, status, HR reviews | References `employeeId` |
| `payrolls` | `Payroll` | Base salary structure, allowances, and payslip history | References `employeeId` |
| `notifications` | `Notification` | In-app alerts and notifications | References `userId` (employeeId) |
| `auditlogs` | `AuditLog` | Enterprise compliance audit trail | Tracks all mutations with IP & actor |

---

## 2. Model Schemas

### `User` Schema
```javascript
{
  employeeId: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Employee', 'HR', 'Admin'], default: 'Employee' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### `Employee` Schema
```javascript
{
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Employee', 'HR', 'Admin'], default: 'Employee' },
  designation: String,
  department: String,
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Terminated'], default: 'Active' },
  joiningDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dateOfBirth: String,
  phone: String,
  address: String,
  manager: String,
  avatar: String,
  resume: {
    about: String,
    whatILove: String,
    skills: [String],
    certifications: [{ name: String, issuer: String, year: String }],
    education: [{ degree: String, school: String, year: String }],
    experience: [{ role: String, company: String, duration: String }]
  },
  privateInfo: {
    nationality: String,
    gender: String,
    maritalStatus: String,
    personalEmail: String,
    city: String,
    state: String,
    country: String,
    emergencyContact: { name: String, relation: String, phone: String },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      panNumber: String,
      uanNumber: String,
      employeeCode: String
    }
  },
  salary: {
    basicSalary: Number,
    hra: Number,
    standardAllowance: Number,
    performanceBonus: Number,
    lta: Number,
    fixedAllowance: Number,
    allowances: Number,
    pfDeduction: Number,
    professionalTax: Number,
    otherDeductions: Number,
    deductions: Number,
    grossSalary: Number,
    netSalary: Number,
    monthlyWage: Number,
    yearlyWage: Number,
    currency: { type: String, default: 'USD' },
    effectiveDate: String
  },
  leaveBalances: {
    paidTimeOff: { type: Number, default: 14 },
    sickLeave: { type: Number, default: 8 },
    unpaidLeave: { type: Number, default: 0 }
  }
}
```

### `Attendance` Schema
```javascript
{
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  department: String,
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: String,                        // Format: HH:mm
  checkOut: String,                       // Format: HH:mm
  workingHours: { type: Number, default: 0 },
  standardHours: { type: Number, default: 480 },
  extraHours: { type: Number, default: 0 },
  status: { type: String, enum: ['Present', 'Late', 'Half Day', 'Absent', 'Leave', 'Holiday'], default: 'Present' }
}
```

### `LeaveRequest` Schema
```javascript
{
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  department: String,
  leaveType: { type: String, enum: ['Paid Time Off', 'Sick Leave', 'Unpaid Leave', 'Casual Leave'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  attachment: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: String,
  reviewedOn: String,
  comment: String
}
```
