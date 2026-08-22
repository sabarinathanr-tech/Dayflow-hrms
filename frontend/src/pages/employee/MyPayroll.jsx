import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import SalaryCard from '../../components/payroll/SalaryCard';
import SalaryStructure from '../../components/payroll/SalaryStructure';
import Payslip from '../../components/payroll/Payslip';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CreditCard, Download, FileText, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import { payrollService } from '../../services/payrollService';

const MyPayroll = () => {
  const { employeeId } = useAuth();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPayslipMonth, setSelectedPayslipMonth] = useState(null);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);

  const fetchPayroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getMyPayroll();
      setPayrollData(data);
    } catch (err) {
      setError(err.message || 'Unable to load compensation records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [employeeId]);

  if (loading) {
    return <Loading text="Loading your compensation breakdown and payslips..." />;
  }

  if (error || !payrollData) {
    return (
      <ErrorState
        title="Payroll Information Unavailable"
        description={error || 'Could not retrieve salary information.'}
        onRetry={fetchPayroll}
      />
    );
  }

  const salary = payrollData.salary || {};
  const history = payrollData.history || [];

  const handleOpenPayslip = (month) => {
    setSelectedPayslipMonth(month);
    setPayslipModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light uppercase tracking-wider">
                Read-Only Compensation Portal
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Compensation & Salary Slips
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              View your monthly take-home, allowances, statutory deductions, and printable payslips.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenPayslip('August 2026')}
            leftIcon={FileText}
          >
            View Latest Payslip
          </Button>
        </div>
      </div>

      {/* 2. Salary Summary Cards */}
      <SalaryCard
        basicSalary={salary.basicSalary}
        allowances={salary.allowances}
        deductions={salary.deductions}
        netSalary={salary.netSalary}
      />

      {/* 3. Detailed Component Breakdown Table */}
      <SalaryStructure salary={salary} />

      {/* 4. Payslip History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Monthly Payslip Archive
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Historical salary disbursement slips and tax records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-dark-700/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-dark-800/60 border-b border-slate-200 dark:border-dark-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Total Deductions</th>
                <th className="py-3 px-4">Net Disbursed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-750 text-slate-700 dark:text-slate-300">
              {history.map((slip, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-dark-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{slip.month}</td>
                  <td className="py-3 px-4 font-mono font-medium">{formatCurrency(slip.gross)}</td>
                  <td className="py-3 px-4 font-mono text-rose-600 dark:text-rose-400 font-medium">-{formatCurrency(slip.deductions)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(slip.net)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenPayslip(slip.month)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-750 hover:bg-slate-200 dark:hover:bg-dark-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Payslip Modal */}
      <Modal
        isOpen={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        title="Official Payslip Document"
        subtitle={`Disbursement period: ${selectedPayslipMonth || 'August 2026'}`}
        maxWidth="max-w-2xl"
      >
        <Payslip
          employee={{
            name: payrollData.employeeName,
            employeeId: payrollData.employeeId,
            designation: payrollData.designation,
            department: payrollData.department,
            joiningDate: payrollData.joiningDate
          }}
          salary={salary}
          month={selectedPayslipMonth || 'August 2026'}
        />
      </Modal>
    </div>
  );
};

export default MyPayroll;
