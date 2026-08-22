/**
 * Dayflow HRMS - Payroll & Compensation Calculation Service
 */

/**
 * Standard enterprise statutory deduction rates (INR standards)
 */
export const STATUTORY_RATES = {
  PROVIDENT_FUND_PERCENT: 0.12, // 12% of basic
  PROFESSIONAL_TAX_FLAT: 200, // Standard PT in INR
  DEFAULT_HRA_PERCENT: 0.40 // 40% of basic
};

/**
 * Calculates a complete salary breakdown from basic parameters in INR
 */
export const calculateSalaryBreakdown = ({
  basicSalary = 0,
  hra,
  standardAllowance = 5000,
  performanceBonus = 0,
  lta = 3000,
  fixedAllowance = 2000,
  otherAllowances = 0,
  pfDeduction,
  professionalTax,
  otherDeductions = 500,
  currency = 'INR'
}) => {
  const basic = Math.max(0, Number(basicSalary));
  const computedHra = hra !== undefined ? Number(hra) : Math.round(basic * STATUTORY_RATES.DEFAULT_HRA_PERCENT);
  const computedPf = pfDeduction !== undefined ? Number(pfDeduction) : Math.round(basic * STATUTORY_RATES.PROVIDENT_FUND_PERCENT);
  const computedPt = professionalTax !== undefined ? Number(professionalTax) : STATUTORY_RATES.PROFESSIONAL_TAX_FLAT;

  const totalAllowances =
    computedHra +
    Number(standardAllowance) +
    Number(performanceBonus) +
    Number(lta) +
    Number(fixedAllowance) +
    Number(otherAllowances);

  const totalDeductions =
    computedPf +
    computedPt +
    Number(otherDeductions);

  const grossSalary = basic + totalAllowances;
  const netSalary = Math.max(0, grossSalary - totalDeductions);
  const monthlyWage = netSalary;
  const yearlyWage = netSalary * 12;

  return {
    basicSalary: basic,
    hra: computedHra,
    standardAllowance: Number(standardAllowance),
    performanceBonus: Number(performanceBonus),
    lta: Number(lta),
    fixedAllowance: Number(fixedAllowance),
    allowances: totalAllowances,
    pfDeduction: computedPf,
    professionalTax: computedPt,
    otherDeductions: Number(otherDeductions),
    deductions: totalDeductions,
    grossSalary,
    netSalary,
    monthlyWage,
    yearlyWage,
    currency
  };
};

/**
 * Formats a currency amount in Indian Rupees (INR)
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export default {
  calculateSalaryBreakdown,
  formatCurrency,
  STATUTORY_RATES
};
