import React, { useState } from 'react';

const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-14 h-14 text-sm font-extrabold',
    xl: 'w-20 h-20 text-lg font-black'
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    away: 'bg-amber-500',
    leave: 'bg-purple-500'
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-brand-purple to-brand-magenta text-white font-bold shadow-sm border border-white/20`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-dark-900 ${
            statusColors[status] || 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
