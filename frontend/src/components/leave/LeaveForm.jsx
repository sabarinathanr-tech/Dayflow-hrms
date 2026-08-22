import React, { useState } from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { Calendar, FileText, Send, Sparkles } from 'lucide-react';
import { LEAVE_TYPES } from '../../utils/constants';
import { validateLeaveDates } from '../../utils/validation';

const LeaveForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  // Compute number of days in real-time
  let calculatedDays = 0;
  if (formData.startDate && formData.endDate) {
    const s = new Date(formData.startDate);
    const e = new Date(formData.endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
      calculatedDays = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }

    const dateErr = validateLeaveDates(formData.startDate, formData.endDate);
    if (dateErr) {
      newErrors.dates = dateErr;
    }

    if (!formData.reason || formData.reason.trim().length < 5) {
      newErrors.reason = 'Please provide a clear reason (minimum 5 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(formData);
    // Reset form after submit
    setFormData({
      leaveType: 'Sick Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Leave Type"
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        options={[
          { value: LEAVE_TYPES.SICK_LEAVE, label: 'Sick Leave' },
          { value: LEAVE_TYPES.PAID_TIME_OFF, label: 'Paid Time Off (Vacation)' },
          { value: LEAVE_TYPES.UNPAID_LEAVE, label: 'Unpaid Leave' }
        ]}
        error={errors.leaveType}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <Input
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>

      {errors.dates && (
        <p className="text-xs text-rose-400 font-medium">{errors.dates}</p>
      )}

      {calculatedDays > 0 && (
        <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Estimated Duration:</span>
          <span className="font-bold text-brand-purple-light">
            {calculatedDays} {calculatedDays === 1 ? 'Working Day' : 'Working Days'}
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Reason / Remarks <span className="text-rose-400">*</span>
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          placeholder="Briefly state reason for leave request..."
          className="w-full bg-dark-800 text-slate-100 text-sm rounded-xl px-4 py-2.5 border border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder:text-slate-500 transition-colors"
          required
        />
        {errors.reason && (
          <p className="mt-1 text-xs text-rose-400 font-medium">{errors.reason}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
        rightIcon={Send}
      >
        Submit Leave Request
      </Button>
    </form>
  );
};

export default LeaveForm;
