import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle2, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false,
  children
}) => {
  const iconConfig = {
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    danger: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    info: { icon: Info, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' }
  }[type] || { icon: HelpCircle, color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' };

  const IconComponent = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!loading}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${iconConfig.bg} ${iconConfig.color}`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{message}</p>

        {children && <div className="w-full mb-6 text-left">{children}</div>}

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : type === 'info' ? 'cyan' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
