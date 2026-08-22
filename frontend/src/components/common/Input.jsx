import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon: LeftIcon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-dark-800/90 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl px-4 py-2.5 transition-all duration-200 border ${
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-dark-600 hover:border-dark-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
          } ${LeftIcon ? 'pl-10' : ''} ${isPassword ? 'pr-11' : ''} disabled:opacity-50 disabled:bg-dark-850 disabled:cursor-not-allowed`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 focus:outline-none p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-400 font-medium animate-in fade-in">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
