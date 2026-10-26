import type { AiProvider, ApplicationTask, SavedProgram, StudentProfile } from './types';

const PROFILE_KEY = 'unipath.profile';
const SHORTLIST_KEY = 'unipath.shortlist';
const TASKS_KEY = 'unipath.tasks';
const PROVIDER_KEY = 'unipath.provider';
const COUNTRY_KEY = 'unipath.countryFilter';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const emptyProfile = (): StudentProfile => ({
  name: '',
  citizenship: '',
  residence: '',
  educationCountry: '',
  qualification: '',
  percentage: '',
  intendedMajor: '',
  budget: '',
  budgetCurrency: 'PKR',
  preferredDestinations: '',
  sat: false,
  ielts: false,
  toefl: false,
});

export function loadProfile(): StudentProfile {
  return { ...emptyProfile(), ...readJson<Partial<StudentProfile>>(PROFILE_KEY, {}) };
}

export function saveProfile(profile: StudentProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadShortlist(): SavedProgram[] {
  return readJson<SavedProgram[]>(SHORTLIST_KEY, []);
}

export function saveShortlist(programs: SavedProgram[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(programs));
}

export function loadTasks(): ApplicationTask[] {
  const legacy = localStorage.getItem('uniPathTasks');
  if (legacy && !localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, legacy);
  }
  return readJson<ApplicationTask[]>(TASKS_KEY, []);
}

export function saveTasks(tasks: ApplicationTask[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadProvider(): AiProvider {
  const value = localStorage.getItem(PROVIDER_KEY);
  return value === 'nebius' ? 'nebius' : 'gemini';
}

export function saveProvider(provider: AiProvider) {
  localStorage.setItem(PROVIDER_KEY, provider);
}

export function loadCountryFilter(): string {
  return localStorage.getItem(COUNTRY_KEY) || 'all';
}

export function saveCountryFilter(country: string) {
  localStorage.setItem(COUNTRY_KEY, country);
}

export function exportShortlistCsv(programs: SavedProgram[]) {
  const header = ['University', 'Program', 'Country', 'City', 'Degree', 'Eligibility', 'Annual cost', 'Total cost', 'Scholarships'];
  const rows = programs.map((program) => [
    program.university,
    program.program,
    program.country,
    program.city,
    program.degreeLevel,
    program.eligibility,
    String(program.annualCost),
    String(program.totalCost),
    program.scholarships ? 'yes' : 'no',
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n');
}

export function downloadText(filename: string, contents: string, type = 'text/csv') {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function clearAllLocalData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SHORTLIST_KEY);
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(PROVIDER_KEY);
  localStorage.removeItem(COUNTRY_KEY);
  localStorage.removeItem('uniPathTasks');
}
