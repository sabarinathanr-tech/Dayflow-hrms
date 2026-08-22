import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { Payroll } from '../models/Payroll.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllEmployees = async (req, res, next) => {
  try {
    const { search, department, status } = req.query;
    const filter = {};

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { employeeId: regex },
        { id: regex },
        { email: regex },
        { department: regex },
        { designation: regex }
      ];
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      $or: [{ id }, { employeeId: id }]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const empData = req.body;
    const empId = (empData.employeeId || `EMP-${Date.now().toString().slice(-4)}`).toUpperCase();
    const email = empData.email?.toLowerCase().trim();

    const existing = await Employee.findOne({
      $or: [{ employeeId: empId }, { email }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this Employee ID or Email already exists.',
        code: 'DUPLICATE_EMPLOYEE'
      });
    }

    const basicSalary = Number(empData.salary?.basicSalary) || 45000;
    const allowances = Number(empData.salary?.allowances) || 22000;
    const deductions = Number(empData.salary?.deductions) || 3800;
    const grossSalary = basicSalary + allowances;
    const netSalary = grossSalary - deductions;

    const newEmp = await Employee.create({
      ...empData,
      id: empId,
      employeeId: empId,
      email,
      status: empData.status || 'Active',
      joiningDate: empData.joiningDate || new Date().toISOString().split('T')[0],
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
        effectiveDate: empData.joiningDate || new Date().toISOString().split('T')[0]
      }
    });

    const initialPassword = empData.password || `Dayflow@${empId.replace(/[^A-Za-z0-9]/g, '')}`;

    // Create user login credentials if not existing
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({
        employeeId: empId,
        name: empData.name,
        email,
        password: initialPassword,
        role: empData.role || 'Employee',
        isVerified: true
      });
    }

    // Create initial Payroll master
    await Payroll.create({
      employeeId: empId,
      employeeName: empData.name,
      department: empData.department || 'Engineering',
      designation: empData.designation || 'Software Engineer',
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
      effectiveDate: empData.joiningDate || new Date().toISOString().split('T')[0],
      history: [
        { month: 'August 2026', gross: grossSalary, deductions, net: netSalary, status: 'Paid', date: '2026-08-01' }
      ]
    });

    await logAudit({
      actorId: req.user?.employeeId || 'HR-ADMIN',
      actorName: req.user?.name || 'HR Administrator',
      actorRole: req.user?.role || 'HR',
      action: 'EMPLOYEE_CREATE',
      entity: 'Employee',
      entityId: empId,
      metadata: { name: empData.name, email, department: empData.department },
      req
    });

    res.status(201).json({
      success: true,
      message: 'Employee record created successfully.',
      data: {
        employee: newEmp,
        credentials: {
          employeeId: empId,
          name: empData.name,
          email,
          password: initialPassword,
          role: empData.role || 'Employee'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findOneAndUpdate(
      { $or: [{ id }, { employeeId: id }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    if (updateData.name) {
      await User.findOneAndUpdate(
        { employeeId: employee.employeeId },
        { name: updateData.name }
      );
    }

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'EMPLOYEE_UPDATE',
      entity: 'Employee',
      entityId: employee.employeeId,
      metadata: updateData,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, address, avatar, name, resume, privateInfo } = req.body;

    const employee = await Employee.findOne({
      $or: [{ id }, { employeeId: id }]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found.',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;
    if (avatar !== undefined) employee.avatar = avatar;
    if (name !== undefined) {
      employee.name = name;
      await User.findOneAndUpdate({ employeeId: employee.employeeId }, { name });
    }
    if (resume) {
      employee.resume = { ...employee.resume?.toObject(), ...resume };
    }
    if (privateInfo) {
      employee.privateInfo = { ...employee.privateInfo?.toObject(), ...privateInfo };
    }

    await employee.save();

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'PROFILE_UPDATE',
      entity: 'Employee',
      entityId: employee.employeeId,
      metadata: { phone, address, name },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a file to upload.',
        code: 'NO_FILE'
      });
    }

    const employee = await Employee.findOne({
      $or: [{ id }, { employeeId: id }]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    const resumeDoc = {
      name: req.file.originalname,
      size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      url: `/uploads/${req.file.filename}`,
      uploadedDate: new Date().toISOString().split('T')[0]
    };

    if (!employee.resume) employee.resume = {};
    employee.resume.resumeDoc = resumeDoc;

    if (!employee.documents) employee.documents = [];
    employee.documents.unshift({
      name: req.file.originalname,
      type: 'Resume / CV',
      size: resumeDoc.size,
      url: resumeDoc.url,
      uploadedDate: resumeDoc.uploadedDate
    });

    await employee.save();

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'RESUME_UPLOAD',
      entity: 'Employee',
      entityId: employee.employeeId,
      metadata: resumeDoc,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Resume document uploaded and attached to profile.',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
        code: 'INVALID_PASSWORD'
      });
    }

    const user = await User.findOne({
      $or: [{ employeeId: id }, { _id: id }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match.',
          code: 'PASSWORD_MISMATCH'
        });
      }
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'SECURITY_PASSWORD_CHANGE',
      entity: 'User',
      entityId: user.employeeId,
      metadata: { status: 'SUCCESS' },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findOneAndDelete({
      $or: [{ id }, { employeeId: id }]
    });

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        code: 'NOT_FOUND'
      });
    }

    await User.findOneAndDelete({ employeeId: emp.employeeId });

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'EMPLOYEE_DELETE',
      entity: 'Employee',
      entityId: emp.employeeId,
      metadata: { name: emp.name },
      req
    });

    res.status(200).json({
      success: true,
      message: `Employee ${emp.name} removed successfully.`
    });
  } catch (error) {
    next(error);
  }
};
