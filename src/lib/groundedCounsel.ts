export interface GroundedAnswer {
  content: string;
  sources: string[];
  uncertainty?: string;
}

export function getGroundedResponse(question: string): GroundedAnswer {
  const lower = question.toLowerCase();

  if (lower.includes('85%') || lower.includes('fsc') || lower.includes('pre-engineering')) {
    return {
      content:
        'With 85% in FSc Pre-Engineering, you have strong eligibility for many BS Computer Science and Software Engineering programs in Pakistan. Programs at University of the Punjab, NED University, and COMSATS typically publish intermediate thresholds in the 65–80% range, so this profile is competitive. For more selective options, look at merit scholarships as well. Would you like specific program matches based on your saved profile?',
      sources: ['University admission requirements (official)', 'Program eligibility data'],
      uncertainty: 'Exact requirements vary by institution and year; verify with individual universities.',
    };
  }

  if (lower.includes('15 lakh') || lower.includes('budget') || lower.includes('pkr')) {
    return {
      content:
        'With an annual budget of PKR 15 lakh, several Pakistani universities can fit after tuition and living costs, including University of the Punjab, NED University, and University of Karachi on the sample dataset. Public German programs in the sample have no tuition and living-cost estimates around PKR 120,000 per year. UK and US options in this prototype would usually exceed that budget without substantial scholarships.',
      sources: ['University tuition data', 'Living cost estimates'],
      uncertainty: 'Costs vary by program and city; actual expenses may differ.',
    };
  }

  if (lower.includes('italian') || lower.includes('italy')) {
    return {
      content:
        "Italian bachelor's admissions with Pakistani qualifications usually require HEC equivalence, plus English or Italian language evidence depending on the teaching language. Application routes often include university portals and, in some cases, pre-enrolment. Requirements differ widely by institution, so confirm the current cycle with the university and HEC.",
      sources: ['Italian university admissions', 'HEC equivalence information'],
      uncertainty: 'Requirements vary significantly by institution and program.',
    };
  }

  if (lower.includes('scholarship') || lower.includes('funding')) {
    return {
      content:
        "Common fits for Pakistani bachelor's applicants in this dataset include HEC need-based awards, university merit scholarships (often 25–50% tuition for high intermediate percentages), and later postgraduate options such as DAAD. Amounts depend on need, merit, and the specific institution.",
      sources: ['HEC scholarship programs', 'University merit scholarship data'],
      uncertainty: 'Scholarship availability and amounts vary by session and applicant pool.',
    };
  }

  if (lower.includes('why did this') || lower.includes('match') || lower.includes('shortlist')) {
    return {
      content:
        'Matching uses four dimensions: published eligibility, competitiveness of the academic profile, affordability against your budget, and application readiness (tests, documents, deadlines). Each card should show the evidence used. Admission decisions still belong to the university.',
      sources: ['Matching engine criteria', 'Program requirement data'],
      uncertainty: 'Matching is evidence-based but not a guarantee of admission.',
    };
  }

  if (lower.includes('no ielts') || lower.includes('without ielts')) {
    return {
      content:
        'Many Pakistani universities do not require IELTS for local programs. Some international options accept alternatives such as prior English-medium education or institutional tests. Always confirm the current English-language policy with the target university.',
      sources: ['University English requirements', 'Alternative language proficiency options'],
      uncertainty: 'English language policies change; verify with the target institution.',
    };
  }

  return {
    content:
      "I can help with university admissions, eligibility, scholarships, and application planning. Try a specific question such as: 'I have 85% in FSc Pre-Engineering, which programs should I explore?' or 'My budget is PKR 15 lakh, which options are affordable?'",
    sources: [],
    uncertainty: 'More profile detail produces more tailored guidance.',
  };
}
