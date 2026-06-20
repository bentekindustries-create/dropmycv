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
  profile: CvProfile;
}
