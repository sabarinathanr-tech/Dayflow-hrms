export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before role check.',
        code: 'UNAUTHENTICATED'
      });
    }

    const normalizedUserRole = req.user.role?.toUpperCase();
    const allowedRoles = roles.map((r) => r.toUpperCase());

    // Admin has access to all HR roles as well
    if (allowedRoles.includes(normalizedUserRole) || (allowedRoles.includes('HR') && normalizedUserRole === 'ADMIN')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of [${roles.join(', ')}] permissions.`,
      code: 'FORBIDDEN'
    });
  };
};

export const requireHR = requireRole('HR', 'Admin');
export const requireEmployee = requireRole('Employee', 'HR', 'Admin');
