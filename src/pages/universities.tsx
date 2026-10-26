import React, { useMemo, useState } from 'react';
import { useApp } from '../context';
import { loadShortlist, saveShortlist } from '../lib/storage';
import { filterByQuery } from '../lib/matching';
import type { Eligibility, SavedProgram } from '../lib/types';
import { Button, Card, Input, Section, Select } from '../ui';

interface UniversityProgram {
  id: string;
  university: string;
  city: string;
  country: string;
  program: string;
  degreeLevel: string;
  duration: string;
  tuition: number;
  livingCosts: number;
  totalCost: number;
  annualCost: number;
  eligibility: Eligibility;
  competitiveness: 'strong' | 'competitive' | 'ambitious' | 'unsuitable';
  scholarships: boolean;
  deadline: string;
  intake: string;
  satRequired: boolean;
  ieltsRequired: boolean;
  toeflRequired: boolean;
  source: string;
}

const SAMPLE_UNIVERSITIES: UniversityProgram[] = [
  {
    id: 'u1',
    university: 'University of the Punjab',
    city: 'Lahore',
    country: 'Pakistan',
    program: 'BS Computer Science',
    degreeLevel: "Bachelor's",
    duration: '4 years',
    tuition: 350000,
    livingCosts: 200000,
    totalCost: 2200000,
    annualCost: 550000,
    eligibility: 'meets',
    competitiveness: 'strong',
    scholarships: true,
    deadline: 'July 15, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: false,
    toeflRequired: false,
    source: 'Official PU Admissions',
  },
  {
    id: 'u2',
    university: 'NED University of Engineering',
    city: 'Karachi',
    country: 'Pakistan',
    program: 'BS Software Engineering',
    degreeLevel: "Bachelor's",
    duration: '4 years',
    tuition: 420000,
    livingCosts: 220000,
    totalCost: 2600000,
    annualCost: 640000,
    eligibility: 'meets',
    competitiveness: 'strong',
    scholarships: true,
    deadline: 'July 31, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: false,
    toeflRequired: false,
    source: 'Official NED Admissions',
  },
  {
    id: 'u3',
    university: 'University of Karachi',
    city: 'Karachi',
    country: 'Pakistan',
    program: 'BS Electrical Engineering',
    degreeLevel: "Bachelor's",
    duration: '4 years',
    tuition: 380000,
    livingCosts: 210000,
    totalCost: 2450000,
    annualCost: 590000,
    eligibility: 'meets',
    competitiveness: 'strong',
    scholarships: false,
    deadline: 'August 10, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: false,
    toeflRequired: false,
    source: 'Official KU Admissions',
  },
  {
    id: 'u4',
    university: 'COMSATS University Islamabad',
    city: 'Islamabad',
    country: 'Pakistan',
    program: 'BS Computer Science',
    degreeLevel: "Bachelor's",
    duration: '4 years',
    tuition: 450000,
    livingCosts: 250000,
    totalCost: 2800000,
    annualCost: 700000,
    eligibility: 'meets',
    competitiveness: 'competitive',
    scholarships: true,
    deadline: 'August 15, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: true,
    toeflRequired: true,
    source: 'Official COMSATS Admissions',
  },
  {
    id: 'u5',
    university: 'University of Europe',
    city: 'Berlin',
    country: 'Germany',
    program: 'BS Computer Science',
    degreeLevel: "Bachelor's",
    duration: '3 years',
    tuition: 0,
    livingCosts: 120000,
    totalCost: 360000,
    annualCost: 120000,
    eligibility: 'partial',
    competitiveness: 'ambitious',
    scholarships: true,
    deadline: 'July 15, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: true,
    toeflRequired: false,
    source: 'DAAD / University Website',
  },
  {
    id: 'u6',
    university: 'University of Karachi',
    city: 'Karachi',
    country: 'Pakistan',
    program: 'BS Business Administration',
    degreeLevel: "Bachelor's",
    duration: '4 years',
    tuition: 300000,
    livingCosts: 180000,
    totalCost: 1920000,
    annualCost: 480000,
    eligibility: 'meets',
    competitiveness: 'strong',
    scholarships: false,
    deadline: 'July 20, 2025',
    intake: 'Fall',
    satRequired: false,
    ieltsRequired: false,
    toeflRequired: false,
    source: 'Official KU Admissions',
  },
];

function toSavedProgram(program: UniversityProgram): SavedProgram {
  return {
    id: program.id,
    university: program.university,
    program: program.program,
    country: program.country,
    city: program.city,
    degreeLevel: program.degreeLevel,
    eligibility: program.eligibility,
    annualCost: program.annualCost,
    totalCost: program.totalCost,
    scholarships: program.scholarships,
    matchingReason: `${program.eligibility} eligibility, ${program.competitiveness} competitiveness, source: ${program.source}`,
  };
}

export function FindUniversities() {
  const { countryFilter, setCountryFilter } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState('all');
  const [filterEligibility, setFilterEligibility] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'cost' | 'name'>('relevance');
  const [shortlist, setShortlist] = useState(loadShortlist);
  const [selected, setSelected] = useState<UniversityProgram | null>(null);

  const sortedResults = useMemo(() => {
    const filtered = filterByQuery(SAMPLE_UNIVERSITIES, searchTerm).filter((program) => {
      const matchesCountry = countryFilter === 'all' || program.country === countryFilter;
      const matchesDegree = filterDegree === 'all' || program.degreeLevel === filterDegree;
      const matchesEligibility = filterEligibility === 'all' || program.eligibility === filterEligibility;
      return matchesCountry && matchesDegree && matchesEligibility;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'cost') return a.totalCost - b.totalCost;
      if (sortBy === 'name') return a.university.localeCompare(b.university);
      return 0;
    });
  }, [searchTerm, countryFilter, filterDegree, filterEligibility, sortBy]);

  const saveProgram = (program: UniversityProgram) => {
    const next = shortlist.some((item) => item.id === program.id)
      ? shortlist
      : [...shortlist, toSavedProgram(program)];
    setShortlist(next);
    saveShortlist(next);
  };

  return (
    <div>
      <Section>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Find Universities</h1>
        <p className="mb-8 text-muted-foreground">
          Search for universities and programs that match your qualifications and budget.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Input
            placeholder="Search university or program..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            options={[
              { label: 'All countries', value: 'all' },
              { label: 'Pakistan', value: 'Pakistan' },
              { label: 'Germany', value: 'Germany' },
              { label: 'Italy', value: 'Italy' },
              { label: 'United Kingdom', value: 'United Kingdom' },
              { label: 'United States', value: 'United States' },
              { label: 'Canada', value: 'Canada' },
              { label: 'Saudi Arabia', value: 'Saudi Arabia' },
            ]}
            value={countryFilter}
            onChange={setCountryFilter}
          />
          <Select
            options={[
              { label: 'All degrees', value: 'all' },
              { label: "Bachelor's", value: "Bachelor's" },
              { label: "Master's", value: "Master's" },
            ]}
            value={filterDegree}
            onChange={setFilterDegree}
          />
          <Select
            options={[
              { label: 'All eligibility', value: 'all' },
              { label: 'Meets requirements', value: 'meets' },
              { label: 'Partial eligibility', value: 'partial' },
              { label: 'Does not meet', value: 'doesNotMeet' },
            ]}
            value={filterEligibility}
            onChange={setFilterEligibility}
          />
          <Select
            options={[
              { label: 'Relevance', value: 'relevance' },
              { label: 'Cost', value: 'cost' },
              { label: 'Name', value: 'name' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as 'relevance' | 'cost' | 'name')}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCountryFilter('all');
              setFilterDegree('all');
              setFilterEligibility('all');
            }}
          >
            Clear
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {sortedResults.length === 0 ? (
            <Card>
              <p className="text-muted-foreground">No programs found. Try adjusting your search filters.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedResults.map((program) => (
                <Card key={program.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">
                        {program.university} — {program.program}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {program.city}, {program.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{program.annualCost.toLocaleString()} PKR/year</p>
                      <p className="text-xs text-muted-foreground">{program.degreeLevel}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${program.eligibility === 'meets' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {program.eligibility}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Competitiveness: {program.competitiveness}
                    {program.scholarships ? ' · Scholarships available' : ''}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(program)}>
                      View details
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => saveProgram(program)}>
                      Save
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>

      {selected && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <Card className="max-w-lg">
            <h2 className="text-xl font-semibold">{selected.university}</h2>
            <p className="text-muted-foreground">{selected.program}</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>Location: {selected.city}, {selected.country}</p>
              <p>Duration: {selected.duration} · Intake: {selected.intake}</p>
              <p>Tuition: {selected.tuition.toLocaleString()} PKR</p>
              <p>Living costs: {selected.livingCosts.toLocaleString()} PKR</p>
              <p>Full-degree estimate: {selected.totalCost.toLocaleString()} PKR</p>
              <p>Deadline: {selected.deadline}</p>
              <p>Source: {selected.source}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="primary" onClick={() => { saveProgram(selected); setSelected(null); }}>Save to shortlist</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FindUniversities;
