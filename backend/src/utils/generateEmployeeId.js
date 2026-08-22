import { User } from '../models/User.js';

export const generateEmployeeId = async (role = 'Employee') => {
  const prefix = role === 'HR' || role === 'Admin' ? 'HR' : 'EMP';
  const count = await User.countDocuments({ role });
  const nextNum = 1000 + count + 1;
  return `${prefix}-${nextNum}`;
};
