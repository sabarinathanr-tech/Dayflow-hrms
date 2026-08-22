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
      default: 4500
    },
    hra: {
      type: Number,
      default: 1800
    },
    standardAllowance: {
      type: Number,
      default: 500
    },
    performanceBonus: {
      type: Number,
      default: 400
    },
    lta: {
      type: Number,
      default: 300
    },
    fixedAllowance: {
      type: Number,
      default: 200
    },
    allowances: {
      type: Number,
      default: 3200
    },
    pfDeduction: {
      type: Number,
      default: 350
    },
    professionalTax: {
      type: Number,
      default: 150
    },
    otherDeductions: {
      type: Number,
      default: 100
    },
    deductions: {
      type: Number,
      default: 600
    },
    grossSalary: {
      type: Number,
      default: 7700
    },
    netSalary: {
      type: Number,
      default: 7100
    },
    monthlyWage: {
      type: Number,
      default: 7100
    },
    yearlyWage: {
      type: Number,
      default: 85200
    },
    currency: {
      type: String,
      default: 'USD'
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
