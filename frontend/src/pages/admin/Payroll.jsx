import React, { useState, useEffect } from 'react';
import PayrollTable from '../../components/payroll/PayrollTable';
import SalaryForm from '../../components/payroll/SalaryForm';
import Payslip from '../../components/payroll/Payslip';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import useToast from '../../hooks/useToast';
import { CreditCard, DollarSign, Download, Sparkles, TrendingUp } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';

const Payroll = () => {
  const toast = useToast();

  const [payrollList, setPayrollList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Salary Modal
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [updatingLoading, setUpdatingLoading] = useState(false);

  // View Payslip Modal
  const [viewingPayslip, setViewingPayslip] = useState(null);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);

  const fetchPayroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getAllPayroll();
      setPayrollList(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load corporate payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleOpenSalaryEditor = (emp) => {
    setEditingEmployee(emp);
    setSalaryModalOpen(true);
  };

  const handleOpenPayslip = (emp) => {
    setViewingPayslip(emp);
    setPayslipModalOpen(true);
  };

  const handleSaveSalary = async (salaryData) => {
    if (!editingEmployee) return;
    setUpdatingLoading(true);
    try {
      await payrollService.updateSalaryStructure(editingEmployee.id, salaryData);
      toast.success(`Salary structure updated for ${editingEmployee.employeeName}!`);
      setSalaryModalOpen(false);
      setEditingEmployee(null);
      await fetchPayroll();
    } catch (err) {
      toast.error('Failed to update compensation.');
    } finally {
      setUpdatingLoading(false);
    }
  };

  if (loading && payrollList.length === 0) {
    return <Loading text="Loading corporate payroll management data..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Payroll Data Unavailable"
        description={error}
        onRetry={fetchPayroll}
      />
    );
  }

  // Calculate totals
  const totalMonthlyNet = payrollList.reduce((acc, p) => acc + (p.netSalary || 0), 0);
  const totalGross = payrollList.reduce((acc, p) => acc + (p.grossSalary || 0), 0);
  const totalDeductions = payrollList.reduce((acc, p) => acc + (p.deductions || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Corporate Payroll & Salary Structures
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage employee wage components, calculate gross/net take-home, and audit statutory deductions
          </p>
        </div>
      </div>

      {/* 2. Cumulative Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Monthly Net Outflow
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalMonthlyNet)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Across {payrollList.length} active employees</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Gross Compensation
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatCurrency(totalGross)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">Basic wages + allowances</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Withheld Statutory Deductions
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {formatCurrency(totalDeductions)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-medium">PF, Professional Tax & Insurance</span>
        </div>
      </div>

      {/* 3. Payroll Records Table */}
      <PayrollTable
        payrollList={payrollList}
        onEdit={handleOpenSalaryEditor}
        onViewPayslip={handleOpenPayslip}
      />

      {/* Adjust Salary Modal */}
      <Modal
        isOpen={salaryModalOpen}
        onClose={() => {
          setSalaryModalOpen(false);
          setEditingEmployee(null);
        }}
        title="Adjust Salary Structure"
        subtitle={`Editing compensation for ${editingEmployee?.employeeName || 'Employee'}`}
        maxWidth="max-w-md"
      >
        {editingEmployee && (
          <SalaryForm
            initialData={{
              basicSalary: editingEmployee.basicSalary,
              hra: editingEmployee.hra,
              standardAllowance: editingEmployee.standardAllowance,
              performanceBonus: editingEmployee.performanceBonus,
              lta: editingEmployee.lta,
              fixedAllowance: editingEmployee.fixedAllowance,
              pfDeduction: editingEmployee.pfDeduction,
              professionalTax: editingEmployee.professionalTax,
              otherDeductions: editingEmployee.otherDeductions
            }}
            onSubmit={handleSaveSalary}
            loading={updatingLoading}
            employeeName={editingEmployee.employeeName}
          />
        )}
      </Modal>

      {/* View Payslip Modal */}
      <Modal
        isOpen={payslipModalOpen}
        onClose={() => {
          setPayslipModalOpen(false);
          setViewingPayslip(null);
        }}
        title="Official Payslip Document"
        subtitle={`Employee: ${viewingPayslip?.employeeName || 'Employee'}`}
        maxWidth="max-w-2xl"
      >
        {viewingPayslip && (
          <Payslip
            employee={{
              name: viewingPayslip.employeeName,
              employeeId: viewingPayslip.employeeId,
              designation: viewingPayslip.designation,
              department: viewingPayslip.department,
              joiningDate: viewingPayslip.lastUpdated
            }}
            salary={{
              basicSalary: viewingPayslip.basicSalary,
              hra: viewingPayslip.hra,
              standardAllowance: viewingPayslip.standardAllowance,
              performanceBonus: viewingPayslip.performanceBonus,
              lta: viewingPayslip.lta,
              fixedAllowance: viewingPayslip.fixedAllowance,
              allowances: viewingPayslip.allowances,
              pfDeduction: viewingPayslip.pfDeduction,
              professionalTax: viewingPayslip.professionalTax,
              otherDeductions: viewingPayslip.otherDeductions,
              deductions: viewingPayslip.deductions,
              grossSalary: viewingPayslip.grossSalary,
              netSalary: viewingPayslip.netSalary,
              monthlyWage: viewingPayslip.monthlyWage,
              yearlyWage: viewingPayslip.yearlyWage,
              currency: viewingPayslip.currency || 'INR',
              effectiveDate: viewingPayslip.lastUpdated
            }}
            month="August 2026"
          />
        )}
      </Modal>
    </div>
  );
};

export default Payroll;
