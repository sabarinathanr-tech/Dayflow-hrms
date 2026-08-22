import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import SalaryCard from '../../components/payroll/SalaryCard';
import SalaryStructure from '../../components/payroll/SalaryStructure';
import Payslip from '../../components/payroll/Payslip';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { FileText, Download, ShieldCheck, History } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';

const MyPayroll = () => {
  const { employeeId, currentUser } = useAuth();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('August 2026');

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const data = await payrollService.getMyPayroll();
      setPayrollData(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [employeeId]);

  if (loading) {
    return <Loading text="Loading payroll structure..." />;
  }

  const sal = payrollData?.salary || {
    basicSalary: 6500,
    allowances: 1200,
    deductions: 500,
    netSalary: 7200,
    effectiveDate: '2023-03-15'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Compensation & Payroll
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review your approved compensation structure and access official disbursement slips.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setPayslipModalOpen(true)}
          leftIcon={FileText}
        >
          View Latest Payslip
        </Button>
      </div>

      {/* Salary Overview Card */}
      <SalaryCard
        basicSalary={sal.basicSalary}
        allowances={sal.allowances}
        deductions={sal.deductions}
        netSalary={sal.netSalary}
        effectiveDate={sal.effectiveDate}
      />

      {/* Salary Breakdown & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SalaryStructure salary={sal} />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-dark-750">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-brand-purple-light" />
                Recent Payslips
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">Disbursed</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {(payrollData?.history || [
                { month: 'August 2026', net: 7200, status: 'Paid' },
                { month: 'July 2026', net: 7200, status: 'Paid' },
                { month: 'June 2026', net: 7200, status: 'Paid' }
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-800/60 border border-dark-700/40 hover:border-dark-600 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-white block">{item.month}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatCurrency(item.net || sal.netSalary)} Net</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPayPeriod(item.month);
                      setPayslipModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs text-brand-purple-light hover:text-white font-medium p-1.5 rounded-lg hover:bg-brand-purple/10 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Slip</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal
        isOpen={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        title="Disbursement Slip"
        subtitle={selectedPayPeriod}
        maxWidth="max-w-2xl"
      >
        <Payslip
          employee={currentUser}
          salary={sal}
          payPeriod={selectedPayPeriod}
        />
      </Modal>
    </div>
  );
};

export default MyPayroll;
