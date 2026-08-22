import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';
import { Notification } from '../models/Notification.js';
import { config } from '../config/env.js';

export const seedDatabase = async (force = false) => {
  try {
    if (force || process.argv.includes('--reset')) {
      console.log('[Dayflow DB] Resetting collections for fresh enterprise seed...');
      await Promise.all([
        User.deleteMany({}),
        Employee.deleteMany({}),
        Attendance.deleteMany({}),
        LeaveRequest.deleteMany({}),
        Payroll.deleteMany({}),
        Notification.deleteMany({})
      ]);
    } else {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log(`[Dayflow DB] Database already contains ${userCount} users. Skipping initial seed.`);
        return;
      }
    }

    console.log('[Dayflow DB] Seeding initial enterprise dataset in INR with realistic Indian workforce...');

    const employeesSeed = [
      {
        id: 'HR-001',
        employeeId: 'HR-001',
        name: 'Sarah Jenkins',
        email: 'hr@dayflow.io',
        role: 'HR',
        designation: 'Director of Human Resources',
        department: 'Human Resources',
        status: 'Active',
        joiningDate: '2022-03-15',
        dateOfBirth: '1988-04-12',
        phone: '+91 98765 43210',
        address: '100 Innovation Park, Whitefield, Bengaluru, KA 560066',
        manager: 'Board of Directors',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Experienced HR executive with 12+ years leading people operations, talent strategy, and organizational development.',
          whatILove: 'Fostering inclusive workplace culture and crafting scalable people operations.',
          skills: ['Talent Strategy', 'People Analytics', 'Compensation & Benefits', 'Conflict Resolution'],
          certifications: [
            { name: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM', year: '2021' },
            { name: 'Certified Compensation Professional (CCP)', issuer: 'WorldatWork', year: '2019' }
          ],
          education: [
            { degree: 'MBA in Human Resource Management', school: 'IIM Bangalore', year: '2014' },
            { degree: 'B.A. in Psychology', school: 'Christ University', year: '2010' }
          ],
          experience: [
            { role: 'Head of People Operations', company: 'Apex Global Technologies', duration: '2018 - 2022' },
            { role: 'Senior HR Business Partner', company: 'Vanguard Systems', duration: '2014 - 2018' }
          ]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Female',
          maritalStatus: 'Married',
          personalEmail: 'sarah.jenkins.personal@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'David Jenkins', relation: 'Spouse', phone: '+91 98765 43219' },
          bankDetails: {
            accountNumber: '•••• •••• 9812',
            bankName: 'HDFC Bank',
            ifscCode: 'HDFC0001099',
            panNumber: 'HRADM9812K',
            uanNumber: '100882736451',
            employeeCode: 'DF-HR-001'
          }
        },
        salary: {
          basicSalary: 75000,
          hra: 30000,
          standardAllowance: 10000,
          performanceBonus: 8000,
          lta: 4000,
          fixedAllowance: 3000,
          allowances: 55000,
          pfDeduction: 9000,
          professionalTax: 200,
          otherDeductions: 800,
          deductions: 10000,
          grossSalary: 130000,
          netSalary: 120000,
          monthlyWage: 120000,
          yearlyWage: 1440000,
          currency: 'INR',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T08:30:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 20, sickLeave: 12, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1001',
        employeeId: 'EMP-1001',
        name: 'Arjun Kumar',
        email: 'employee@dayflow.io',
        role: 'Employee',
        designation: 'Lead Frontend Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: '2023-01-10',
        dateOfBirth: '1994-08-22',
        phone: '+91 98450 12345',
        address: '42 MG Road, Indiranagar, Bengaluru, KA 560038',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Lead Frontend Engineer with 7+ years crafting scalable web applications, design systems, and responsive architectures in React, TypeScript, and Tailwind.',
          whatILove: 'Building intuitive user interfaces, improving web performance, and mentoring junior engineers.',
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'Vite', 'GraphQL', 'Jest / Cypress'],
          certifications: [
            { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
            { name: 'Meta Certified Front-End Developer', issuer: 'Meta', year: '2022' }
          ],
          education: [
            { degree: 'B.Tech in Computer Science', school: 'NIT Karnataka', year: '2017' }
          ],
          experience: [
            { role: 'Senior Frontend Developer', company: 'CloudFlow Inc.', duration: '2020 - 2023' },
            { role: 'Frontend Engineer', company: 'PixelCraft Studios', duration: '2017 - 2020' }
          ]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Male',
          maritalStatus: 'Single',
          personalEmail: 'arjun.kumar.dev@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Ramesh Kumar', relation: 'Father', phone: '+91 98450 99887' },
          bankDetails: {
            accountNumber: '•••• •••• 4829',
            bankName: 'State Bank of India',
            ifscCode: 'SBIN0001892',
            panNumber: 'ABCDE1234F',
            uanNumber: '100928374651',
            employeeCode: 'DF-EMP-1001'
          }
        },
        salary: {
          basicSalary: 48000,
          hra: 19200,
          standardAllowance: 5000,
          performanceBonus: 4000,
          lta: 2500,
          fixedAllowance: 1300,
          allowances: 32000,
          pfDeduction: 5760,
          professionalTax: 200,
          otherDeductions: 540,
          deductions: 6500,
          grossSalary: 80000,
          netSalary: 73500,
          monthlyWage: 73500,
          yearlyWage: 882000,
          currency: 'INR',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T09:00:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1002',
        employeeId: 'EMP-1002',
        name: 'Priya Sharma',
        email: 'priya.sharma@dayflow.io',
        role: 'Employee',
        designation: 'Senior Product Designer',
        department: 'Product Design',
        status: 'Active',
        joiningDate: '2023-04-18',
        dateOfBirth: '1995-11-03',
        phone: '+91 97110 56789',
        address: '15 Koramangala 4th Block, Bengaluru, KA 560034',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Senior Product Designer crafting design systems, user journeys, and micro-interactions.',
          whatILove: 'User research, design tokens, and building accessible product experiences.',
          skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Accessibility (WCAG)'],
          certifications: [{ name: 'Nielsen Norman Group UX Master Certified', issuer: 'NN/g', year: '2022' }],
          education: [{ degree: 'B.Des in Interaction Design', school: 'National Institute of Design', year: '2018' }],
          experience: [{ role: 'Product Designer', company: 'FinTech Dynamics', duration: '2019 - 2023' }]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Female',
          maritalStatus: 'Single',
          personalEmail: 'priya.sharma.ux@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Raj Sharma', relation: 'Father', phone: '+91 97110 99887' },
          bankDetails: {
            accountNumber: '•••• •••• 6194',
            bankName: 'ICICI Bank',
            ifscCode: 'ICIC0002104',
            panNumber: 'PSHARM5678G',
            uanNumber: '100492837192',
            employeeCode: 'DF-EMP-1002'
          }
        },
        salary: {
          basicSalary: 42000,
          hra: 16800,
          standardAllowance: 4000,
          performanceBonus: 3000,
          lta: 2200,
          fixedAllowance: 2000,
          allowances: 28000,
          pfDeduction: 5040,
          professionalTax: 200,
          otherDeductions: 760,
          deductions: 6000,
          grossSalary: 70000,
          netSalary: 64000,
          monthlyWage: 64000,
          yearlyWage: 768000,
          currency: 'INR',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-21T14:20:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 12, sickLeave: 6, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1003',
        employeeId: 'EMP-1003',
        name: 'Rahul Nair',
        email: 'rahul.nair@dayflow.io',
        role: 'Employee',
        designation: 'Senior Backend Systems Lead',
        department: 'Engineering',
        status: 'Active',
        joiningDate: '2023-08-01',
        dateOfBirth: '1992-03-29',
        phone: '+91 99001 23456',
        address: '88 HSR Layout Sector 2, Bengaluru, KA 560102',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Specialist in distributed backend systems, Node.js, Go, microservices, and database tuning.',
          whatILove: 'Optimizing high-throughput query performance and API reliability.',
          skills: ['Node.js', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
          certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2023' }],
          education: [{ degree: 'B.Tech in Computer Science', school: 'IIT Madras', year: '2015' }],
          experience: [{ role: 'Backend Systems Engineer', company: 'Starlight Scale Inc.', duration: '2018 - 2023' }]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Male',
          maritalStatus: 'Married',
          personalEmail: 'rahul.nair.backend@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Ananya Nair', relation: 'Spouse', phone: '+91 99001 99887' },
          bankDetails: {
            accountNumber: '•••• •••• 8271',
            bankName: 'Axis Bank',
            ifscCode: 'UTIB0009821',
            panNumber: 'RNAIR9012H',
            uanNumber: '100789234512',
            employeeCode: 'DF-EMP-1003'
          }
        },
        salary: {
          basicSalary: 55000,
          hra: 22000,
          standardAllowance: 5000,
          performanceBonus: 4500,
          lta: 2500,
          fixedAllowance: 1000,
          allowances: 35000,
          pfDeduction: 6600,
          professionalTax: 200,
          otherDeductions: 700,
          deductions: 7500,
          grossSalary: 90000,
          netSalary: 82500,
          monthlyWage: 82500,
          yearlyWage: 990000,
          currency: 'INR',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T08:15:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 16, sickLeave: 9, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1004',
        employeeId: 'EMP-1004',
        name: 'Sneha Krishnan',
        email: 'sneha.krishnan@dayflow.io',
        role: 'Employee',
        designation: 'Operations Lead',
        department: 'Operations',
        status: 'Active',
        joiningDate: '2024-02-01',
        dateOfBirth: '1996-09-14',
        phone: '+91 98200 34567',
        address: '50 JP Nagar Phase 3, Bengaluru, KA 560078',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Operations Lead streamlining cross-functional vendor management, facility infrastructure, and process efficiency.',
          whatILove: 'Driving operational excellence and reducing procedural bottlenecks.',
          skills: ['Process Optimization', 'Vendor Relations', 'Project Management', 'Compliance', 'Budgeting'],
          certifications: [{ name: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2024' }],
          education: [{ degree: 'B.Com in Business Management', school: 'St. Xavier’s College', year: '2018' }],
          experience: [{ role: 'Operations Specialist', company: 'Metropolis Logistics', duration: '2020 - 2024' }]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Female',
          maritalStatus: 'Single',
          personalEmail: 'sneha.krishnan.ops@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Gopal Krishnan', relation: 'Father', phone: '+91 98200 99887' },
          bankDetails: {
            accountNumber: '•••• •••• 3418',
            bankName: 'Kotak Mahindra Bank',
            ifscCode: 'KKBK0004319',
            panNumber: 'SKRSH3418J',
            uanNumber: '100612984532',
            employeeCode: 'DF-EMP-1004'
          }
        },
        salary: {
          basicSalary: 36000,
          hra: 14400,
          standardAllowance: 4000,
          performanceBonus: 2600,
          lta: 1800,
          fixedAllowance: 1200,
          allowances: 24000,
          pfDeduction: 4320,
          professionalTax: 200,
          otherDeductions: 480,
          deductions: 5000,
          grossSalary: 60000,
          netSalary: 55000,
          monthlyWage: 55000,
          yearlyWage: 660000,
          currency: 'INR',
          effectiveDate: '2026-02-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-20T17:45:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 11, sickLeave: 7, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1005',
        employeeId: 'EMP-1005',
        name: 'Karthik Raj',
        email: 'karthik.raj@dayflow.io',
        role: 'Employee',
        designation: 'Growth Marketing Specialist',
        department: 'Marketing',
        status: 'Active',
        joiningDate: '2024-05-15',
        dateOfBirth: '1997-12-08',
        phone: '+91 97400 67890',
        address: '24 Richmond Town, Bengaluru, KA 560025',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Growth marketer specializing in demand generation, inbound funnel optimization, and lifecycle campaigns.',
          whatILove: 'Analyzing campaign performance data and experimenting with novel acquisition channels.',
          skills: ['SEO / SEM', 'Google Analytics 4', 'Lifecycle Marketing', 'HubSpot', 'Content Strategy'],
          certifications: [{ name: 'Google Ads & Analytics Certified Professional', issuer: 'Google', year: '2024' }],
          education: [{ degree: 'BBA in Marketing', school: 'Symbiosis International University', year: '2019' }],
          experience: [{ role: 'Digital Marketer', company: 'Cascade Media Group', duration: '2021 - 2024' }]
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Male',
          maritalStatus: 'Single',
          personalEmail: 'karthik.raj.growth@gmail.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Kavitha Raj', relation: 'Mother', phone: '+91 97400 99887' },
          bankDetails: {
            accountNumber: '•••• •••• 7521',
            bankName: 'HDFC Bank',
            ifscCode: 'HDFC0007812',
            panNumber: 'KRAJ7521L',
            uanNumber: '100523891047',
            employeeCode: 'DF-EMP-1005'
          }
        },
        salary: {
          basicSalary: 32000,
          hra: 12800,
          standardAllowance: 3500,
          performanceBonus: 2200,
          lta: 1500,
          fixedAllowance: 1000,
          allowances: 21000,
          pfDeduction: 3840,
          professionalTax: 200,
          otherDeductions: 460,
          deductions: 4500,
          grossSalary: 53000,
          netSalary: 48500,
          monthlyWage: 48500,
          yearlyWage: 582000,
          currency: 'INR',
          effectiveDate: '2026-05-15'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T09:10:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 9, sickLeave: 5, unpaidLeave: 0 }
      }
    ];

    // 1. Insert Users & Employees
    for (const emp of employeesSeed) {
      await User.create({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        password: 'password123',
        role: emp.role,
        isVerified: true
      });

      await Employee.create(emp);

      // Create Payroll master
      await Payroll.create({
        employeeId: emp.employeeId,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        basicSalary: emp.salary.basicSalary,
        hra: emp.salary.hra,
        standardAllowance: emp.salary.standardAllowance,
        performanceBonus: emp.salary.performanceBonus,
        lta: emp.salary.lta,
        fixedAllowance: emp.salary.fixedAllowance,
        allowances: emp.salary.allowances,
        pfDeduction: emp.salary.pfDeduction,
        professionalTax: emp.salary.professionalTax,
        otherDeductions: emp.salary.otherDeductions,
        deductions: emp.salary.deductions,
        grossSalary: emp.salary.grossSalary,
        netSalary: emp.salary.netSalary,
        monthlyWage: emp.salary.monthlyWage,
        yearlyWage: emp.salary.yearlyWage,
        currency: emp.salary.currency,
        effectiveDate: emp.salary.effectiveDate,
        history: [
          { month: 'August 2026', gross: emp.salary.grossSalary, deductions: emp.salary.deductions, net: emp.salary.netSalary, status: 'Paid', date: '2026-08-01' },
          { month: 'July 2026', gross: emp.salary.grossSalary, deductions: emp.salary.deductions, net: emp.salary.netSalary, status: 'Paid', date: '2026-07-01' },
          { month: 'June 2026', gross: emp.salary.grossSalary, deductions: emp.salary.deductions, net: emp.salary.netSalary, status: 'Paid', date: '2026-06-01' }
        ]
      });
    }

    // 2. Insert 28-day Attendance Records for each employee
    const today = new Date();
    const attendanceRecords = [];

    for (const emp of employeesSeed) {
      for (let i = 0; i < 28; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayOfWeek = d.getDay();
        const dateStr = d.toISOString().split('T')[0];

        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        if (i === 0) continue; // Skip today initially for check-in demo

        let status = 'Present';
        let checkIn = '09:02 AM';
        let checkOut = '06:32 PM';
        let workingHours = 570; // 9h 30m
        let standardHours = 480;
        let extraHours = 90;

        if (i === 2) {
          status = 'Present';
          checkIn = '08:55 AM';
          checkOut = '05:00 PM';
          workingHours = 485;
          extraHours = 5;
        } else if (i === 4) {
          status = 'Half Day';
          checkIn = '09:15 AM';
          checkOut = '01:30 PM';
          workingHours = 255;
          extraHours = 0;
        } else if (i === 7) {
          status = 'Leave';
          checkIn = null;
          checkOut = null;
          workingHours = 0;
          extraHours = 0;
        } else if (i === 12 && emp.id === 'EMP-1004') {
          status = 'Absent';
          checkIn = null;
          checkOut = null;
          workingHours = 0;
          extraHours = 0;
        }

        attendanceRecords.push({
          employeeId: emp.employeeId,
          employeeName: emp.name,
          department: emp.department,
          date: dateStr,
          checkIn,
          checkOut,
          workingHours,
          standardHours,
          extraHours,
          status
        });
      }
    }
    await Attendance.insertMany(attendanceRecords);

    // 3. Insert Leave Requests
    const leavesSeed = [
      {
        employeeId: 'EMP-1001',
        employeeName: 'Arjun Kumar',
        department: 'Engineering',
        leaveType: 'Paid Time Off',
        startDate: '2026-09-02',
        endDate: '2026-09-05',
        days: 4,
        reason: 'Family vacation and personal downtime.',
        status: 'Approved',
        appliedOn: '2026-08-15',
        reviewedBy: 'Sarah Jenkins',
        reviewedOn: '2026-08-16',
        comment: 'Approved. Enjoy your vacation!'
      },
      {
        employeeId: 'EMP-1002',
        employeeName: 'Priya Sharma',
        department: 'Product Design',
        leaveType: 'Sick Leave',
        startDate: '2026-08-25',
        endDate: '2026-08-26',
        days: 2,
        reason: 'Severe viral fever and scheduled medical consultation.',
        attachment: {
          name: 'Medical_Prescription_Priya.pdf',
          url: '/uploads/medical_cert_priya.pdf',
          size: '1.2 MB',
          type: 'application/pdf'
        },
        status: 'Pending',
        appliedOn: '2026-08-22'
      },
      {
        employeeId: 'EMP-1003',
        employeeName: 'Rahul Nair',
        department: 'Engineering',
        leaveType: 'Paid Time Off',
        startDate: '2026-08-01',
        endDate: '2026-08-03',
        days: 3,
        reason: 'Attending O’Reilly Software Architecture Conference.',
        status: 'Approved',
        appliedOn: '2026-07-20',
        reviewedBy: 'Sarah Jenkins',
        reviewedOn: '2026-07-21',
        comment: 'Approved for professional development.'
      },
      {
        employeeId: 'EMP-1004',
        employeeName: 'Sneha Krishnan',
        department: 'Operations',
        leaveType: 'Unpaid Leave',
        startDate: '2026-07-10',
        endDate: '2026-07-12',
        days: 3,
        reason: 'Urgent personal relocation.',
        status: 'Rejected',
        appliedOn: '2026-07-05',
        reviewedBy: 'Sarah Jenkins',
        reviewedOn: '2026-07-06',
        comment: 'Quarterly facility audit scheduled on those dates. Please coordinate with replacement cover.'
      }
    ];
    await LeaveRequest.insertMany(leavesSeed);

    // 4. Insert Notifications
    const notificationsSeed = [
      {
        userId: 'HR-001',
        title: 'New Sick Leave Application',
        message: 'Priya Sharma applied for Sick Leave (2026-08-25 to 2026-08-26) with Medical Certificate attached.',
        type: 'warning',
        isRead: false,
        timestamp: new Date().toISOString()
      },
      {
        userId: 'EMP-1001',
        title: 'Leave Approved',
        message: 'Your Paid Time Off request for 2026-09-02 to 2026-09-05 has been approved by HR.',
        type: 'success',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        userId: 'EMP-1001',
        title: 'August 2026 Payslip Available',
        message: 'Your official payslip for August 2026 has been generated and is ready for download.',
        type: 'info',
        isRead: true,
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
    await Notification.insertMany(notificationsSeed);

    console.log('[Dayflow DB] Seed completed successfully with Indian workforce and INR compensation structures!');
  } catch (error) {
    console.error('[Dayflow DB] Seed error:', error.message);
  }
};

// If run directly via `npm run seed`
if (process.argv[1]?.includes('seedData.js')) {
  mongoose
    .connect(config.MONGODB_URI)
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
