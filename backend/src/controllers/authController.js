import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Payroll } from '../models/Payroll.js';
import { generateToken } from '../utils/generateToken.js';
import { sendVerificationOTP, sendPasswordResetEmail } from '../services/emailService.js';

export const register = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role = 'Employee' } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, Full Name, Email, and Password are all required.',
        code: 'MISSING_FIELDS'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedEmpId = employeeId.toUpperCase().trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        code: 'EMAIL_EXISTS'
      });
    }

    const existingEmpId = await User.findOne({ employeeId: normalizedEmpId });
    if (existingEmpId) {
      return res.status(409).json({
        success: false,
        message: 'An account with this Employee ID already exists.',
        code: 'EMPLOYEE_ID_EXISTS'
      });
    }

    // 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const userRole = role === 'HR' || role === 'Admin' ? 'HR' : 'Employee';

    console.log(`[AUTH] Registering ${normalizedEmail} (${normalizedEmpId}) as ${userRole}`);
    console.log(`[AUTH] Generated Verification OTP: ${verificationCode} (Expires: 15 mins)`);

    const user = await User.create({
      employeeId: normalizedEmpId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: userRole,
      isVerified: false,
      verificationToken: verificationCode,
      verificationTokenExpires: verificationExpires
    });

    // Create corresponding Employee record in INR
    const department = userRole === 'HR' ? 'Human Resources' : 'Engineering';
    const designation = userRole === 'HR' ? 'HR Specialist' : 'Software Engineer';
    const defaultAvatar = `https://images.unsplash.com/photo-${userRole === 'HR' ? '1573496359142-b8d87734a5a2' : '1539571696357-5a69c17a67c6'}?w=150&auto=format&fit=crop&q=80`;

    const basicSalary = userRole === 'HR' ? 50000 : 45000;
    const allowances = userRole === 'HR' ? 25000 : 22000;
    const deductions = userRole === 'HR' ? 4200 : 3800;
    const grossSalary = basicSalary + allowances;
    const netSalary = grossSalary - deductions;

    const employee = await Employee.create({
      id: normalizedEmpId,
      employeeId: normalizedEmpId,
      name: name.trim(),
      email: normalizedEmail,
      role: userRole,
      designation,
      department,
      status: 'Active',
      avatar: defaultAvatar,
      security: {
        emailVerified: false,
        lastLogin: new Date().toISOString(),
        activeSessions: 1
      },
      resume: {
        about: `${name.trim()} joined Dayflow ${department} department.`,
        whatILove: 'Solving interesting problems with great teammates.',
        skills: ['Team Collaboration', 'Problem Solving', 'Communication'],
        certifications: [],
        education: [],
        experience: []
      },
      privateInfo: {
        nationality: 'Indian',
        gender: 'Prefer not to say',
        maritalStatus: 'Single',
        personalEmail: normalizedEmail,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        emergencyContact: {
          name: 'Emergency Contact',
          relation: 'Family',
          phone: '+91 98765 00000'
        },
        bankDetails: {
          accountNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0001928',
          panNumber: 'DFPAN' + Math.floor(1000 + Math.random() * 9000) + 'K',
          uanNumber: '100' + Date.now().toString().slice(-9),
          employeeCode: normalizedEmpId
        }
      },
      salary: {
        basicSalary,
        hra: Math.round(basicSalary * 0.4),
        standardAllowance: 5000,
        performanceBonus: 3000,
        lta: 2500,
        fixedAllowance: 1500,
        allowances,
        pfDeduction: Math.round(basicSalary * 0.12),
        professionalTax: 200,
        otherDeductions: 500,
        deductions,
        grossSalary,
        netSalary,
        monthlyWage: netSalary,
        yearlyWage: netSalary * 12,
        currency: 'INR',
        effectiveDate: new Date().toISOString().split('T')[0]
      }
    });

    // Create initial Payroll master record
    await Payroll.create({
      employeeId: normalizedEmpId,
      employeeName: name.trim(),
      department,
      designation,
      basicSalary,
      hra: Math.round(basicSalary * 0.4),
      standardAllowance: 5000,
      performanceBonus: 3000,
      lta: 2500,
      fixedAllowance: 1500,
      allowances,
      pfDeduction: Math.round(basicSalary * 0.12),
      professionalTax: 200,
      otherDeductions: 500,
      deductions,
      grossSalary,
      netSalary,
      monthlyWage: netSalary,
      yearlyWage: netSalary * 12,
      currency: 'INR',
      effectiveDate: new Date().toISOString().split('T')[0],
      history: [
        { month: 'August 2026', gross: grossSalary, deductions, net: netSalary, status: 'Paid', date: '2026-08-01' }
      ]
    });

    // Dispatch verification email
    sendVerificationOTP(normalizedEmail, name.trim(), verificationCode).catch((err) => {
      console.error('[Dayflow Email] Failed to send registration OTP email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Please verify your email with the OTP code.',
      data: {
        email: normalizedEmail,
        employeeId: normalizedEmpId,
        code: verificationCode
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code, token } = req.body;
    const otp = code || token;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required.',
        code: 'MISSING_VERIFICATION_DATA'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found for this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email has already been verified. You can sign in directly.',
        data: { isVerified: true }
      });
    }

    // Accept actual token or standard dev test OTP 123456
    const isMatching = user.verificationToken === otp.toString().trim() || otp === '123456';
    if (!isMatching) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please check or request a new code.',
        code: 'INVALID_CODE'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await Employee.findOneAndUpdate(
      { email: normalizedEmail },
      { 'security.emailVerified': true }
    );

    console.log(`[AUTH] Email verified successfully for ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in to Dayflow.',
      data: { isVerified: true }
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Work email is required to resend verification code.',
        code: 'MISSING_EMAIL'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Account is already verified. You can sign in directly.',
        data: { isVerified: true }
      });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = newCode;
    user.verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    console.log(`[AUTH] Resent fresh Verification OTP for ${normalizedEmail}: ${newCode}`);

    // Dispatch fresh verification code via email
    sendVerificationOTP(normalizedEmail, user.name, newCode).catch((err) => {
      console.error('[Dayflow Email] Failed to send resend OTP email:', err);
    });

    res.status(200).json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
      data: { code: newCode }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, loginId, employeeId, password } = req.body;
    const identifier = (loginId || email || employeeId || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login ID or Email and password are required.',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escapedIdentifier}$`, 'i');

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { employeeId: identifier.toUpperCase() },
        { email: regex },
        { employeeId: regex }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. No user found for "${identifier}".`,
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your work email before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
        data: { email: user.email }
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role
    });

    const employee = await Employee.findOne({ employeeId: user.employeeId });

    if (employee) {
      employee.security.lastLogin = new Date().toISOString();
      employee.security.activeSessions = (employee.security.activeSessions || 0) + 1;
      await employee.save();
    }

    res.status(200).json({
      success: true,
      message: 'Signed in successfully!',
      data: {
        token,
        user: {
          id: user.employeeId,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: employee?.avatar,
          isVerified: user.isVerified
        },
        employee
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
        code: 'MISSING_EMAIL'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password recovery code has been sent.'
      });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hr
    await user.save();

    console.log(`[AUTH] Password Reset Code generated for ${normalizedEmail}: ${resetToken}`);

    sendPasswordResetEmail(normalizedEmail, user.name, null, resetToken).catch((err) => {
      console.error('[Dayflow Email] Failed to send password reset email:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Password reset code has been dispatched.',
      data: { code: resetToken }
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset token, and new password are required.',
        code: 'MISSING_DATA'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: token.toString().trim(),
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
        code: 'INVALID_RESET_TOKEN'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been updated successfully. Please log in.'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        code: 'NOT_FOUND'
      });
    }

    const employee = await Employee.findOne({ employeeId: user.employeeId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.employeeId,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: employee?.avatar,
          isVerified: user.isVerified
        },
        employee
      }
    });
  } catch (error) {
    next(error);
  }
};
