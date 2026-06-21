export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  url: string;
  created: string;
  matchScore?: number;
  matchReason?: string;
  matchedSkills?: string[];
}

export interface CvProfile {
  jobTitles: string[];
  skills: string[];
  industry: string;
  yearsExperience: string;
  location: string;
  experienceLevel: string;
}

export interface MatchResult {
  jobs: JobMatch[];
  directJobs?: JobMatch[];
  profile: CvProfile;
}

export interface ApplicationPack {
  role: { title: string; company: string };
  fitSummary: string; // positioning angle — why this candidate fits THIS role
  cvTweaks: { after: string; note?: string }[]; // tailored bullet rewrites for this role
  coverLetter: string; // full draft; paragraphs separated by blank lines
  atsKeywords: string[]; // keywords to weave in for this specific role
  interviewQuestions: { question: string; angle: string }[];
  applicationTips: string[];
}

export interface CvReview {
  overallScore: number; // 0-100
  verdict: string; // one-line summary
  strengths: string[];
  improvements: { issue: string; fix: string }[];
  atsKeywords: { present: string[]; missing: string[] };
  rewrites: { before: string; after: string }[];
  topPriorities: string[];
}
