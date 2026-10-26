import { describe, expect, it } from 'vitest';
import {
  annualEducationCost,
  assessEligibility,
  classifyScholarshipCoverage,
  convertCurrency,
  filterByQuery,
  fullDegreeCost,
  fundingGap,
} from './matching';

describe('affordability', () => {
  it('adds tuition, living, and additional costs for an annual budget', () => {
    expect(annualEducationCost(350000, 200000, 0)).toBe(550000);
  });

  it('multiplies annual cost across program years for a full-degree budget', () => {
    expect(fullDegreeCost(550000, 4)).toBe(2200000);
  });

  it('reports the funding gap after confirmed aid', () => {
    expect(fundingGap(2200000, 500000)).toBe(1700000);
  });

  it('returns missing-rate when an exchange rate is unavailable', () => {
    const result = convertCurrency(1000, 'PKR', 'EUR', { PKR: 280 });
    expect(result.status).toBe('missing-rate');
    expect(result.amount).toBeNull();
  });
});

describe('eligibility', () => {
  it('treats a missing required test as partial eligibility', () => {
    expect(
      assessEligibility({
        requiredTests: ['IELTS'],
        studentTests: [],
        minPercentage: 60,
        studentPercentage: 85,
      }),
    ).toBe('partial');
  });

  it('meets published grade and test requirements', () => {
    expect(
      assessEligibility({
        requiredTests: ['IELTS'],
        studentTests: ['IELTS'],
        minPercentage: 65,
        studentPercentage: 85,
      }),
    ).toBe('meets');
  });
});

describe('scholarships', () => {
  it('classifies full tuition plus stipend as fully funded', () => {
    expect(classifyScholarshipCoverage(100, 30000)).toBe('fully-funded');
  });

  it('classifies tuition-only awards separately from competitive partial aid', () => {
    expect(classifyScholarshipCoverage(100, 0)).toBe('tuition-only');
    expect(classifyScholarshipCoverage(50, 0)).toBe('partial');
  });
});

describe('search', () => {
  it('filters programs by university or program name', () => {
    const results = filterByQuery(
      [
        { university: 'University of Punjab', program: 'BS Computer Science' },
        { university: 'NED University', program: 'BS Software Engineering' },
      ],
      'punjab',
    );
    expect(results).toHaveLength(1);
    expect(results[0].university).toBe('University of Punjab');
  });
});
