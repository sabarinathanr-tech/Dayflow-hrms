import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  User,
  Briefcase,
  FileText,
  Lock,
  DollarSign,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  Laptop,
  Smartphone,
  LogOut,
  Sparkles,
  Edit3
} from 'lucide-react';
import useToast from '../../hooks/useToast';
import { employeeService } from '../../services/employeeService';
import { evaluatePasswordStrength } from '../../utils/validation';

const EmployeeProfileCard = ({
  employee,
  isOwnProfile = true,
  canEdit = true,
  onProfileUpdated
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'private' | 'salary' | 'security'
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [editBasicModal, setEditBasicModal] = useState(false);

  // Editable basic state
  const [basicForm, setBasicForm] = useState({
    name: employee?.name || '',
    phone: employee?.phone || '',
    address: employee?.address || ''
  });

  // Skills & Certs state for dynamic frontend additions
  const [skills, setSkills] = useState(employee?.resume?.skills || ['React.js', 'TypeScript', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const [certs, setCerts] = useState(
    employee?.resume?.certifications || [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'AWS', year: '2023' }
    ]
  );
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '2024' });
  const [showAddCert, setShowAddCert] = useState(false);

  // Security password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  if (!employee) return null;

  const resume = employee.resume || {};
  const privateInfo = employee.privateInfo || {};
  const salary = employee.salary || {};
  const security = employee.security || {};

  // Salary calculations
  const basic = Number(salary.basicSalary) || 4500;
  const hra = Number(salary.hra) || Math.round(basic * 0.4);
  const stdAllow = Number(salary.standardAllowance) || 500;
  const perfBonus = Number(salary.performanceBonus) || 400;
  const lta = Number(salary.lta) || 300;
  const fixedAllow = Number(salary.fixedAllowance) || 200;
  const allowances = salary.allowances !== undefined ? Number(salary.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

  const pf = Number(salary.pfDeduction) || 350;
  const profTax = Number(salary.professionalTax) || 150;
  const otherDeduct = Number(salary.otherDeductions) || 100;
  const deductions = salary.deductions !== undefined ? Number(salary.deductions) : (pf + profTax + otherDeduct);

  const gross = basic + allowances;
  const net = salary.netSalary || (gross - deductions);
  const monthly = net;
  const yearly = monthly * 12;

  // Add skill handler
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
    setShowAddSkill(false);
    employeeService.updateProfile(employee.id, { resume: { ...resume, skills: updated } });
    toast.success('Skill added to profile');
  };

  const handleRemoveSkill = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
    employeeService.updateProfile(employee.id, { resume: { ...resume, skills: updated } });
  };

  // Add certification handler
  const handleAddCert = () => {
    if (!newCert.name.trim()) return;
    const updated = [...certs, newCert];
    setCerts(updated);
    setNewCert({ name: '', issuer: '', year: '2024' });
    setShowAddCert(false);
    employeeService.updateProfile(employee.id, { resume: { ...resume, certifications: updated } });
    toast.success('Certification added to profile');
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Required';
    if (!passwordForm.newPassword) errs.newPassword = 'Required';
    if (passwordForm.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordLoading(true);
    try {
      await employeeService.changePassword(employee.id, passwordForm);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (err) {
      toast.error(err.message || 'Unable to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveBasic = async () => {
    try {
      await employeeService.updateProfile(employee.id, basicForm);
      toast.success('Profile details updated!');
      setEditBasicModal(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const passwordStrength = evaluatePasswordStrength(passwordForm.newPassword);

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar src={employee.avatar} name={employee.name} size="xl" status="online" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {employee.name}
                </h2>
                <Badge variant={employee.status} dot size="sm">
                  {employee.status}
                </Badge>
                <Badge variant={employee.role === 'HR' ? 'purple' : 'cyan'} size="sm">
                  {employee.role}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                {employee.designation} · <span className="text-brand-purple dark:text-brand-cyan-light">{employee.department}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">ID:</span> {employee.employeeId || employee.id}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {employee.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {employee.phone || '+1 (555) 000-0000'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(employee.joiningDate)}
                </span>
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditBasicModal(true)}
                leftIcon={Edit3}
              >
                Edit Contact
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-dark-700/80 pb-px overflow-x-auto">
        {[
          { id: 'resume', label: '1. Professional Resume', icon: FileText },
          { id: 'private', label: '2. Private & Bank Info', icon: User },
          { id: 'salary', label: '3. Salary Breakdown', icon: DollarSign },
          { id: 'security', label: '4. Security & Sessions', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'border-brand-purple text-brand-purple dark:text-white bg-brand-purple/5 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: RESUME */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in">
          {/* About Me & What I Love */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Me</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {resume.about || 'Senior specialist committed to high quality engineering and design standards.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What I Love About My Job</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {resume.whatILove || 'Collaborating with cross-functional partners and building scalable, intuitive product flows.'}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Technical & Core Skills</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified proficiencies and competencies</p>
              </div>
              {canEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddSkill(true)}
                  leftIcon={Plus}
                >
                  Add Skill
                </Button>
              )}
            </div>

            {showAddSkill && (
              <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter skill (e.g. System Design, Docker)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-white dark:bg-dark-750 text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-dark-600"
                />
                <Button size="sm" onClick={handleAddSkill}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddSkill(false)}>Cancel</Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/30 text-xs font-bold text-brand-purple dark:text-purple-300"
                >
                  <span>{skill}</span>
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="hover:text-rose-500 ml-1"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Certifications</h3>
                {canEdit && (
                  <button
                    onClick={() => setShowAddCert(true)}
                    className="text-xs text-brand-purple dark:text-brand-purple-light font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>

              {showAddCert && (
                <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 space-y-2">
                  <input
                    placeholder="Cert Name (e.g. AWS Solutions Architect)"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full bg-white dark:bg-dark-750 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-600"
                  />
                  <input
                    placeholder="Issuer (e.g. Amazon Web Services)"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full bg-white dark:bg-dark-750 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-600"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button size="sm" onClick={handleAddCert}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddCert(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {certs.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/50 border border-slate-200/80 dark:border-dark-700/60 flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.issuer} · {c.year}</p>
                    </div>
                    <Badge variant="approved" size="sm">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Education</h3>
              <div className="space-y-3">
                {(resume.education || [
                  { degree: 'B.S. in Computer Science', institution: 'University of California, Berkeley', year: '2015 - 2019' }
                ]).map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/50 border border-slate-200/80 dark:border-dark-700/60">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{edu.institution}</p>
                    <span className="text-[10px] text-brand-purple dark:text-brand-cyan-light font-mono mt-1 block">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Resume Document Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-purple/10 text-brand-purple dark:text-purple-400 border border-brand-purple/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {resume.resumeDoc?.name || 'Alex_Morgan_Official_Resume.pdf'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Size: {resume.resumeDoc?.size || '1.4 MB'} · Uploaded {resume.resumeDoc?.uploadedDate || '2024-01-15'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" leftIcon={Download}>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRIVATE INFO */}
      {activeTab === 'private' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Personal Demographics */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Date of Birth</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{formatDate(employee.dateOfBirth)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Nationality</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{privateInfo.nationality || 'American'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Gender</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{privateInfo.gender || 'Female'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Marital Status</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{privateInfo.maritalStatus || 'Single'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Residential Address</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{employee.address || '742 Evergreen Terrace, Springfield, OR'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Emergency Contact</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {privateInfo.emergencyContact?.name || 'Robert Morgan'} ({privateInfo.emergencyContact?.phone || '+1 555-987-6543'})
                </span>
              </div>
            </div>
          </div>

          {/* Masked Sensitive Bank Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-purple" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Bank & Tax Identification</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple dark:text-brand-purple-light hover:underline"
              >
                {showBankDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showBankDetails ? 'Hide Sensitive Values' : 'Reveal Values'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">Bank Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {privateInfo.bankDetails?.bankName || 'Silicon Valley Bank'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">Account Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {showBankDetails
                    ? (privateInfo.bankDetails?.rawAccountNumber || '4920 8102 8492')
                    : (privateInfo.bankDetails?.accountNumber || '•••• •••• 8492')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">IFSC / Routing Code</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {privateInfo.bankDetails?.ifscCode || 'SVB0002931'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">PAN Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {showBankDetails ? (privateInfo.bankDetails?.panNumber || 'ALXPM8291K') : '••••••291K'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">UAN Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {showBankDetails ? (privateInfo.bankDetails?.uanNumber || '100928374619') : '••••••••4619'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">Employee Code</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {privateInfo.bankDetails?.employeeCode || employee.employeeId || 'DF-ENG-1001'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALARY INFO (READ-ONLY FOR EMPLOYEE) */}
      {activeTab === 'salary' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Wage KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Net Take-Home</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                {formatCurrency(monthly)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Calculated after statutory deductions</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Annual CTC Package</span>
              <span className="text-2xl sm:text-3xl font-black text-brand-purple dark:text-brand-purple-light mt-1 block">
                {formatCurrency(yearly)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">Monthly × 12 months</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gross Earnings</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {formatCurrency(gross)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Basic + Total Allowances</span>
            </div>
          </div>

          {/* Detailed Component Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings / Allowances */}
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark space-y-3 text-xs">
              <h4 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-dark-700/80">
                Salary Allowances & Earnings
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Basic Salary</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(basic)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(hra)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Standard Allowance</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(stdAllow)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Performance Bonus</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(perfBonus)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Leave Travel Allowance (LTA)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(lta)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Fixed Allowance</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(fixedAllow)}</span>
              </div>
              <div className="flex justify-between pt-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <span>Total Gross Salary</span>
                <span className="font-mono">{formatCurrency(gross)}</span>
              </div>
            </div>

            {/* Deductions & Net */}
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark space-y-3 text-xs">
              <h4 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-dark-700/80">
                Statutory Deductions
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Provident Fund (PF)</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(pf)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Professional Tax (PT)</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(profTax)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-750">
                <span className="text-slate-600 dark:text-slate-300">Other Deductions & Insurance</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(otherDeduct)}</span>
              </div>
              <div className="flex justify-between pt-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <span>Total Deductions</span>
                <span className="font-mono">-{formatCurrency(deductions)}</span>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-purple dark:text-brand-purple-light block">Net Monthly Salary</span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">{formatCurrency(net)}</span>
                </div>
                <Badge variant="purple" size="sm">Read-Only View</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Password Change Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">Change Account Password</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Ensure your account uses a strong, unique password.</p>

            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                error={passwordErrors.currentPassword}
                required
              />

              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  error={passwordErrors.newPassword}
                  required
                />
                {passwordForm.newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Password Strength:</span>
                      <span className={passwordStrength.color}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.bg} transition-all duration-300`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                error={passwordErrors.confirmPassword}
                required
              />

              <Button type="submit" variant="primary" loading={passwordLoading}>
                Update Password
              </Button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">Active Login Sessions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Devices currently authenticated with your account credentials.</p>

            <div className="space-y-3">
              {(security.activeSessions || [
                { id: 'sess_1', device: 'Chrome / macOS', ip: '192.168.1.42', location: 'San Francisco, US', isCurrent: true },
                { id: 'sess_2', device: 'Dayflow Mobile / iOS 17', ip: '172.56.21.9', location: 'San Francisco, US', isCurrent: false }
              ]).map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-dark-750 text-slate-600 dark:text-slate-300">
                      {sess.device.includes('Mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{sess.device}</span>
                        {sess.isCurrent && <Badge variant="present" size="sm">Current Session</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        IP: {sess.ip} · {sess.location}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => toast.success('Signed out from device')}
                      className="text-xs font-bold text-rose-500 hover:underline"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Basic Contact Modal */}
      <Modal
        isOpen={editBasicModal}
        onClose={() => setEditBasicModal(false)}
        title="Edit Contact Information"
        subtitle="Update your contact phone and address"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={basicForm.name}
            onChange={(e) => setBasicForm({ ...basicForm, name: e.target.value })}
            required
          />
          <Input
            label="Contact Phone"
            value={basicForm.phone}
            onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
            required
          />
          <Input
            label="Residential Address"
            value={basicForm.address}
            onChange={(e) => setBasicForm({ ...basicForm, address: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditBasicModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveBasic}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeProfileCard;
