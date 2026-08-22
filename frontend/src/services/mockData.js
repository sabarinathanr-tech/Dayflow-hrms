export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-1001',
    employeeId: 'EMP-1001',
    name: 'Arjun Kumar',
    email: 'employee@dayflow.io',
    role: 'Employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2023-03-15',
    dateOfBirth: '1994-08-22',
    phone: '+91 98450 12345',
    address: '42 MG Road, Indiranagar, Bengaluru, KA 560038',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'Passionate Senior Frontend Engineer with 7+ years of experience building accessible SaaS applications, high-performance UI architectures, and design systems.',
      whatILove: 'Partnering across product and engineering to build seamless, delightful user workflows and mentoring frontend developers.',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'Next.js', 'Jest', 'Accessibility (a11y)'],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
        { name: 'Meta Certified Frontend Specialist', issuer: 'Meta', year: '2022' }
      ],
      education: [
        { degree: 'B.Tech in Computer Science', institution: 'NIT Karnataka', year: '2015 - 2019' }
      ],
      experience: [
        { title: 'Senior Frontend Engineer', company: 'Dayflow HRMS', period: '2023 - Present' },
        { title: 'Software Engineer', company: 'Nexus Systems', period: '2019 - 2023' }
      ],
      resumeDoc: { name: 'Arjun_Kumar_Resume.pdf', size: '1.4 MB', uploadedDate: '2024-01-15' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Single',
      personalEmail: 'arjun.kumar.dev@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'Ramesh Kumar', phone: '+91 98450 99887', relation: 'Father' },
      bankDetails: {
        accountNumber: '•••• •••• 8492',
        rawAccountNumber: '4920 8102 8492',
        bankName: 'State Bank of India',
        ifscCode: 'SBIN0002931',
        panNumber: 'ALXPM8291K',
        uanNumber: '100928374619',
        employeeCode: 'DF-ENG-1001'
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
      effectiveDate: '2023-03-15'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 09:02 AM (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_1', device: 'Chrome / macOS (Current Session)', ip: '192.168.1.42', location: 'Bengaluru, IN', isCurrent: true },
        { id: 'sess_2', device: 'Dayflow Mobile / iOS 17', ip: '172.56.21.9', location: 'Bengaluru, IN', isCurrent: false }
      ]
    },
    leaveBalances: {
      paidTimeOff: 14,
      sickLeave: 8,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Employment_Contract_2023.pdf', type: 'PDF', uploadedDate: '2023-03-15', size: '1.4 MB' },
      { name: 'Identity_Verification_Passport.pdf', type: 'PDF', uploadedDate: '2023-03-15', size: '2.1 MB' },
      { name: 'Tax_Declaration_Form16.pdf', type: 'PDF', uploadedDate: '2024-01-10', size: '840 KB' }
    ]
  },
  {
    id: 'HR-001',
    employeeId: 'HR-001',
    name: 'Sarah Jenkins',
    email: 'hr@dayflow.io',
    role: 'HR',
    designation: 'Director of Human Resources',
    department: 'Human Resources',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2021-06-01',
    dateOfBirth: '1988-11-12',
    phone: '+91 98765 43210',
    address: '100 Innovation Park, Whitefield, Bengaluru, KA 560066',
    manager: 'Executive Board',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'Strategic People Operations executive with 12+ years specializing in talent development, organizational culture, and HR tech.',
      whatILove: 'Fostering inclusive workplace cultures and scaling high-growth teams.',
      skills: ['People Operations', 'Compensation Strategy', 'Employee Relations', 'HR Analytics', 'Talent Acquisition'],
      certifications: [
        { name: 'Senior Professional in Human Resources (SPHR)', issuer: 'HRCI', year: '2021' },
        { name: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM', year: '2020' }
      ],
      education: [
        { degree: 'MBA in Human Resource Management', institution: 'IIM Bangalore', year: '2012 - 2014' }
      ],
      experience: [
        { title: 'Director of Human Resources', company: 'Dayflow HRMS', period: '2021 - Present' }
      ],
      resumeDoc: { name: 'Sarah_Jenkins_CV.pdf', size: '1.8 MB', uploadedDate: '2021-06-01' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Female',
      maritalStatus: 'Married',
      personalEmail: 'sarah.jenkins.hr@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'David Jenkins', phone: '+91 98765 43219', relation: 'Spouse' },
      bankDetails: {
        accountNumber: '•••• •••• 9201',
        rawAccountNumber: '5819 2019 9201',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001099',
        panNumber: 'SRHJK1029P',
        uanNumber: '100817263541',
        employeeCode: 'DF-HR-0001'
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
      effectiveDate: '2021-06-01'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 08:45 AM (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_hr1', device: 'Safari / macOS (Current Session)', ip: '192.168.1.10', location: 'Bengaluru, IN', isCurrent: true }
      ]
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
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.io',
    role: 'Employee',
    designation: 'Senior Product Designer',
    department: 'Design',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2023-04-18',
    dateOfBirth: '1995-11-03',
    phone: '+91 97110 56789',
    address: '15 Koramangala 4th Block, Bengaluru, KA 560034',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'UI/UX and Interaction Designer passionate about clean design systems, micro-interactions, and accessibility.',
      whatILove: 'Transforming complex administrative workflows into simple, human-centered digital experiences.',
      skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Tailwind CSS', 'Micro-interactions'],
      certifications: [{ name: 'Certified Usability Analyst (CUA)', issuer: 'HFI', year: '2022' }],
      education: [{ degree: 'B.Des in Interaction Design', institution: 'NID Ahmedabad', year: '2014 - 2018' }],
      experience: [{ title: 'Product Designer', company: 'Dayflow HRMS', period: '2023 - Present' }],
      resumeDoc: { name: 'Priya_Sharma_Design_Portfolio.pdf', size: '2.3 MB', uploadedDate: '2023-08-01' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Female',
      maritalStatus: 'Single',
      personalEmail: 'priya.sharma.ux@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'Raj Sharma', phone: '+91 97110 99887', relation: 'Father' },
      bankDetails: {
        accountNumber: '•••• •••• 6194',
        rawAccountNumber: '3819 4019 6194',
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0002104',
        panNumber: 'PSHARM5678G',
        uanNumber: '100492837192',
        employeeCode: 'DF-DES-1002'
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
      effectiveDate: '2023-08-01'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Yesterday at 05:12 PM (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_priya_m', device: 'Chrome / Windows 11', ip: '192.168.1.55', location: 'Bengaluru, IN', isCurrent: true }
      ]
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
    name: 'Rahul Nair',
    email: 'rahul.nair@dayflow.io',
    role: 'Employee',
    designation: 'Backend Systems Lead',
    department: 'Engineering',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2022-11-15',
    dateOfBirth: '1992-03-29',
    phone: '+91 99001 23456',
    address: '88 HSR Layout Sector 2, Bengaluru, KA 560102',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'Distributed systems architect with 9+ years building scalable microservices and data pipelines.',
      whatILove: 'Architecting resilient cloud backends and high-throughput real-time systems.',
      skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'Kafka'],
      certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2022' }],
      education: [{ degree: 'B.Tech in Computer Science', institution: 'IIT Madras', year: '2011 - 2015' }],
      experience: [{ title: 'Backend Systems Lead', company: 'Dayflow HRMS', period: '2022 - Present' }],
      resumeDoc: { name: 'Rahul_Nair_Resume.pdf', size: '1.6 MB', uploadedDate: '2022-11-15' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Married',
      personalEmail: 'rahul.nair.backend@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'Ananya Nair', phone: '+91 99001 99887', relation: 'Spouse' },
      bankDetails: {
        accountNumber: '•••• •••• 8271',
        rawAccountNumber: '2910 4482 8271',
        bankName: 'Axis Bank',
        ifscCode: 'UTIB0009821',
        panNumber: 'RNAIR9012H',
        uanNumber: '100789234512',
        employeeCode: 'DF-ENG-1003'
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
      effectiveDate: '2022-11-15'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 07:30 AM (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_rahul', device: 'Linux / Ubuntu 24.04', ip: '192.168.1.72', location: 'Bengaluru, IN', isCurrent: true }
      ]
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
    name: 'Sneha Krishnan',
    email: 'sneha.krishnan@dayflow.io',
    role: 'Employee',
    designation: 'Operations Lead',
    department: 'Operations',
    employmentType: 'Full-Time',
    status: 'On Leave',
    joiningDate: '2024-02-01',
    dateOfBirth: '1996-09-14',
    phone: '+91 98200 34567',
    address: '50 JP Nagar Phase 3, Bengaluru, KA 560078',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'Operations Lead streamlining vendor management, logistics, and process efficiency.',
      whatILove: 'Driving operational excellence and reducing procedural bottlenecks.',
      skills: ['Process Optimization', 'Vendor Relations', 'Project Management', 'Compliance', 'Budgeting'],
      certifications: [{ name: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2024' }],
      education: [{ degree: 'B.Com in Business Management', institution: 'St. Xavier’s College', year: '2014 - 2018' }],
      experience: [{ title: 'Operations Lead', company: 'Dayflow HRMS', period: '2024 - Present' }],
      resumeDoc: { name: 'Sneha_Krishnan_Resume.pdf', size: '1.2 MB', uploadedDate: '2024-02-01' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Female',
      maritalStatus: 'Single',
      personalEmail: 'sneha.krishnan.ops@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'Gopal Krishnan', phone: '+91 98200 99887', relation: 'Father' },
      bankDetails: {
        accountNumber: '•••• •••• 3418',
        rawAccountNumber: '4918 3918 3418',
        bankName: 'Kotak Mahindra Bank',
        ifscCode: 'KKBK0004319',
        panNumber: 'SKRSH3418J',
        uanNumber: '100612984532',
        employeeCode: 'DF-OPS-1004'
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
      effectiveDate: '2024-02-01'
    },
    security: {
      emailVerified: true,
      lastLogin: '3 days ago (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_sneha', device: 'Chrome / macOS', ip: '192.168.1.88', location: 'Bengaluru, IN', isCurrent: true }
      ]
    },
    leaveBalances: {
      paidTimeOff: 11,
      sickLeave: 7,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Operations_Agreement.pdf', type: 'PDF', uploadedDate: '2024-02-01', size: '1.1 MB' }
    ]
  },
  {
    id: 'EMP-1005',
    employeeId: 'EMP-1005',
    name: 'Karthik Raj',
    email: 'karthik.raj@dayflow.io',
    role: 'Employee',
    designation: 'Growth Marketing Specialist',
    department: 'Marketing',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: '2024-05-15',
    dateOfBirth: '1997-12-08',
    phone: '+91 97400 67890',
    address: '24 Richmond Town, Bengaluru, KA 560025',
    manager: 'Sarah Jenkins (HR-001)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    resume: {
      about: 'Growth marketing specialist focused on B2B SaaS acquisition funnels, retention, and content lifecycle.',
      whatILove: 'Driving organic pipeline velocity and running high-impact growth experiments.',
      skills: ['Growth Strategy', 'SEO/SEM', 'HubSpot', 'Google Analytics 4', 'Content Marketing', 'Copywriting'],
      certifications: [{ name: 'HubSpot Inbound Marketing Certified', issuer: 'HubSpot', year: '2023' }],
      education: [{ degree: 'BBA in Marketing', institution: 'Symbiosis International University', year: '2015 - 2019' }],
      experience: [{ title: 'Growth Marketing Specialist', company: 'Dayflow HRMS', period: '2024 - Present' }],
      resumeDoc: { name: 'Karthik_Raj_Resume.pdf', size: '1.4 MB', uploadedDate: '2024-05-15' }
    },
    privateInfo: {
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Single',
      personalEmail: 'karthik.raj.growth@gmail.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      emergencyContact: { name: 'Kavitha Raj', phone: '+91 97400 99887', relation: 'Mother' },
      bankDetails: {
        accountNumber: '•••• •••• 7521',
        rawAccountNumber: '5819 2819 7521',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0007812',
        panNumber: 'KRAJ7521L',
        uanNumber: '100523891047',
        employeeCode: 'DF-MKT-1005'
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
      effectiveDate: '2024-05-15'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 09:15 AM (Bengaluru, IN)',
      activeSessions: [
        { id: 'sess_karthik', device: 'Chrome / macOS Sonoma', ip: '192.168.1.94', location: 'Bengaluru, IN', isCurrent: true }
      ]
    },
    leaveBalances: {
      paidTimeOff: 9,
      sickLeave: 5,
      unpaidLeave: 0
    },
    documents: [
      { name: 'Marketing_Agreement.pdf', type: 'PDF', uploadedDate: '2024-05-15', size: '1.3 MB' }
    ]
  }
];

export const INITIAL_LEAVES = [
  {
    id: 'LEV-001',
    employeeId: 'EMP-1001',
    employeeName: 'Arjun Kumar',
    department: 'Engineering',
    leaveType: 'Paid Time Off',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    days: 4,
    reason: 'Family vacation trip',
    attachment: null,
    status: 'Approved',
    appliedOn: '2026-08-01',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-08-02',
    comment: 'Approved. Enjoy your time off!'
  },
  {
    id: 'LEV-002',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Design',
    leaveType: 'Sick Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    days: 2,
    reason: 'Viral fever and doctor recommended rest',
    attachment: { name: 'Medical_Prescription_Priya.pdf', size: '1.2 MB', type: 'PDF' },
    status: 'Pending',
    appliedOn: '2026-08-22',
    reviewedBy: null,
    reviewedOn: null,
    comment: null
  },
  {
    id: 'LEV-003',
    employeeId: 'EMP-1003',
    employeeName: 'Rahul Nair',
    department: 'Engineering',
    leaveType: 'Paid Time Off',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    days: 3,
    reason: 'Attending Software Architecture Conference',
    attachment: null,
    status: 'Approved',
    appliedOn: '2026-07-20',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-07-21',
    comment: 'Approved for professional development.'
  },
  {
    id: 'LEV-004',
    employeeId: 'EMP-1004',
    employeeName: 'Sneha Krishnan',
    department: 'Operations',
    leaveType: 'Unpaid Leave',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    days: 3,
    reason: 'Urgent personal relocation',
    attachment: null,
    status: 'Rejected',
    appliedOn: '2026-07-05',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-07-06',
    comment: 'Quarterly facility audit scheduled on those dates. Please coordinate with replacement cover.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    userId: 'EMP-1001',
    title: 'Leave Approved',
    message: 'Your Paid Time Off request for Sep 02 - Sep 05 was approved by Sarah Jenkins.',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    isRead: false
  },
  {
    id: 'NOTIF-2',
    userId: 'EMP-1001',
    title: 'Salary Structure Updated',
    message: 'Your revised salary structure has been updated in the payroll system.',
    type: 'info',
    timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    isRead: true
  },
  {
    id: 'NOTIF-3',
    userId: 'HR-001',
    title: 'New Leave Request',
    message: 'Priya Sharma submitted a Sick Leave request with Medical Certificate for Aug 25 - Aug 26.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  }
];
