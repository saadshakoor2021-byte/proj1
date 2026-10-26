export type PageId =
  | 'home'
  | 'onboarding'
  | 'universities'
  | 'scholarships'
  | 'counselor'
  | 'planner'
  | 'shortlist'
  | 'profile'
  | 'settings';

export type Eligibility = 'meets' | 'partial' | 'doesNotMeet' | 'unknown';
export type Competitiveness = 'strong' | 'competitive' | 'ambitious' | 'unsuitable';
export type ApplicationStatus =
  | 'considering'
  | 'researching'
  | 'preparing'
  | 'ready'
  | 'submitted'
  | 'decision'
  | 'accepted'
  | 'rejected';
export type AiProvider = 'gemini' | 'nebius';

export interface StudentProfile {
  name: string;
  citizenship: string;
  residence: string;
  educationCountry: string;
  qualification: string;
  percentage: string;
  intendedMajor: string;
  budget: string;
  budgetCurrency: string;
  preferredDestinations: string;
  sat: boolean;
  ielts: boolean;
  toefl: boolean;
}

export interface SavedProgram {
  id: string;
  university: string;
  program: string;
  country: string;
  city: string;
  degreeLevel: string;
  eligibility: Eligibility;
  annualCost: number;
  totalCost: number;
  scholarships: boolean;
  matchingReason: string;
}

export interface ApplicationTask {
  id: string;
  university: string;
  program: string;
  country: string;
  intake: string;
  deadline: string;
  status: ApplicationStatus;
  documents: string[];
  tests: string[];
  scholarshipDeadline?: string;
  notes?: string;
}
