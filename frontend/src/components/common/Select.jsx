import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none bg-dark-800/90 text-slate-100 text-sm rounded-xl px-4 py-2.5 pr-10 transition-all duration-200 border cursor-pointer ${
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-dark-600 hover:border-dark-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        >
          {placeholder && <option value="" disabled className="bg-dark-800 text-slate-500">{placeholder}</option>}
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={idx} value={val} className="bg-dark-850 text-slate-200 py-1">
                {labelText}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-400 font-medium animate-in fade-in">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
