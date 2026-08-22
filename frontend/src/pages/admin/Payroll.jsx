import React, { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import PayrollTable from '../../components/payroll/PayrollTable';
import SalaryForm from '../../components/payroll/SalaryForm';
import Payslip from '../../components/payroll/Payslip';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { DollarSign, Download, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { payrollService } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';

const Payroll = () => {
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit salary modal
  const [editingRecord, setEditingRecord] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingSalary, setSavingSalary] = useState(false);

  // Payslip modal
  const [viewingRecord, setViewingRecord] = useState(null);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const data = await payrollService.getAllPayroll();
      setRecords(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setEditModalOpen(true);
  };

  const handleOpenPayslip = (rec) => {
    setViewingRecord(rec);
    setPayslipModalOpen(true);
  };

  const handleUpdateSalary = async (salaryData) => {
    if (!editingRecord) return;
    setSavingSalary(true);
    try {
      await payrollService.updateSalaryStructure(editingRecord.employeeId, salaryData);
      toast.success(`Salary structure updated for ${editingRecord.employeeName}`);
      setEditModalOpen(false);
      await fetchPayroll();
    } catch (err) {
      toast.error('Unable to update salary.');
    } finally {
      setSavingSalary(false);
    }
  };

  const totalMonthlyPayroll = records.reduce((acc, r) => acc + (r.netSalary || 0), 0);
  const totalBasePay = records.reduce((acc, r) => acc + (r.basicSalary || 0), 0);
  const totalAllowances = records.reduce((acc, r) => acc + (r.allowances || 0), 0);
  const totalDeductions = records.reduce((acc, r) => acc + (r.deductions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Company Payroll & Compensation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage employee compensation structures, revise base salaries, and generate payslips.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast.success('Payroll summary report exported.')}
          leftIcon={Download}
        >
          Export Summary
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Monthly Outflow
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(totalMonthlyPayroll)}
          </h3>
          <p className="text-xs text-brand-purple-light mt-1">{records.length} Employees</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Base Salary Total
          </span>
          <h3 className="text-2xl font-extrabold text-slate-200 mt-1">
            {formatCurrency(totalBasePay)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Fixed payroll obligation</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Allowances
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
            +{formatCurrency(totalAllowances)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">HRA & Benefits</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Deductions
          </span>
          <h3 className="text-2xl font-extrabold text-rose-400 mt-1">
            -{formatCurrency(totalDeductions)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Tax & Contributions</p>
        </div>
      </div>

      {/* Payroll Table */}
      {loading ? (
        <Loading text="Loading corporate payroll records..." />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Workforce Salary Breakdown ({records.length})
            </h3>
            <span className="text-xs text-slate-400">Monthly Compensation</span>
          </div>

          <PayrollTable
            records={records}
            onEditSalary={handleOpenEdit}
            onViewPayslip={handleOpenPayslip}
          />
        </div>
      )}

      {/* Salary Structure Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Salary Structure"
        subtitle={editingRecord ? `Updating ${editingRecord.employeeName}` : 'Salary Update'}
        maxWidth="max-w-md"
      >
        {editingRecord && (
          <SalaryForm
            initialData={editingRecord}
            onSubmit={handleUpdateSalary}
            loading={savingSalary}
            employeeName={editingRecord.employeeName}
          />
        )}
      </Modal>

      {/* Payslip Inspection Modal */}
      <Modal
        isOpen={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        title="Employee Disbursement Slip"
        subtitle="August 2026 Pay Period"
        maxWidth="max-w-2xl"
      >
        {viewingRecord && (
          <Payslip
            employee={viewingRecord}
            salary={{
              basicSalary: viewingRecord.basicSalary,
              allowances: viewingRecord.allowances,
              deductions: viewingRecord.deductions,
              netSalary: viewingRecord.netSalary
            }}
            payPeriod="August 2026"
          />
        )}
      </Modal>
    </div>
  );
};

export default Payroll;
