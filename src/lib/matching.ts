import type { Eligibility } from './types';

export function annualEducationCost(tuition: number, livingCosts: number, additional = 0) {
  return tuition + livingCosts + additional;
}

export function fullDegreeCost(annual: number, years: number) {
  return annual * years;
}

export function fundingGap(estimatedCost: number, confirmedFunding: number) {
  return estimatedCost - confirmedFunding;
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  ratesToUsd: Record<string, number>,
): { amount: number | null; status: 'ok' | 'missing-rate' } {
  if (from === to) return { amount, status: 'ok' };
  const fromRate = ratesToUsd[from];
  const toRate = ratesToUsd[to];
  if (fromRate == null || toRate == null) {
    return { amount: null, status: 'missing-rate' };
  }
  return { amount: (amount / fromRate) * toRate, status: 'ok' };
}

export function classifyScholarshipCoverage(tuitionCoverage: number, livingStipend: number) {
  if (tuitionCoverage >= 100 && livingStipend > 0) return 'fully-funded' as const;
  if (tuitionCoverage >= 100) return 'tuition-only' as const;
  return 'partial' as const;
}

export function assessEligibility(args: {
  requiredTests: string[];
  studentTests: string[];
  minPercentage?: number;
  studentPercentage?: number;
}): Eligibility {
  const missingTests = args.requiredTests.filter((test) => !args.studentTests.includes(test));
  const percentageKnown = args.minPercentage != null && args.studentPercentage != null;
  const meetsGrades = !percentageKnown || args.studentPercentage! >= args.minPercentage!;

  if (missingTests.length > 0 && !meetsGrades) return 'doesNotMeet';
  if (missingTests.length > 0) return 'partial';
  if (!percentageKnown) return 'unknown';
  return meetsGrades ? 'meets' : 'doesNotMeet';
}

export function filterByQuery<T extends { university?: string; program?: string; name?: string; provider?: string }>(
  items: T[],
  query: string,
) {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    [item.university, item.program, item.name, item.provider]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(needle)),
  );
}
