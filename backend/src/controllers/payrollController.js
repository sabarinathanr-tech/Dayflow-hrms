import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { Notification } from '../models/Notification.js';
import { logAudit } from '../utils/auditLogger.js';

export const getMyPayroll = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const emp = await Employee.findOne({ employeeId });
    let payroll = await Payroll.findOne({ employeeId });

    if (!payroll && emp) {
      const basic = emp.salary?.basicSalary || 4500;
      const allow = emp.salary?.allowances || 3200;
      const ded = emp.salary?.deductions || 600;
      const net = basic + allow - ded;

      payroll = await Payroll.create({
        employeeId,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        basicSalary: basic,
        allowances: allow,
        deductions: ded,
        grossSalary: basic + allow,
        netSalary: net,
        monthlyWage: net,
        yearlyWage: net * 12,
        currency: 'USD',
        effectiveDate: emp.joiningDate,
        history: [
          { month: 'August 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-08-01' },
          { month: 'July 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-07-01' },
          { month: 'June 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-06-01' }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: {
        employeeId: emp?.employeeId || employeeId,
        employeeName: emp?.name || req.user.name,
        department: emp?.department || 'Engineering',
        designation: emp?.designation || 'Software Engineer',
        joiningDate: emp?.joiningDate || '2026-01-01',
        salary: {
          basicSalary: payroll.basicSalary,
          hra: payroll.hra || Math.round(payroll.basicSalary * 0.4),
          standardAllowance: payroll.standardAllowance || 500,
          performanceBonus: payroll.performanceBonus || 400,
          lta: payroll.lta || 300,
          fixedAllowance: payroll.fixedAllowance || 200,
          allowances: payroll.allowances,
          pfDeduction: payroll.pfDeduction || 350,
          professionalTax: payroll.professionalTax || 150,
          otherDeductions: payroll.otherDeductions || 100,
          deductions: payroll.deductions,
          grossSalary: payroll.grossSalary,
          netSalary: payroll.netSalary,
          monthlyWage: payroll.monthlyWage,
          yearlyWage: payroll.yearlyWage,
          currency: payroll.currency || 'USD',
          effectiveDate: payroll.effectiveDate
        },
        history: payroll.history || []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeePayroll = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const emp = await Employee.findOne({
      $or: [{ employeeId }, { id: employeeId }]
    });

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
        code: 'EMPLOYEE_NOT_FOUND'
      });
    }

    let payroll = await Payroll.findOne({ employeeId: emp.employeeId });
    if (!payroll) {
      const basic = emp.salary?.basicSalary || 4500;
      const allow = emp.salary?.allowances || 3200;
      const ded = emp.salary?.deductions || 600;
      const net = basic + allow - ded;

      payroll = await Payroll.create({
        employeeId: emp.employeeId,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        basicSalary: basic,
        allowances: allow,
        deductions: ded,
        grossSalary: basic + allow,
        netSalary: net,
        monthlyWage: net,
        yearlyWage: net * 12,
        currency: 'USD',
        effectiveDate: emp.joiningDate,
        history: [
          { month: 'August 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-08-01' },
          { month: 'July 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-07-01' },
          { month: 'June 2026', gross: basic + allow, deductions: ded, net, status: 'Paid', date: '2026-06-01' }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: {
        employeeId: emp.employeeId,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        salary: {
          basicSalary: payroll.basicSalary,
          hra: payroll.hra || Math.round(payroll.basicSalary * 0.4),
          standardAllowance: payroll.standardAllowance || 500,
          performanceBonus: payroll.performanceBonus || 400,
          lta: payroll.lta || 300,
          fixedAllowance: payroll.fixedAllowance || 200,
          allowances: payroll.allowances,
          pfDeduction: payroll.pfDeduction || 350,
          professionalTax: payroll.professionalTax || 150,
          otherDeductions: payroll.otherDeductions || 100,
          deductions: payroll.deductions,
          grossSalary: payroll.grossSalary,
          netSalary: payroll.netSalary,
          monthlyWage: payroll.monthlyWage,
          yearlyWage: payroll.yearlyWage,
          currency: payroll.currency || 'USD',
          effectiveDate: payroll.effectiveDate
        },
        history: payroll.history || []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    const employees = await Employee.find();
    const empMap = {};
    employees.forEach((e) => {
      empMap[e.employeeId] = e;
    });

    const list = payrolls.map((p) => {
      const emp = empMap[p.employeeId];
      return {
        id: p.employeeId,
        employeeId: p.employeeId,
        employeeName: p.employeeName || emp?.name || 'Employee',
        department: p.department || emp?.department || 'Engineering',
        designation: p.designation || emp?.designation || 'Software Engineer',
        avatar: emp?.avatar,
        basicSalary: p.basicSalary,
        hra: p.hra || Math.round(p.basicSalary * 0.4),
        standardAllowance: p.standardAllowance || 500,
        performanceBonus: p.performanceBonus || 400,
        lta: p.lta || 300,
        fixedAllowance: p.fixedAllowance || 200,
        allowances: p.allowances,
        pfDeduction: p.pfDeduction || 350,
        professionalTax: p.professionalTax || 150,
        otherDeductions: p.otherDeductions || 100,
        deductions: p.deductions,
        grossSalary: p.grossSalary,
        netSalary: p.netSalary,
        monthlyWage: p.monthlyWage,
        yearlyWage: p.yearlyWage,
        currency: p.currency || 'USD',
        lastUpdated: p.effectiveDate
      };
    });

    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

export const updateSalaryStructure = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const salaryData = req.body;

    const basic = Number(salaryData.basicSalary) || 0;
    const hra = Number(salaryData.hra) || Math.round(basic * 0.4);
    const stdAllow = Number(salaryData.standardAllowance) || 0;
    const perfBonus = Number(salaryData.performanceBonus) || 0;
    const lta = Number(salaryData.lta) || 0;
    const fixedAllow = Number(salaryData.fixedAllowance) || 0;
    const allowances = salaryData.allowances !== undefined ? Number(salaryData.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

    const pf = Number(salaryData.pfDeduction) || 0;
    const profTax = Number(salaryData.professionalTax) || 0;
    const otherDeduct = Number(salaryData.otherDeductions) || 0;
    const deductions = salaryData.deductions !== undefined ? Number(salaryData.deductions) : (pf + profTax + otherDeduct);

    const gross = basic + allowances;
    const net = gross - deductions;
    const monthly = net;
    const yearly = monthly * 12;
    const todayStr = new Date().toISOString().split('T')[0];

    const structured = {
      basicSalary: basic,
      hra,
      standardAllowance: stdAllow,
      performanceBonus: perfBonus,
      lta,
      fixedAllowance: fixedAllow,
      allowances,
      pfDeduction: pf,
      professionalTax: profTax,
      otherDeductions: otherDeduct,
      deductions,
      grossSalary: gross,
      netSalary: net,
      monthlyWage: monthly,
      yearlyWage: yearly,
      currency: salaryData.currency || 'USD',
      effectiveDate: todayStr
    };

    const payroll = await Payroll.findOneAndUpdate(
      { employeeId },
      { $set: structured },
      { upsert: true, new: true }
    );

    await Employee.findOneAndUpdate(
      { employeeId },
      { $set: { salary: structured } }
    );

    await Notification.create({
      userId: employeeId,
      title: 'Salary Structure Updated',
      message: `Your revised salary structure has been updated by HR. Effective date: ${todayStr}`,
      type: 'info',
      timestamp: new Date().toISOString()
    });

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'SALARY_UPDATE',
      entity: 'Payroll',
      entityId: employeeId,
      metadata: { basicSalary: basic, grossSalary: gross, netSalary: net },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Salary structure updated successfully.',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};
