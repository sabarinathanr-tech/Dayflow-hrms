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
    resume: {
      about: 'Passionate Senior Frontend Engineer with 7+ years of experience building accessible SaaS applications, high-performance UI architectures, and design systems.',
      whatILove: 'Partnering across product and engineering to build seamless, delightful user workflows and mentoring frontend developers.',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'Next.js', 'Jest', 'Accessibility (a11y)'],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
        { name: 'Meta Certified Frontend Specialist', issuer: 'Meta', year: '2022' }
      ],
      education: [
        { degree: 'B.S. in Computer Science', institution: 'University of California, Berkeley', year: '2015 - 2019' }
      ],
      experience: [
        { title: 'Senior Frontend Engineer', company: 'Dayflow HRMS', period: '2023 - Present' },
        { title: 'Software Engineer', company: 'Nexus Systems', period: '2019 - 2023' }
      ],
      resumeDoc: { name: 'Alex_Morgan_Official_Resume.pdf', size: '1.4 MB', uploadedDate: '2024-01-15' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Female',
      maritalStatus: 'Single',
      personalEmail: 'alex.morgan.dev@gmail.com',
      city: 'Springfield',
      state: 'Oregon',
      country: 'United States',
      emergencyContact: { name: 'Robert Morgan', phone: '+1 (555) 987-6543', relation: 'Father' },
      bankDetails: {
        accountNumber: '•••• •••• 8492',
        rawAccountNumber: '4920 8102 8492',
        bankName: 'Silicon Valley Bank',
        ifscCode: 'SVB0002931',
        panNumber: 'ALXPM8291K',
        uanNumber: '100928374619',
        employeeCode: 'DF-ENG-1001'
      }
    },
    salary: {
      basicSalary: 4500,
      hra: 1800,
      standardAllowance: 500,
      performanceBonus: 400,
      lta: 300,
      fixedAllowance: 200,
      allowances: 3200,
      pfDeduction: 350,
      professionalTax: 150,
      otherDeductions: 100,
      deductions: 600,
      grossSalary: 7700,
      netSalary: 7100,
      monthlyWage: 7100,
      yearlyWage: 85200,
      currency: 'USD',
      effectiveDate: '2023-03-15'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 09:02 AM (San Francisco, US)',
      activeSessions: [
        { id: 'sess_1', device: 'Chrome / macOS (Current Session)', ip: '192.168.1.42', location: 'San Francisco, US', isCurrent: true },
        { id: 'sess_2', device: 'Dayflow Mobile / iOS 17', ip: '172.56.21.9', location: 'San Francisco, US', isCurrent: false }
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
    resume: {
      about: 'Strategic People Operations executive with 10+ years specializing in talent development, organizational culture, and HR tech.',
      whatILove: 'Fostering inclusive workplace cultures and scaling high-growth teams.',
      skills: ['People Operations', 'Compensation Strategy', 'Employee Relations', 'HR Analytics', 'Talent Acquisition'],
      certifications: [
        { name: 'Senior Professional in Human Resources (SPHR)', issuer: 'HRCI', year: '2021' },
        { name: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM', year: '2020' }
      ],
      education: [
        { degree: 'M.S. in Human Resource Management', institution: 'Stanford University', year: '2012 - 2014' }
      ],
      experience: [
        { title: 'VP of People & Culture', company: 'Dayflow HRMS', period: '2021 - Present' }
      ],
      resumeDoc: { name: 'Sarah_Jenkins_CV.pdf', size: '1.8 MB', uploadedDate: '2021-06-01' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Female',
      maritalStatus: 'Married',
      personalEmail: 'sarah.jenkins.hr@gmail.com',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      emergencyContact: { name: 'David Jenkins', phone: '+1 (555) 321-7654', relation: 'Spouse' },
      bankDetails: {
        accountNumber: '•••• •••• 9201',
        rawAccountNumber: '5819 2019 9201',
        bankName: 'Chase Bank',
        ifscCode: 'CHAS000918',
        panNumber: 'SRHJK1029P',
        uanNumber: '100817263541',
        employeeCode: 'DF-HR-0001'
      }
    },
    salary: {
      basicSalary: 6000,
      hra: 2200,
      standardAllowance: 600,
      performanceBonus: 700,
      lta: 400,
      fixedAllowance: 300,
      allowances: 4200,
      pfDeduction: 450,
      professionalTax: 200,
      otherDeductions: 150,
      deductions: 800,
      grossSalary: 10200,
      netSalary: 9400,
      monthlyWage: 9400,
      yearlyWage: 112800,
      currency: 'USD',
      effectiveDate: '2021-06-01'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 08:45 AM (San Francisco, US)',
      activeSessions: [
        { id: 'sess_hr1', device: 'Safari / macOS (Current Session)', ip: '192.168.1.10', location: 'San Francisco, US', isCurrent: true }
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
    resume: {
      about: 'UI/UX and Interaction Designer passionate about clean design systems, micro-interactions, and accessibility.',
      whatILove: 'Transforming complex administrative workflows into simple, human-centered digital experiences.',
      skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Tailwind CSS', 'Micro-interactions'],
      certifications: [{ name: 'Certified Usability Analyst (CUA)', issuer: 'HFI', year: '2022' }],
      education: [{ degree: 'B.Des in Digital Media', institution: 'UT Austin', year: '2014 - 2018' }],
      experience: [{ title: 'Product Designer', company: 'Dayflow HRMS', period: '2023 - Present' }],
      resumeDoc: { name: 'Marcus_Vance_Design_Portfolio.pdf', size: '2.3 MB', uploadedDate: '2023-08-01' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Male',
      maritalStatus: 'Single',
      personalEmail: 'marcus.vance.design@gmail.com',
      city: 'Austin',
      state: 'Texas',
      country: 'United States',
      emergencyContact: { name: 'Lucas Vance', phone: '+1 (555) 345-9876', relation: 'Brother' },
      bankDetails: {
        accountNumber: '•••• •••• 5512',
        rawAccountNumber: '3819 4019 5512',
        bankName: 'Austin Community Bank',
        ifscCode: 'ACB0009182',
        panNumber: 'MRCVN4820L',
        uanNumber: '100827361928',
        employeeCode: 'DF-DES-1002'
      }
    },
    salary: {
      basicSalary: 4000,
      hra: 1400,
      standardAllowance: 400,
      performanceBonus: 300,
      lta: 200,
      fixedAllowance: 100,
      allowances: 2400,
      pfDeduction: 300,
      professionalTax: 120,
      otherDeductions: 80,
      deductions: 500,
      grossSalary: 6400,
      netSalary: 5900,
      monthlyWage: 5900,
      yearlyWage: 70800,
      currency: 'USD',
      effectiveDate: '2023-08-01'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Yesterday at 05:12 PM (Austin, US)',
      activeSessions: [
        { id: 'sess_marcus', device: 'Chrome / Windows 11', ip: '192.168.1.55', location: 'Austin, US', isCurrent: true }
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
    resume: {
      about: 'Distributed systems architect with 9+ years building scalable microservices and data pipelines.',
      whatILove: 'Architecting resilient cloud backends and high-throughput real-time systems.',
      skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'Kafka'],
      certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2022' }],
      education: [{ degree: 'M.S. in Software Systems', institution: 'University of Washington', year: '2012 - 2014' }],
      experience: [{ title: 'Backend Systems Lead', company: 'Dayflow HRMS', period: '2022 - Present' }],
      resumeDoc: { name: 'Elena_Rostova_Resume.pdf', size: '1.6 MB', uploadedDate: '2022-11-15' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Female',
      maritalStatus: 'Married',
      personalEmail: 'elena.rostova.dev@gmail.com',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
      emergencyContact: { name: 'Igor Rostov', phone: '+1 (555) 456-1122', relation: 'Spouse' },
      bankDetails: {
        accountNumber: '•••• •••• 6621',
        rawAccountNumber: '2910 4482 6621',
        bankName: 'Seattle First National Bank',
        ifscCode: 'SFNB000318',
        panNumber: 'ELNRST9182M',
        uanNumber: '100918273645',
        employeeCode: 'DF-ENG-1003'
      }
    },
    salary: {
      basicSalary: 5000,
      hra: 1800,
      standardAllowance: 500,
      performanceBonus: 500,
      lta: 300,
      fixedAllowance: 200,
      allowances: 3300,
      pfDeduction: 380,
      professionalTax: 160,
      otherDeductions: 110,
      deductions: 650,
      grossSalary: 8300,
      netSalary: 7650,
      monthlyWage: 7650,
      yearlyWage: 91800,
      currency: 'USD',
      effectiveDate: '2022-11-15'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 07:30 AM (Seattle, US)',
      activeSessions: [
        { id: 'sess_elena', device: 'Linux / Ubuntu 24.04', ip: '192.168.1.72', location: 'Seattle, US', isCurrent: true }
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
    resume: {
      about: 'Product strategist with 8+ years leading enterprise SaaS products from ideation to scale.',
      whatILove: 'Solving complex user problems through elegant UX and data-driven product roadmap execution.',
      skills: ['Product Strategy', 'Agile Roadmaps', 'User Research', 'Data Analytics', 'Jira', 'SQL'],
      certifications: [{ name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', year: '2021' }],
      education: [{ degree: 'B.S. in Business Information Systems', institution: 'Boston University', year: '2010 - 2014' }],
      experience: [{ title: 'Product Manager', company: 'Dayflow HRMS', period: '2023 - Present' }],
      resumeDoc: { name: 'David_Kim_Resume.pdf', size: '1.2 MB', uploadedDate: '2023-01-10' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Male',
      maritalStatus: 'Single',
      personalEmail: 'david.kim.pm@gmail.com',
      city: 'Boston',
      state: 'Massachusetts',
      country: 'United States',
      emergencyContact: { name: 'Hannah Kim', phone: '+1 (555) 567-3344', relation: 'Sister' },
      bankDetails: {
        accountNumber: '•••• •••• 9918',
        rawAccountNumber: '4918 3918 9918',
        bankName: 'Bank of America',
        ifscCode: 'BOFA000192',
        panNumber: 'DVDKM8192N',
        uanNumber: '100819283746',
        employeeCode: 'DF-PRD-1004'
      }
    },
    salary: {
      basicSalary: 4800,
      hra: 1600,
      standardAllowance: 400,
      performanceBonus: 400,
      lta: 250,
      fixedAllowance: 150,
      allowances: 2800,
      pfDeduction: 360,
      professionalTax: 150,
      otherDeductions: 90,
      deductions: 600,
      grossSalary: 7600,
      netSalary: 7000,
      monthlyWage: 7000,
      yearlyWage: 84000,
      currency: 'USD',
      effectiveDate: '2023-01-10'
    },
    security: {
      emailVerified: true,
      lastLogin: '3 days ago (Boston, US)',
      activeSessions: [
        { id: 'sess_david', device: 'Chrome / macOS', ip: '192.168.1.88', location: 'Boston, US', isCurrent: true }
      ]
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
    resume: {
      about: 'Growth marketing specialist focused on B2B SaaS acquisition funnels, retention, and content lifecycle.',
      whatILove: 'Driving organic pipeline velocity and running high-impact growth experiments.',
      skills: ['Growth Strategy', 'SEO/SEM', 'HubSpot', 'Google Analytics 4', 'Content Marketing', 'Copywriting'],
      certifications: [{ name: 'HubSpot Inbound Marketing Certified', issuer: 'HubSpot', year: '2023' }],
      education: [{ degree: 'B.A. in Integrated Marketing', institution: 'Northwestern University', year: '2015 - 2019' }],
      experience: [{ title: 'Growth Marketing Specialist', company: 'Dayflow HRMS', period: '2024 - Present' }],
      resumeDoc: { name: 'Priya_Sharma_Resume.pdf', size: '1.4 MB', uploadedDate: '2024-02-01' }
    },
    privateInfo: {
      nationality: 'American',
      gender: 'Female',
      maritalStatus: 'Single',
      personalEmail: 'priya.sharma.mkt@gmail.com',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States',
      emergencyContact: { name: 'Raj Sharma', phone: '+1 (555) 678-4455', relation: 'Father' },
      bankDetails: {
        accountNumber: '•••• •••• 3341',
        rawAccountNumber: '5819 2819 3341',
        bankName: 'Midwest Commerce Bank',
        ifscCode: 'MCB0008172',
        panNumber: 'PRYSH8291K',
        uanNumber: '100819384756',
        employeeCode: 'DF-MKT-1005'
      }
    },
    salary: {
      basicSalary: 3800,
      hra: 1200,
      standardAllowance: 350,
      performanceBonus: 250,
      lta: 200,
      fixedAllowance: 100,
      allowances: 2100,
      pfDeduction: 280,
      professionalTax: 100,
      otherDeductions: 70,
      deductions: 450,
      grossSalary: 5900,
      netSalary: 5450,
      monthlyWage: 5450,
      yearlyWage: 65400,
      currency: 'USD',
      effectiveDate: '2024-02-01'
    },
    security: {
      emailVerified: true,
      lastLogin: 'Today at 09:15 AM (Chicago, US)',
      activeSessions: [
        { id: 'sess_priya', device: 'Chrome / macOS Sonoma', ip: '192.168.1.94', location: 'Chicago, US', isCurrent: true }
      ]
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
    employeeName: 'Marcus Vance',
    department: 'Design',
    leaveType: 'Sick Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    days: 1,
    reason: 'Dental surgery and recovery',
    attachment: { name: 'Dental_Clinic_Certificate.pdf', size: '640 KB', type: 'PDF' },
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
    attachment: null,
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
    reason: 'Viral fever and doctor recommended rest',
    attachment: { name: 'Medical_Consultation_DrPatel.pdf', size: '820 KB', type: 'PDF' },
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
    message: 'Priya Sharma submitted a Sick Leave request with Medical Certificate for Aug 25 - Aug 26.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  }
];
