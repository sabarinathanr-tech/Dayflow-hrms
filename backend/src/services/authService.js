import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

/**
 * Generates a cryptographically strong 6-digit numeric OTP code
 */
export const generateVerificationOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generates a random alphanumeric token for secure reset links
 */
export const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hashes a plain password using bcrypt
 */
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compares a plain password with a stored hash
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Builds standard sanitized session payload for client responses
 */
export const buildAuthSessionResponse = (user, employee = null) => {
  const token = generateToken(user._id || user.id);

  return {
    token,
    user: {
      id: user._id || user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified ?? true,
      avatar: employee?.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      designation: employee?.designation || (user.role === 'HR' ? 'HR Manager' : 'Software Engineer'),
      department: employee?.department || (user.role === 'HR' ? 'Human Resources' : 'Engineering')
    }
  };
};

export default {
  generateVerificationOTP,
  generateSecureToken,
  hashPassword,
  comparePassword,
  buildAuthSessionResponse
};
