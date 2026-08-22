import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Calendar, FileText, Upload, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { LEAVE_TYPES } from '../../utils/constants';
import { isLeaveRangeValid } from '../../utils/validation';

const LeaveForm = ({
  balances = { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 },
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    leaveType: 'Paid Time Off',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null
  });

  const [duration, setDuration] = useState(0);
  const [errors, setErrors] = useState({});

  // Calculate duration automatically
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diff);
      } else {
        setDuration(0);
      }
    } else {
      setDuration(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, attachment: 'File size must be under 5 MB' }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachment: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type || 'PDF'
        }
      }));
      setErrors((prev) => ({ ...prev, attachment: '' }));
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && !isLeaveRangeValid(formData.startDate, formData.endDate)) {
      newErrors.endDate = 'End date must be equal or after start date';
    }
    if (!formData.reason || formData.reason.trim().length < 5) {
      newErrors.reason = 'Please provide a reason (min 5 characters)';
    }

    // Check balance
    if (formData.leaveType === 'Paid Time Off' && duration > (balances.paidTimeOff ?? 14)) {
      newErrors.leaveType = `Insufficient Paid Time Off balance (${balances.paidTimeOff ?? 14} days left)`;
    } else if (formData.leaveType === 'Sick Leave' && duration > (balances.sickLeave ?? 8)) {
      newErrors.leaveType = `Insufficient Sick Leave balance (${balances.sickLeave ?? 8} days left)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      days: duration
    });
  };

  const isSickLeave = formData.leaveType === 'Sick Leave';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-brand-purple/10 border border-purple-200/80 dark:border-brand-purple/20 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Available {formData.leaveType}:
        </span>
        <span className="font-black text-brand-purple dark:text-brand-purple-light font-mono">
          {formData.leaveType === 'Sick Leave'
            ? balances.sickLeave ?? 8
            : formData.leaveType === 'Paid Time Off'
            ? balances.paidTimeOff ?? 14
            : 'Unlimited'}{' '}
          days
        </span>
      </div>

      <Select
        label="Time Off Type"
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        options={(Array.isArray(LEAVE_TYPES) ? LEAVE_TYPES : Object.values(LEAVE_TYPES)).map((t) => ({ value: t, label: t }))}
        error={errors.leaveType}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />
        <Input
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          required
        />
      </div>

      {duration > 0 && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">Requested Duration:</span>
          <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
            {duration} {duration === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Reason / Remarks <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="reason"
          rows={3}
          value={formData.reason}
          onChange={handleChange}
          placeholder="Describe the reason for your time off request..."
          className="w-full bg-white dark:bg-dark-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm rounded-2xl p-3.5 border border-slate-200 dark:border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple shadow-sm"
        />
        {errors.reason && (
          <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.reason}</p>
        )}
      </div>

      {/* File Attachment Upload (Required/Recommended for Sick Leave Medical Certificate) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>
            Medical Certificate / Document {isSickLeave ? '(Recommended)' : '(Optional)'}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">PDF, JPG, PNG (Max 5MB)</span>
        </label>

        {formData.attachment ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-900 dark:text-white block truncate">{formData.attachment.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{formData.attachment.size}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={removeAttachment}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-dark-700 hover:border-brand-purple dark:hover:border-brand-purple bg-slate-50/50 dark:bg-dark-800/40 cursor-pointer transition-colors text-center">
            <Upload className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-xs font-bold text-brand-purple dark:text-brand-purple-light">
              Click to upload document
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Drag & drop or browse from device</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
        {errors.attachment && (
          <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.attachment}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-dark-750">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Submit Request
        </Button>
      </div>
    </form>
  );
};

export default LeaveForm;
