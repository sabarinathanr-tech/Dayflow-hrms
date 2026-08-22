export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-1001',
    employeeId: 'EMP-1001',
    name: 'Alex Morgan',
    email: 'employee@dayflow.io',
    role: 'Employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2023-03-15',
    dateOfBirth: '1992-07-24',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 6500,
      allowances: 1200,
      deductions: 500,
      netSalary: 7200,
      currency: 'USD',
      effectiveDate: '2023-03-15'
    },
    leaveBalances: {
      paidTimeOff: 14,
      sickLeave: 8,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Employment_Contract_2023.pdf', type: 'PDF', uploadedDate: '2023-03-15', size: '1.4 MB' },
      { name: 'Identity_Verification_Passport.pdf', type: 'PDF', uploadedDate: '2023-03-15', size: '2.1 MB' },
      { name: 'Tax_Declaration_W4.pdf', type: 'PDF', uploadedDate: '2024-01-10', size: '840 KB' }
    ]
  },
  {
    id: 'HR-001',
    employeeId: 'HR-001',
    name: 'Sarah Jenkins',
    email: 'hr@dayflow.io',
    role: 'HR',
    designation: 'VP of People & Culture',
    department: 'Human Resources',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2021-06-01',
    dateOfBirth: '1988-11-12',
    phone: '+1 (555) 876-5432',
    address: '120 Ocean View Ave, San Francisco, CA 94107',
    manager: 'Executive Board',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 8500,
      allowances: 1800,
      deductions: 700,
      netSalary: 9600,
      currency: 'USD',
      effectiveDate: '2021-06-01'
    },
    leaveBalances: {
      paidTimeOff: 20,
      sickLeave: 12,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Executive_Agreement_HR.pdf', type: 'PDF', uploadedDate: '2021-06-01', size: '2.4 MB' },
      { name: 'HR_Certifications.pdf', type: 'PDF', uploadedDate: '2022-04-18', size: '1.8 MB' }
    ]
  },
  {
    id: 'EMP-1002',
    employeeId: 'EMP-1002',
    name: 'Marcus Vance',
    email: 'marcus.v@dayflow.io',
    role: 'Employee',
    designation: 'Product Designer',
    department: 'Design',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2023-08-01',
    dateOfBirth: '1995-04-18',
    phone: '+1 (555) 345-6789',
    address: '88 Design Street, Austin, TX 78701',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 5800,
      allowances: 1000,
      deductions: 450,
      netSalary: 6350,
      currency: 'USD',
      effectiveDate: '2023-08-01'
    },
    leaveBalances: {
      paidTimeOff: 12,
      sickLeave: 9,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Design_Contract.pdf', type: 'PDF', uploadedDate: '2023-08-01', size: '1.2 MB' }
    ]
  },
  {
    id: 'EMP-1003',
    employeeId: 'EMP-1003',
    name: 'Elena Rostova',
    email: 'elena.r@dayflow.io',
    role: 'Employee',
    designation: 'Backend Systems Lead',
    department: 'Engineering',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2022-11-15',
    dateOfBirth: '1990-09-05',
    phone: '+1 (555) 456-7890',
    address: '500 Tech Blvd, Seattle, WA 98101',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 7200,
      allowances: 1400,
      deductions: 600,
      netSalary: 8000,
      currency: 'USD',
      effectiveDate: '2022-11-15'
    },
    leaveBalances: {
      paidTimeOff: 16,
      sickLeave: 10,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Employment_Offer_Lead.pdf', type: 'PDF', uploadedDate: '2022-11-15', size: '1.5 MB' }
    ]
  },
  {
    id: 'EMP-1004',
    employeeId: 'EMP-1004',
    name: 'David Kim',
    email: 'david.k@dayflow.io',
    role: 'Employee',
    designation: 'Product Manager',
    department: 'Product',
    employmentType: 'Full-Time',
    status: 'On Leave',
    joiningDate: '2023-01-10',
    dateOfBirth: '1991-03-30',
    phone: '+1 (555) 567-8901',
    address: '22 Innovation Way, Boston, MA 02110',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 6800,
      allowances: 1300,
      deductions: 550,
      netSalary: 7550,
      currency: 'USD',
      effectiveDate: '2023-01-10'
    },
    leaveBalances: {
      paidTimeOff: 8,
      sickLeave: 6,
      unpaidLeave: 0
    },
    documents: [
      { name: 'PM_Agreement.pdf', type: 'PDF', uploadedDate: '2023-01-10', size: '1.1 MB' }
    ]
  },
  {
    id: 'EMP-1005',
    employeeId: 'EMP-1005',
    name: 'Priya Sharma',
    email: 'priya.s@dayflow.io',
    role: 'Employee',
    designation: 'Growth Marketing Specialist',
    department: 'Marketing',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2024-02-01',
    dateOfBirth: '1996-12-14',
    phone: '+1 (555) 678-9012',
    address: '304 Market Square, Chicago, IL 60601',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    salary: {
      basicSalary: 5200,
      allowances: 900,
      deductions: 400,
      netSalary: 5700,
      currency: 'USD',
      effectiveDate: '2024-02-01'
    },
    leaveBalances: {
      paidTimeOff: 18,
      sickLeave: 12,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Marketing_Agreement.pdf', type: 'PDF', uploadedDate: '2024-02-01', size: '1.3 MB' }
    ]
  }
];

export const INITIAL_LEAVES = [
  {
    id: 'LEV-001',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    leaveType: 'Paid Time Off',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    days: 3,
    reason: 'Family vacation trip',
    status: 'Approved',
    appliedOn: '2026-08-01',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-08-02',
    comment: 'Approved. Enjoy your time off!'
  },
  {
    id: 'LEV-002',
    employeeId: 'EMP-1002',
    employeeName: 'Marcus Vance',
    department: 'Design',
    leaveType: 'Sick Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    days: 1,
    reason: 'Dental surgery and recovery',
    status: 'Approved',
    appliedOn: '2026-08-17',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-08-17',
    comment: 'Approved. Take rest.'
  },
  {
    id: 'LEV-003',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    department: 'Product',
    leaveType: 'Paid Time Off',
    startDate: '2026-08-20',
    endDate: '2026-08-24',
    days: 5,
    reason: 'Annual personal leave',
    status: 'Approved',
    appliedOn: '2026-08-12',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-08-13',
    comment: 'Approved.'
  },
  {
    id: 'LEV-004',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    days: 2,
    reason: 'Viral fever rest',
    status: 'Pending',
    appliedOn: '2026-08-22',
    reviewedBy: null,
    reviewedOn: null,
    comment: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    userId: 'EMP-1001',
    title: 'Leave Approved',
    message: 'Your Paid Time Off request for Aug 10 - Aug 12 was approved by Sarah Jenkins.',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    isRead: false
  },
  {
    id: 'NOTIF-2',
    userId: 'EMP-1001',
    title: 'Salary Structure Updated',
    message: 'Your revised salary structure for Q3 has been updated in the payroll system.',
    type: 'info',
    timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    isRead: true
  },
  {
    id: 'NOTIF-3',
    userId: 'HR-001',
    title: 'New Leave Request',
    message: 'Priya Sharma submitted a Sick Leave request for Aug 25 - Aug 26.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  }
];
