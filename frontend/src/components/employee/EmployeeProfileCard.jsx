import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Edit3,
  Camera,
  Shield,
  Download,
  CheckCircle
} from 'lucide-react';
import useToast from '../../hooks/useToast';
import { employeeService } from '../../services/employeeService';

const EmployeeProfileCard = ({
  employee,
  isSelf = false,
  onProfileUpdated
}) => {
  const toast = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [avatarUrlModalOpen, setAvatarUrlModalOpen] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState(employee?.avatar || '');
  const [saving, setSaving] = useState(false);

  const [selfEditData, setSelfEditData] = useState({
    phone: employee?.phone || '',
    address: employee?.address || ''
  });

  if (!employee) return null;

  const handleSelfUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeeService.updateProfile(employee.id, {
        phone: selfEditData.phone,
        address: selfEditData.address
      });
      toast.success('Profile details updated successfully!');
      setEditModalOpen(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error('Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!newAvatarUrl) return;
    setSaving(true);
    try {
      await employeeService.updateProfile(employee.id, {
        avatar: newAvatarUrl
      });
      toast.success('Profile picture updated!');
      setAvatarUrlModalOpen(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error('Unable to update picture.');
    } finally {
      setSaving(false);
    }
  };

  const sal = employee.salary || {
    basicSalary: 6500,
    allowances: 1200,
    deductions: 500,
    netSalary: 7200
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-850 border border-dark-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar
                src={employee.avatar}
                name={employee.name}
                size="xl"
                status={employee.status === 'Active' ? 'online' : 'leave'}
              />
              {isSelf && (
                <button
                  onClick={() => setAvatarUrlModalOpen(true)}
                  className="absolute inset-0 bg-dark-950/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Update profile picture"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {employee.name}
                </h2>
                <Badge variant={employee.status} dot size="sm">
                  {employee.status}
                </Badge>
              </div>

              <p className="text-sm text-slate-300 font-medium">{employee.designation}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span className="font-mono text-brand-cyan-light">{employee.id || employee.employeeId}</span>
                <span>•</span>
                <span>{employee.department}</span>
                <span>•</span>
                <span>{employee.employmentType || 'Full-Time'}</span>
              </div>
            </div>
          </div>

          {isSelf && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              leftIcon={Edit3}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-700/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-brand-purple-light" />
              Personal Details
            </h3>
            {isSelf && (
              <span className="text-[10px] text-brand-cyan-light font-medium">Editable by you</span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Work Email:</span>
              <span className="font-semibold text-slate-200">{employee.email}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Contact Phone:</span>
              <span className="font-mono text-slate-200">{employee.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Date of Birth:</span>
              <span className="text-slate-200">{formatDate(employee.dateOfBirth)}</span>
            </div>
            <div className="py-1.5">
              <span className="text-slate-400 font-medium block mb-1">Residential Address:</span>
              <span className="text-slate-200 font-medium block bg-dark-800/60 p-2.5 rounded-xl border border-dark-700/60">
                {employee.address || 'Address not listed'}
              </span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-700/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-cyan-light" />
              Employment Details
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">Managed by HR</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Employee ID:</span>
              <span className="font-mono font-bold text-brand-purple-light">{employee.id || employee.employeeId}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Department:</span>
              <span className="font-semibold text-slate-200">{employee.department}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Designation:</span>
              <span className="font-semibold text-slate-200">{employee.designation}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-dark-750">
              <span className="text-slate-400 font-medium">Joining Date:</span>
              <span className="text-slate-200">{formatDate(employee.joiningDate)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 font-medium">Direct Manager:</span>
              <span className="text-slate-200">{employee.manager || 'Sarah Jenkins (HR-001)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Structure (Read Only for Employee) */}
      <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-dark-700/60">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Salary & Compensation Structure
            </h3>
            <p className="text-xs text-slate-400">Monthly breakdown as agreed with People Operations</p>
          </div>
          <Badge variant="approved" size="sm">
            Read Only
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Basic Pay</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {formatCurrency(sal.basicSalary)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Allowances</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">
              +{formatCurrency(sal.allowances)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Deductions</span>
            <span className="text-lg font-bold text-rose-400 mt-1 block">
              -{formatCurrency(sal.deductions)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-tr from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/40">
            <span className="text-[11px] font-bold text-brand-purple-light uppercase">Net Salary</span>
            <span className="text-lg font-black text-white mt-1 block">
              {formatCurrency(sal.netSalary || (sal.basicSalary + sal.allowances - sal.deductions))}
            </span>
          </div>
        </div>
      </div>

      {/* Documents Repository */}
      <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-dark-700/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-purple-light" />
            Verified Employee Documents
          </h3>
          <span className="text-xs text-slate-500">{employee.documents?.length || 0} Files</span>
        </div>

        {employee.documents && employee.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {employee.documents.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-dark-800/60 border border-dark-700/60 flex items-center justify-between hover:border-dark-600 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple-light">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{doc.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.size || '1.2 MB'} • {formatDate(doc.uploadedDate)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info(`Opening ${doc.name}`)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                  title="Download / View document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">No documents currently uploaded.</p>
        )}
      </div>

      {/* Edit Profile Modal (Employee Self Edit) */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Personal Profile"
        subtitle="Update your contact information"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSelfUpdate} className="space-y-4">
          <Input
            label="Phone Number"
            name="phone"
            value={selfEditData.phone}
            onChange={(e) => setSelfEditData((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            leftIcon={Phone}
          />

          <Input
            label="Residential Address"
            name="address"
            value={selfEditData.address}
            onChange={(e) => setSelfEditData((p) => ({ ...p, address: e.target.value }))}
            placeholder="Street address, City, State, ZIP"
            leftIcon={MapPin}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Details
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Avatar Modal */}
      <Modal
        isOpen={avatarUrlModalOpen}
        onClose={() => setAvatarUrlModalOpen(false)}
        title="Update Profile Picture"
        subtitle="Provide an image URL for your profile"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Input
            label="Image URL"
            value={newAvatarUrl}
            onChange={(e) => setNewAvatarUrl(e.target.value)}
            placeholder="https://..."
          />

          {newAvatarUrl && (
            <div className="flex items-center justify-center p-4 bg-dark-800 rounded-xl border border-dark-700">
              <Avatar src={newAvatarUrl} name={employee.name} size="xl" />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setAvatarUrlModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAvatarUpdate} loading={saving}>
              Save Picture
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeProfileCard;
