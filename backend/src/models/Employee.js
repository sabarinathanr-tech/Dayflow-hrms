import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Employee', 'HR', 'Admin'],
      default: 'Employee'
    },
    designation: {
      type: String,
      default: 'Software Engineer'
    },
    department: {
      type: String,
      default: 'Engineering'
    },
    employmentType: {
      type: String,
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active'
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    dateOfBirth: {
      type: String,
      default: '1995-06-15'
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834'
    },
    address: {
      type: String,
      default: '742 Evergreen Terrace, Springfield, OR'
    },
    manager: {
      type: String,
      default: 'Sarah Jenkins'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    resume: {
      about: {
        type: String,
        default: 'Dedicated professional passionate about building reliable software and high-impact human systems.'
      },
      whatILove: {
        type: String,
        default: 'Designing resilient workflows, solving user challenges, and learning new engineering architectures.'
      },
      skills: {
        type: [String],
        default: ['React', 'JavaScript', 'Node.js', 'System Design']
      },
      certifications: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      education: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      experience: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      resumeDoc: {
        name: { type: String, default: null },
        size: { type: String, default: null },
        url: { type: String, default: null }
      }
    },
    privateInfo: {
      nationality: { type: String, default: 'American' },
      gender: { type: String, default: 'Prefer not to say' },
      maritalStatus: { type: String, default: 'Single' },
      personalEmail: { type: String, default: '' },
      city: { type: String, default: 'Springfield' },
      state: { type: String, default: 'Oregon' },
      country: { type: String, default: 'United States' },
      emergencyContact: {
        name: { type: String, default: 'Jordan Morgan' },
        relation: { type: String, default: 'Sibling' },
        phone: { type: String, default: '+1 (555) 019-9988' }
      },
      bankDetails: {
        accountNumber: { type: String, default: '•••• •••• 4829' },
        bankName: { type: String, default: 'First Horizon National Bank' },
        ifscCode: { type: String, default: 'FHNB0001892' },
        panNumber: { type: String, default: 'ABCDE1234F' },
        uanNumber: { type: String, default: '100928374651' },
        employeeCode: { type: String, default: 'DF-EMP-1001' }
      }
    },
    salary: {
      basicSalary: { type: Number, default: 4500 },
      hra: { type: Number, default: 1800 },
      standardAllowance: { type: Number, default: 500 },
      performanceBonus: { type: Number, default: 400 },
      lta: { type: Number, default: 300 },
      fixedAllowance: { type: Number, default: 200 },
      allowances: { type: Number, default: 3200 },
      pfDeduction: { type: Number, default: 350 },
      professionalTax: { type: Number, default: 150 },
      otherDeductions: { type: Number, default: 100 },
      deductions: { type: Number, default: 600 },
      grossSalary: { type: Number, default: 7700 },
      netSalary: { type: Number, default: 7100 },
      monthlyWage: { type: Number, default: 7100 },
      yearlyWage: { type: Number, default: 85200 },
      currency: { type: String, default: 'USD' },
      effectiveDate: { type: String, default: '2026-01-01' }
    },
    security: {
      emailVerified: { type: Boolean, default: true },
      lastLogin: { type: String, default: () => new Date().toISOString() },
      activeSessions: { type: Number, default: 1 }
    },
    leaveBalances: {
      paidTimeOff: { type: Number, default: 14 },
      sickLeave: { type: Number, default: 8 },
      unpaidLeave: { type: Number, default: 0 }
    },
    documents: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Employee = mongoose.model('Employee', employeeSchema);
