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
      default: 'Full-Time'
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
      default: '+91 98765 43210'
    },
    address: {
      type: String,
      default: '100 Innovation Park, Whitefield, Bengaluru, KA 560066'
    },
    manager: {
      type: String,
      default: 'Sarah Jenkins'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
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
        url: { type: String, default: null },
        data: { type: String, default: null },
        type: { type: String, default: null },
        uploadedDate: { type: String, default: null }
      }
    },
    privateInfo: {
      nationality: { type: String, default: 'Indian' },
      gender: { type: String, default: 'Prefer not to say' },
      maritalStatus: { type: String, default: 'Single' },
      personalEmail: { type: String, default: '' },
      city: { type: String, default: 'Bengaluru' },
      state: { type: String, default: 'Karnataka' },
      country: { type: String, default: 'India' },
      emergencyContact: {
        name: { type: String, default: 'Family Contact' },
        relation: { type: String, default: 'Family' },
        phone: { type: String, default: '+91 98765 00000' }
      },
      bankDetails: {
        accountNumber: { type: String, default: '•••• •••• 4829' },
        bankName: { type: String, default: 'HDFC Bank' },
        ifscCode: { type: String, default: 'HDFC0001892' },
        panNumber: { type: String, default: 'ABCDE1234F' },
        uanNumber: { type: String, default: '100928374651' },
        employeeCode: { type: String, default: 'DF-EMP-1001' }
      }
    },
    salary: {
      basicSalary: { type: Number, default: 45000 },
      hra: { type: Number, default: 18000 },
      standardAllowance: { type: Number, default: 5000 },
      performanceBonus: { type: Number, default: 4000 },
      lta: { type: Number, default: 3000 },
      fixedAllowance: { type: Number, default: 2000 },
      allowances: { type: Number, default: 32000 },
      pfDeduction: { type: Number, default: 3500 },
      professionalTax: { type: Number, default: 200 },
      otherDeductions: { type: Number, default: 1000 },
      deductions: { type: Number, default: 4700 },
      grossSalary: { type: Number, default: 77000 },
      netSalary: { type: Number, default: 72300 },
      monthlyWage: { type: Number, default: 72300 },
      yearlyWage: { type: Number, default: 867600 },
      currency: { type: String, default: 'INR' },
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
