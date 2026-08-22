import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';
import { Notification } from '../models/Notification.js';
import { config } from '../config/env.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Dayflow DB] Database already contains ${userCount} users. Skipping initial seed.`);
      return;
    }

    console.log('[Dayflow DB] Seeding initial enterprise dataset...');

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
        phone: '+1 (555) 234-5678',
        address: '100 Enterprise Way, Suite 400, San Francisco, CA',
        manager: 'Board of Directors',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Experienced HR leader with 12+ years optimizing people operations, talent acquisition, and workforce retention.',
          whatILove: 'Fostering inclusive workplace culture and crafting scalable people operations.',
          skills: ['Talent Strategy', 'People Analytics', 'Compensation & Benefits', 'Conflict Resolution'],
          certifications: [
            { name: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM', year: '2021' },
            { name: 'Certified Compensation Professional (CCP)', issuer: 'WorldatWork', year: '2019' }
          ],
          education: [
            { degree: 'M.S. in Human Resource Management', school: 'Cornell University', year: '2014' },
            { degree: 'B.A. in Psychology', school: 'UC Berkeley', year: '2010' }
          ],
          experience: [
            { role: 'Head of People Operations', company: 'Apex Global Technologies', duration: '2018 - 2022' },
            { role: 'Senior HR Business Partner', company: 'Vanguard Systems', duration: '2014 - 2018' }
          ]
        },
        privateInfo: {
          nationality: 'American',
          gender: 'Female',
          maritalStatus: 'Married',
          personalEmail: 'sarah.jenkins.personal@gmail.com',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          emergencyContact: { name: 'Mark Jenkins', relation: 'Spouse', phone: '+1 (555) 234-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 9812',
            bankName: 'Silicon Valley Corporate Bank',
            ifscCode: 'SVCB0001099',
            panNumber: 'HRADM9812K',
            uanNumber: '100882736451',
            employeeCode: 'DF-HR-001'
          }
        },
        salary: {
          basicSalary: 9500,
          hra: 3800,
          standardAllowance: 1000,
          performanceBonus: 1200,
          lta: 500,
          fixedAllowance: 500,
          allowances: 7000,
          pfDeduction: 800,
          professionalTax: 250,
          otherDeductions: 150,
          deductions: 1200,
          grossSalary: 16500,
          netSalary: 15300,
          monthlyWage: 15300,
          yearlyWage: 183600,
          currency: 'USD',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T08:30:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 20, sickLeave: 12, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1001',
        employeeId: 'EMP-1001',
        name: 'Alex Morgan',
        email: 'employee@dayflow.io',
        role: 'Employee',
        designation: 'Lead Frontend Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: '2023-01-10',
        dateOfBirth: '1994-08-22',
        phone: '+1 (555) 019-2834',
        address: '742 Evergreen Terrace, Springfield, OR',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Lead Frontend Engineer with 7+ years crafting scalable web applications, design systems, and responsive architectures in React, TypeScript, and Tailwind.',
          whatILove: 'Building intuitive user interfaces, improving web performance, and mentoring junior engineers.',
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'Vite', 'GraphQL', 'Jest / Cypress'],
          certifications: [
            { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
            { name: 'Meta Certified Front-End Developer', issuer: 'Meta', year: '2022' }
          ],
          education: [
            { degree: 'B.S. in Computer Science', school: 'University of Washington', year: '2017' }
          ],
          experience: [
            { role: 'Senior Frontend Developer', company: 'CloudFlow Inc.', duration: '2020 - 2023' },
            { role: 'Frontend Engineer', company: 'PixelCraft Studios', duration: '2017 - 2020' }
          ]
        },
        privateInfo: {
          nationality: 'American',
          gender: 'Female',
          maritalStatus: 'Single',
          personalEmail: 'alex.morgan.dev@gmail.com',
          city: 'Springfield',
          state: 'Oregon',
          country: 'United States',
          emergencyContact: { name: 'Jordan Morgan', relation: 'Sibling', phone: '+1 (555) 019-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 4829',
            bankName: 'First Horizon National Bank',
            ifscCode: 'FHNB0001892',
            panNumber: 'ABCDE1234F',
            uanNumber: '100928374651',
            employeeCode: 'DF-EMP-1001'
          }
        },
        salary: {
          basicSalary: 6200,
          hra: 2480,
          standardAllowance: 600,
          performanceBonus: 500,
          lta: 350,
          fixedAllowance: 270,
          allowances: 4200,
          pfDeduction: 480,
          professionalTax: 200,
          otherDeductions: 120,
          deductions: 800,
          grossSalary: 10400,
          netSalary: 9600,
          monthlyWage: 9600,
          yearlyWage: 115200,
          currency: 'USD',
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
        phone: '+1 (555) 345-6789',
        address: '456 Innovation Blvd, Austin, TX',
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
          nationality: 'Indian-American',
          gender: 'Female',
          maritalStatus: 'Single',
          personalEmail: 'priya.sharma.ux@gmail.com',
          city: 'Austin',
          state: 'Texas',
          country: 'United States',
          emergencyContact: { name: 'Raj Sharma', relation: 'Father', phone: '+1 (555) 345-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 6194',
            bankName: 'Austin Federal Credit Union',
            ifscCode: 'AFCU0002104',
            panNumber: 'PSHARM5678G',
            uanNumber: '100492837192',
            employeeCode: 'DF-EMP-1002'
          }
        },
        salary: {
          basicSalary: 5500,
          hra: 2200,
          standardAllowance: 500,
          performanceBonus: 400,
          lta: 300,
          fixedAllowance: 200,
          allowances: 3600,
          pfDeduction: 420,
          professionalTax: 180,
          otherDeductions: 100,
          deductions: 700,
          grossSalary: 9100,
          netSalary: 8400,
          monthlyWage: 8400,
          yearlyWage: 100800,
          currency: 'USD',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-21T14:20:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 12, sickLeave: 6, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1003',
        employeeId: 'EMP-1003',
        name: 'Marcus Chen',
        email: 'marcus.chen@dayflow.io',
        role: 'Employee',
        designation: 'Senior Backend Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: '2023-08-01',
        dateOfBirth: '1992-03-29',
        phone: '+1 (555) 456-7890',
        address: '89 Silicon Alley, New York, NY',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Specialist in distributed backend systems, Node.js, Go, microservices, and database tuning.',
          whatILove: 'Optimizing high-throughput query performance and API reliability.',
          skills: ['Node.js', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
          certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2023' }],
          education: [{ degree: 'B.S. in Electrical & Computer Engineering', school: 'Columbia University', year: '2015' }],
          experience: [{ role: 'Backend Systems Engineer', company: 'Starlight Scale Inc.', duration: '2018 - 2023' }]
        },
        privateInfo: {
          nationality: 'American',
          gender: 'Male',
          maritalStatus: 'Married',
          personalEmail: 'marcus.chen.backend@gmail.com',
          city: 'New York',
          state: 'New York',
          country: 'United States',
          emergencyContact: { name: 'Grace Chen', relation: 'Spouse', phone: '+1 (555) 456-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 8271',
            bankName: 'Manhattan Commercial Trust',
            ifscCode: 'MCT0009821',
            panNumber: 'MCHEN9012H',
            uanNumber: '100789234512',
            employeeCode: 'DF-EMP-1003'
          }
        },
        salary: {
          basicSalary: 6400,
          hra: 2560,
          standardAllowance: 600,
          performanceBonus: 600,
          lta: 340,
          fixedAllowance: 300,
          allowances: 4400,
          pfDeduction: 500,
          professionalTax: 200,
          otherDeductions: 100,
          deductions: 800,
          grossSalary: 10800,
          netSalary: 10000,
          monthlyWage: 10000,
          yearlyWage: 120000,
          currency: 'USD',
          effectiveDate: '2026-01-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-22T08:15:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 16, sickLeave: 9, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1004',
        employeeId: 'EMP-1004',
        name: 'Elena Rostova',
        email: 'elena.rostova@dayflow.io',
        role: 'Employee',
        designation: 'Operations Lead',
        department: 'Operations',
        status: 'Active',
        joiningDate: '2024-02-01',
        dateOfBirth: '1996-09-14',
        phone: '+1 (555) 567-8901',
        address: '320 Lake Shore Dr, Chicago, IL',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Operations Lead streamlining cross-functional vendor management, facility infrastructure, and process efficiency.',
          whatILove: 'Driving operational excellence and reducing procedural bottlenecks.',
          skills: ['Process Optimization', 'Vendor Relations', 'Project Management', 'Compliance', 'Budgeting'],
          certifications: [{ name: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2024' }],
          education: [{ degree: 'B.A. in Business Administration', school: 'Northwestern University', year: '2018' }],
          experience: [{ role: 'Operations Specialist', company: 'Metropolis Logistics', duration: '2020 - 2024' }]
        },
        privateInfo: {
          nationality: 'American',
          gender: 'Female',
          maritalStatus: 'Single',
          personalEmail: 'elena.rostova.ops@gmail.com',
          city: 'Chicago',
          state: 'Illinois',
          country: 'United States',
          emergencyContact: { name: 'Dmitri Rostov', relation: 'Brother', phone: '+1 (555) 567-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 3418',
            bankName: 'Midwest Regional Financial',
            ifscCode: 'MRF0004319',
            panNumber: 'EROST3418J',
            uanNumber: '100612984532',
            employeeCode: 'DF-EMP-1004'
          }
        },
        salary: {
          basicSalary: 5000,
          hra: 2000,
          standardAllowance: 500,
          performanceBonus: 300,
          lta: 250,
          fixedAllowance: 250,
          allowances: 3300,
          pfDeduction: 380,
          professionalTax: 170,
          otherDeductions: 100,
          deductions: 650,
          grossSalary: 8300,
          netSalary: 7650,
          monthlyWage: 7650,
          yearlyWage: 91800,
          currency: 'USD',
          effectiveDate: '2026-02-01'
        },
        security: { emailVerified: true, lastLogin: '2026-08-20T17:45:00.000Z', activeSessions: 1 },
        leaveBalances: { paidTimeOff: 11, sickLeave: 7, unpaidLeave: 0 }
      },
      {
        id: 'EMP-1005',
        employeeId: 'EMP-1005',
        name: 'David Kim',
        email: 'david.kim@dayflow.io',
        role: 'Employee',
        designation: 'Growth Marketing Specialist',
        department: 'Marketing',
        status: 'Active',
        joiningDate: '2024-05-15',
        dateOfBirth: '1997-12-08',
        phone: '+1 (555) 678-9012',
        address: '512 Pine Street, Seattle, WA',
        manager: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Growth marketer specializing in demand generation, inbound funnel optimization, and lifecycle campaigns.',
          whatILove: 'Analyzing campaign performance data and experimenting with novel acquisition channels.',
          skills: ['SEO / SEM', 'Google Analytics 4', 'Lifecycle Marketing', 'HubSpot', 'Content Strategy'],
          certifications: [{ name: 'Google Ads & Analytics Certified Professional', issuer: 'Google', year: '2024' }],
          education: [{ degree: 'B.A. in Marketing & Communications', school: 'University of Washington', year: '2019' }],
          experience: [{ role: 'Digital Marketer', company: 'Cascade Media Group', duration: '2021 - 2024' }]
        },
        privateInfo: {
          nationality: 'Korean-American',
          gender: 'Male',
          maritalStatus: 'Single',
          personalEmail: 'david.kim.growth@gmail.com',
          city: 'Seattle',
          state: 'Washington',
          country: 'United States',
          emergencyContact: { name: 'Hannah Kim', relation: 'Mother', phone: '+1 (555) 678-9988' },
          bankDetails: {
            accountNumber: '•••• •••• 7521',
            bankName: 'Pacific Northwest Community Bank',
            ifscCode: 'PNCB0007812',
            panNumber: 'DKIM7521L',
            uanNumber: '100523891047',
            employeeCode: 'DF-EMP-1005'
          }
        },
        salary: {
          basicSalary: 4600,
          hra: 1840,
          standardAllowance: 500,
          performanceBonus: 350,
          lta: 250,
          fixedAllowance: 160,
          allowances: 3100,
          pfDeduction: 350,
          professionalTax: 150,
          otherDeductions: 100,
          deductions: 600,
          grossSalary: 7700,
          netSalary: 7100,
          monthlyWage: 7100,
          yearlyWage: 85200,
          currency: 'USD',
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
        password: 'password123', // Will be hashed by User pre-save hook
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
        employeeName: 'Alex Morgan',
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
        employeeName: 'Marcus Chen',
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
        employeeName: 'Elena Rostova',
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

    console.log('[Dayflow DB] Seed completed successfully with 1 HR Admin and 5 active employees!');
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
