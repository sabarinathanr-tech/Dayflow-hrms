/**
 * Dayflow HRMS - Payroll & Compensation Calculation Service
 */

/**
 * Standard enterprise statutory deduction rates (customizable per region)
 */
export const STATUTORY_RATES = {
  PROVIDENT_FUND_PERCENT: 0.12, // 12% of basic
  PROFESSIONAL_TAX_FLAT: 150,
  DEFAULT_HRA_PERCENT: 0.40 // 40% of basic
};

/**
 * Calculates a complete salary breakdown from basic parameters
 */
export const calculateSalaryBreakdown = ({
  basicSalary = 0,
  hra,
  standardAllowance = 500,
  performanceBonus = 0,
  lta = 300,
  fixedAllowance = 200,
  otherAllowances = 0,
  pfDeduction,
  professionalTax,
  otherDeductions = 100,
  currency = 'USD'
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
 * Formats a currency amount with standard separators
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export default {
  calculateSalaryBreakdown,
  formatCurrency,
  STATUTORY_RATES
};
