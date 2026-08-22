import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { DollarSign, TrendingUp, TrendingDown, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const SalaryForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  employeeName = 'Employee'
}) => {
  const [basicSalary, setBasicSalary] = useState(initialData.basicSalary || '5000');
  const [allowances, setAllowances] = useState(initialData.allowances || '800');
  const [deductions, setDeductions] = useState(initialData.deductions || '300');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.basicSalary !== undefined) setBasicSalary(initialData.basicSalary.toString());
      if (initialData.allowances !== undefined) setAllowances(initialData.allowances.toString());
      if (initialData.deductions !== undefined) setDeductions(initialData.deductions.toString());
    }
  }, [initialData]);

  const numBasic = Math.max(0, Number(basicSalary) || 0);
  const numAllow = Math.max(0, Number(allowances) || 0);
  const numDeduct = Math.max(0, Number(deductions) || 0);
  const computedNet = numBasic + numAllow - numDeduct;

  const validate = () => {
    const errs = {};
    if (isNaN(numBasic) || numBasic < 0) errs.basicSalary = 'Enter a valid positive basic salary';
    if (isNaN(numAllow) || numAllow < 0) errs.allowances = 'Enter a valid allowances amount';
    if (isNaN(numDeduct) || numDeduct < 0) errs.deductions = 'Enter a valid deductions amount';
    if (numDeduct > numBasic + numAllow) {
      errs.deductions = 'Deductions cannot exceed total earnings';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      basicSalary: numBasic,
      allowances: numAllow,
      deductions: numDeduct,
      netSalary: computedNet
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3.5 rounded-xl bg-dark-800 border border-dark-700">
        <span className="text-slate-400 font-medium">Modifying Salary Structure For:</span>
        <span className="text-sm font-bold text-white block mt-0.5">{employeeName}</span>
      </div>

      <Input
        label="Basic Monthly Salary ($)"
        type="number"
        min="0"
        step="50"
        value={basicSalary}
        onChange={(e) => setBasicSalary(e.target.value)}
        leftIcon={DollarSign}
        error={errors.basicSalary}
        required
      />

      <Input
        label="Monthly Allowances ($)"
        type="number"
        min="0"
        step="50"
        value={allowances}
        onChange={(e) => setAllowances(e.target.value)}
        leftIcon={TrendingUp}
        error={errors.allowances}
        required
      />

      <Input
        label="Monthly Deductions ($)"
        type="number"
        min="0"
        step="25"
        value={deductions}
        onChange={(e) => setDeductions(e.target.value)}
        leftIcon={TrendingDown}
        error={errors.deductions}
        required
      />

      {/* Live Calculated Net Output */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple-light block">
              Calculated Net Salary
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ${numBasic} + ${numAllow} - ${numDeduct}
            </span>
          </div>
          <span className="text-lg font-black text-white font-mono">
            {formatCurrency(computedNet)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full mt-2"
        leftIcon={Save}
      >
        Update Salary Structure
      </Button>
    </form>
  );
};

export default SalaryForm;
