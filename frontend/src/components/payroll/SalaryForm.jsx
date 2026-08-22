import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { Calculator, ShieldCheck, Sparkles } from 'lucide-react';

const SalaryForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  employeeName = 'Employee'
}) => {
  const [formData, setFormData] = useState({
    basicSalary: initialData.basicSalary ?? 4500,
    hra: initialData.hra ?? 1800,
    standardAllowance: initialData.standardAllowance ?? 500,
    performanceBonus: initialData.performanceBonus ?? 400,
    lta: initialData.lta ?? 300,
    fixedAllowance: initialData.fixedAllowance ?? 200,
    pfDeduction: initialData.pfDeduction ?? 350,
    professionalTax: initialData.professionalTax ?? 150,
    otherDeductions: initialData.otherDeductions ?? 100
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const basic = Number(formData.basicSalary) || 0;
  const allowances =
    Number(formData.hra || 0) +
    Number(formData.standardAllowance || 0) +
    Number(formData.performanceBonus || 0) +
    Number(formData.lta || 0) +
    Number(formData.fixedAllowance || 0);

  const deductions =
    Number(formData.pfDeduction || 0) +
    Number(formData.professionalTax || 0) +
    Number(formData.otherDeductions || 0);

  const gross = basic + allowances;
  const net = Math.max(0, gross - deductions);
  const yearly = net * 12;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      allowances,
      deductions,
      grossSalary: gross,
      netSalary: net,
      monthlyWage: net,
      yearlyWage: yearly
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Live Net Calculation Preview */}
      <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/30 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300">Live Calculated Monthly Net:</span>
          <span className="text-base font-black text-brand-purple dark:text-brand-purple-light font-mono">
            {formatCurrency(net)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span>Gross: {formatCurrency(gross)}</span>
          <span>Deductions: -{formatCurrency(deductions)}</span>
          <span>Annual CTC: {formatCurrency(yearly)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Basic & Allowances
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Basic Salary"
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            required
          />
          <Input
            label="House Rent (HRA)"
            type="number"
            name="hra"
            value={formData.hra}
            onChange={handleChange}
            required
          />
          <Input
            label="Standard Allowance"
            type="number"
            name="standardAllowance"
            value={formData.standardAllowance}
            onChange={handleChange}
          />
          <Input
            label="Performance Bonus"
            type="number"
            name="performanceBonus"
            value={formData.performanceBonus}
            onChange={handleChange}
          />
          <Input
            label="Leave Travel (LTA)"
            type="number"
            name="lta"
            value={formData.lta}
            onChange={handleChange}
          />
          <Input
            label="Fixed Allowance"
            type="number"
            name="fixedAllowance"
            value={formData.fixedAllowance}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-dark-750">
        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          Statutory Deductions
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Provident Fund"
            type="number"
            name="pfDeduction"
            value={formData.pfDeduction}
            onChange={handleChange}
          />
          <Input
            label="Professional Tax"
            type="number"
            name="professionalTax"
            value={formData.professionalTax}
            onChange={handleChange}
          />
          <Input
            label="Other Deductions"
            type="number"
            name="otherDeductions"
            value={formData.otherDeductions}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-dark-750">
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Save Salary Structure
        </Button>
      </div>
    </form>
  );
};

export default SalaryForm;
