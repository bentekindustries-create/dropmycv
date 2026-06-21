// Curated, human-written context for the role/location landing pages so they read
// as genuinely useful rather than thin programmatic doorways. Keyed by role name
// (lower-cased). Pages accept arbitrary slugs, so anything not here falls back to a
// generic-but-honest treatment (see roleProfileFor).

export interface RoleProfile {
  blurb: string; // one sentence on what these roles focus on
  skills: string[]; // common skills/keywords that appear in listings
  sectors: string[]; // sectors that commonly hire for the role
  titles: string[]; // example title variants seen in listings
  related: string[]; // adjacent roles (used for same-city internal links)
}

export const ROLE_PROFILES: Record<string, RoleProfile> = {
  "software engineer": {
    blurb: "Building and maintaining software — most listings care more about what you've shipped than the languages you list.",
    skills: ["JavaScript / TypeScript", "Python", "React", "Node.js", "AWS / Cloud", "CI/CD", "SQL", "REST / GraphQL APIs"],
    sectors: ["Technology & SaaS", "Fintech", "E-commerce", "Government", "Healthtech"],
    titles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Developer"],
    related: ["Data Analyst", "Project Manager", "Mechanical Engineer"],
  },
  "marketing manager": {
    blurb: "Owning campaigns and growth — listings increasingly screen for analytics tooling alongside creative skills.",
    skills: ["SEO", "Content Marketing", "Google Analytics (GA4)", "Social Media", "Email Marketing", "Paid Media / SEM", "Marketing Automation", "Brand Strategy"],
    sectors: ["Retail & FMCG", "Technology", "Agencies", "Hospitality", "Not-for-profit"],
    titles: ["Digital Marketing Manager", "Brand Manager", "Growth Marketing Manager", "Marketing Coordinator"],
    related: ["Business Development Manager", "Graphic Designer", "Sales Representative"],
  },
  "registered nurse": {
    blurb: "Frontline clinical care — current registration and demonstrated patient-care experience matter most.",
    skills: ["Patient Care", "Clinical Assessment", "Medication Administration", "Electronic Medical Records", "Infection Control", "Care Planning", "AHPRA Registration"],
    sectors: ["Public Hospitals", "Private Hospitals", "Aged Care", "Community Health", "GP Clinics"],
    titles: ["Clinical Nurse", "Enrolled Nurse", "Registered Nurse – Aged Care", "Theatre Nurse"],
    related: ["Accountant", "Administration Assistant", "Customer Service"],
  },
  "accountant": {
    blurb: "Keeping the books accurate and compliant — software fluency and a CPA/CA pathway are common asks.",
    skills: ["Financial Reporting", "Reconciliations", "BAS / GST", "Xero", "MYOB", "Excel", "Accounts Payable / Receivable", "CPA / CA"],
    sectors: ["Professional Services", "Construction", "Retail", "Government", "Manufacturing"],
    titles: ["Assistant Accountant", "Senior Accountant", "Management Accountant", "Tax Accountant"],
    related: ["Financial Analyst", "Administration Assistant", "Operations Manager"],
  },
  "project manager": {
    blurb: "Delivering work on time and on budget — listings reward evidence of scale (budgets, teams, timelines) over generic duties.",
    skills: ["Stakeholder Management", "Agile / Scrum", "Budget Management", "Risk Management", "PRINCE2", "Project Scheduling", "Jira", "Change Management"],
    sectors: ["Construction", "IT", "Government", "Engineering", "Finance"],
    titles: ["IT Project Manager", "Construction Project Manager", "Program Manager", "Delivery Manager"],
    related: ["Operations Manager", "Business Development Manager", "Software Engineer"],
  },
  "data analyst": {
    blurb: "Turning data into decisions — SQL plus a BI tool is the baseline most listings expect.",
    skills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Data Visualisation", "Statistics", "ETL"],
    sectors: ["Finance", "Technology", "Retail", "Healthcare", "Government"],
    titles: ["Business Intelligence Analyst", "Reporting Analyst", "Insights Analyst", "Data Scientist"],
    related: ["Software Engineer", "Financial Analyst", "Accountant"],
  },
  "electrician": {
    blurb: "Installing and maintaining electrical systems — a current licence and compliance knowledge are non-negotiable.",
    skills: ["Electrical Installation", "Fault Finding", "Wiring", "Switchboards", "Electrical Licence", "AS3000 Compliance", "Maintenance", "Test & Tag"],
    sectors: ["Construction", "Mining", "Manufacturing", "Facilities", "Renewables"],
    titles: ["A-Grade Electrician", "Industrial Electrician", "Maintenance Electrician", "Electrical Apprentice"],
    related: ["Plumber", "Mechanical Engineer", "Operations Manager"],
  },
  "sales representative": {
    blurb: "Winning and growing accounts — listings look for a track record against targets and CRM discipline.",
    skills: ["B2B Sales", "Account Management", "CRM (Salesforce)", "Lead Generation", "Negotiation", "Pipeline Management", "Cold Calling"],
    sectors: ["FMCG", "Technology", "Pharmaceutical", "Manufacturing", "Media"],
    titles: ["Account Executive", "Business Development Representative", "Territory Manager", "Sales Consultant"],
    related: ["Business Development Manager", "Customer Service", "Marketing Manager"],
  },
  "administration assistant": {
    blurb: "Keeping an office running — reliability, software fluency and clear communication carry these listings.",
    skills: ["Data Entry", "Microsoft Office", "Calendar Management", "Customer Service", "Document Management", "Scheduling", "Reception"],
    sectors: ["Healthcare", "Construction", "Education", "Government", "Professional Services"],
    titles: ["Office Administrator", "Executive Assistant", "Receptionist", "Administration Officer"],
    related: ["Customer Service", "Accountant", "Human Resources Manager"],
  },
  "customer service": {
    blurb: "Looking after customers across phone, email and chat — empathy plus system fluency wins these roles.",
    skills: ["Customer Support", "CRM", "Complaint Resolution", "Phone / Email Support", "Data Entry", "Problem Solving", "Zendesk"],
    sectors: ["Retail", "Telecommunications", "Banking", "Utilities", "E-commerce"],
    titles: ["Customer Service Representative", "Call Centre Operator", "Customer Support Specialist", "Client Services Officer"],
    related: ["Administration Assistant", "Sales Representative", "Operations Manager"],
  },
  "business development manager": {
    blurb: "Opening new revenue — listings reward demonstrable pipeline growth and strategic relationship-building.",
    skills: ["B2B Sales", "Lead Generation", "Account Management", "Negotiation", "CRM (Salesforce)", "Strategic Partnerships", "Pipeline Management"],
    sectors: ["Technology", "Professional Services", "Manufacturing", "Construction", "Finance"],
    titles: ["Sales Manager", "Account Director", "Partnerships Manager", "Commercial Manager"],
    related: ["Sales Representative", "Marketing Manager", "Operations Manager"],
  },
  "graphic designer": {
    blurb: "Crafting visual identity and assets — a strong portfolio plus Adobe (and increasingly Figma) fluency is expected.",
    skills: ["Adobe Photoshop", "Illustrator", "InDesign", "Branding", "Typography", "Figma", "Layout Design", "UI Design"],
    sectors: ["Agencies", "Retail", "Media", "Technology", "Publishing"],
    titles: ["Senior Graphic Designer", "UX / UI Designer", "Web Designer", "Brand Designer"],
    related: ["Marketing Manager", "Software Engineer", "Business Development Manager"],
  },
  "mechanical engineer": {
    blurb: "Designing and maintaining mechanical systems — CAD fluency and project delivery evidence anchor these listings.",
    skills: ["SolidWorks", "AutoCAD", "Mechanical Design", "Project Management", "Manufacturing", "FEA", "Maintenance", "CAD"],
    sectors: ["Manufacturing", "Mining", "Defence", "Automotive", "Energy"],
    titles: ["Design Engineer", "Maintenance Engineer", "Project Engineer", "Mechanical Design Engineer"],
    related: ["Project Manager", "Electrician", "Operations Manager"],
  },
  "financial analyst": {
    blurb: "Modelling and forecasting to guide decisions — strong Excel and commercial judgement lead these listings.",
    skills: ["Financial Modelling", "Excel", "Forecasting", "Budgeting", "Power BI", "Variance Analysis", "SAP", "Reporting"],
    sectors: ["Banking", "Insurance", "Professional Services", "Technology", "Government"],
    titles: ["Commercial Analyst", "FP&A Analyst", "Investment Analyst", "Management Accountant"],
    related: ["Accountant", "Data Analyst", "Operations Manager"],
  },
  "human resources manager": {
    blurb: "Looking after people, policy and hiring — listings want employee-relations depth and HRIS familiarity.",
    skills: ["Recruitment", "Employee Relations", "HR Policy", "Performance Management", "HRIS", "Workplace Relations", "Onboarding"],
    sectors: ["Professional Services", "Healthcare", "Manufacturing", "Government", "Retail"],
    titles: ["HR Business Partner", "People & Culture Manager", "HR Advisor", "Talent Acquisition Manager"],
    related: ["Operations Manager", "Administration Assistant", "Business Development Manager"],
  },
  "operations manager": {
    blurb: "Running the day-to-day at scale — listings reward process improvement and clear leadership results.",
    skills: ["Operations Management", "Process Improvement", "Team Leadership", "Budget Management", "Supply Chain", "KPIs", "Lean / Six Sigma"],
    sectors: ["Logistics", "Manufacturing", "Retail", "Healthcare", "Hospitality"],
    titles: ["General Manager", "Supply Chain Manager", "Site Manager", "Operations Lead"],
    related: ["Project Manager", "Business Development Manager", "Human Resources Manager"],
  },
  "plumber": {
    blurb: "Installing and maintaining water and gas systems — a current licence and compliance knowledge are essential.",
    skills: ["Plumbing Installation", "Maintenance", "Pipe Fitting", "Drainage", "Gas Fitting", "Plumbing Licence", "Compliance", "Roofing"],
    sectors: ["Construction", "Facilities", "Maintenance", "Mining", "Residential"],
    titles: ["Maintenance Plumber", "Licensed Plumber", "Gas Fitter", "Plumbing Apprentice"],
    related: ["Electrician", "Mechanical Engineer", "Operations Manager"],
  },
  "teacher": {
    blurb: "Planning and delivering learning — current registration and classroom evidence carry these listings.",
    skills: ["Lesson Planning", "Classroom Management", "Curriculum Development", "Assessment", "Student Engagement", "Differentiated Learning", "Teaching Registration"],
    sectors: ["Primary Schools", "Secondary Schools", "Early Childhood", "TAFE / Vocational", "Tutoring"],
    titles: ["Primary School Teacher", "Secondary Teacher", "Early Childhood Educator", "Relief Teacher"],
    related: ["Administration Assistant", "Human Resources Manager", "Customer Service"],
  },
};

export function roleProfileFor(role: string): RoleProfile | null {
  return ROLE_PROFILES[role.toLowerCase()] ?? null;
}
