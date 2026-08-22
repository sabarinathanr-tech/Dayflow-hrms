import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    employeeName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: 'Engineering'
    },
    designation: {
      type: String,
      default: 'Software Engineer'
    },
    basicSalary: {
      type: Number,
      required: true,
      default: 45000
    },
    hra: {
      type: Number,
      default: 18000
    },
    standardAllowance: {
      type: Number,
      default: 5000
    },
    performanceBonus: {
      type: Number,
      default: 4000
    },
    lta: {
      type: Number,
      default: 3000
    },
    fixedAllowance: {
      type: Number,
      default: 2000
    },
    allowances: {
      type: Number,
      default: 32000
    },
    pfDeduction: {
      type: Number,
      default: 3500
    },
    professionalTax: {
      type: Number,
      default: 200
    },
    otherDeductions: {
      type: Number,
      default: 1000
    },
    deductions: {
      type: Number,
      default: 4700
    },
    grossSalary: {
      type: Number,
      default: 77000
    },
    netSalary: {
      type: Number,
      default: 72300
    },
    monthlyWage: {
      type: Number,
      default: 72300
    },
    yearlyWage: {
      type: Number,
      default: 867600
    },
    currency: {
      type: String,
      default: 'INR'
    },
    effectiveDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    history: {
      type: [
        {
          month: String,
          gross: Number,
          deductions: Number,
          net: Number,
          status: { type: String, default: 'Paid' },
          date: String
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Payroll = mongoose.model('Payroll', payrollSchema);
