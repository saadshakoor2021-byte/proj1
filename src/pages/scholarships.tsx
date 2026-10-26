import React, { useMemo, useState } from 'react';
import { classifyScholarshipCoverage, filterByQuery } from '../lib/matching';
import { Button, Card, Input, Section, Select } from '../ui';

interface ScholarshipRecord {
  id: string;
  name: string;
  provider: string;
  eligibleCitizenship: string[];
  degreeLevel: string[];
  eligibleSubjects: string[];
  academicRequirements: string;
  classification: 'merit' | 'need-based' | 'both';
  tuitionCoverage: number;
  livingStipend: number;
  travelCoverage: number;
  fundingDuration: string;
  applicationDeadline: string;
  requiredDocuments: string[];
  sourceUrl: string;
  verificationStatus: 'official' | 'third-party' | 'illustrative';
  lastVerified: string;
}

const SAMPLE_SCHOLARSHIPS: ScholarshipRecord[] = [
  {
    id: 's1',
    name: 'HEC Need-Based Scholarship',
    provider: 'Higher Education Commission Pakistan',
    eligibleCitizenship: ['Pakistani'],
    degreeLevel: ["Bachelor's", "Master's"],
    eligibleSubjects: ['All subjects'],
    academicRequirements: 'Minimum 60% in intermediate',
    classification: 'need-based',
    tuitionCoverage: 100,
    livingStipend: 30000,
    travelCoverage: 0,
    fundingDuration: '1 year (renewable)',
    applicationDeadline: 'October 15, 2025',
    requiredDocuments: ['CNIC/B-Form', 'Income certificate', 'Intermediate result card', 'Domicile'],
    sourceUrl: 'https://www.hec.gov.pk/',
    verificationStatus: 'official',
    lastVerified: '2025-01-15',
  },
  {
    id: 's2',
    name: 'Merit Scholarship - University of the Punjab',
    provider: 'University of the Punjab',
    eligibleCitizenship: ['Pakistani', 'International'],
    degreeLevel: ["Bachelor's"],
    eligibleSubjects: ['Computer Science', 'Engineering', 'Business'],
    academicRequirements: 'Minimum 80% in intermediate',
    classification: 'merit',
    tuitionCoverage: 50,
    livingStipend: 0,
    travelCoverage: 0,
    fundingDuration: '1 year',
    applicationDeadline: 'July 31, 2025',
    requiredDocuments: ['Intermediate result card', 'Equivalence certificate', 'CNIC'],
    sourceUrl: 'https://pu.edu.pk/',
    verificationStatus: 'official',
    lastVerified: '2025-01-20',
  },
  {
    id: 's3',
    name: 'DAAD Scholarship Germany',
    provider: 'German Academic Exchange Service',
    eligibleCitizenship: ['Pakistani', 'Developing countries'],
    degreeLevel: ["Master's", 'PhD'],
    eligibleSubjects: ['Engineering', 'Natural Sciences', 'Mathematics'],
    academicRequirements: 'Minimum 75% or GPA 2.5/4.0',
    classification: 'merit',
    tuitionCoverage: 100,
    livingStipend: 850,
    travelCoverage: 500,
    fundingDuration: '2 years',
    applicationDeadline: 'October 15, 2025',
    requiredDocuments: ['Degree certificates', 'Transcripts', 'Letter of motivation', 'CV', 'Two reference letters'],
    sourceUrl: 'https://www.daad.de/',
    verificationStatus: 'official',
    lastVerified: '2025-01-10',
  },
  {
    id: 's4',
    name: 'International Need-Based Scholarship',
    provider: 'Various International Universities',
    eligibleCitizenship: ['Pakistani'],
    degreeLevel: ["Bachelor's", "Master's"],
    eligibleSubjects: ['All subjects'],
    academicRequirements: 'Minimum 65% in intermediate + financial need',
    classification: 'need-based',
    tuitionCoverage: 30,
    livingStipend: 15000,
    travelCoverage: 2000,
    fundingDuration: 'Program duration',
    applicationDeadline: 'Varies by institution',
    requiredDocuments: ['Financial statement', 'Academic transcripts', 'Personal essay', 'References'],
    sourceUrl: 'https://www.hec.gov.pk/',
    verificationStatus: 'third-party',
    lastVerified: '2025-02-01',
  },
  {
    id: 's5',
    name: 'COMSATS University Merit Scholarship',
    provider: 'COMSATS University Islamabad',
    eligibleCitizenship: ['Pakistani'],
    degreeLevel: ["Bachelor's"],
    eligibleSubjects: ['Computer Science', 'Engineering', 'Business'],
    academicRequirements: 'Minimum 85% in intermediate',
    classification: 'merit',
    tuitionCoverage: 25,
    livingStipend: 0,
    travelCoverage: 0,
    fundingDuration: '1 year',
    applicationDeadline: 'August 31, 2025',
    requiredDocuments: ['Intermediate result card', 'Equivalence certificate', 'CNIC'],
    sourceUrl: 'https://www.comsats.edu.pk/',
    verificationStatus: 'official',
    lastVerified: '2025-01-25',
  },
];

export function Scholarships() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');
  const [filterCoverage, setFilterCoverage] = useState('all');
  const [selected, setSelected] = useState<ScholarshipRecord | null>(null);

  const filteredScholarships = useMemo(() => {
    return filterByQuery(SAMPLE_SCHOLARSHIPS, searchTerm).filter((scholarship) => {
      const matchesClassification = filterClassification === 'all' || scholarship.classification === filterClassification;
      const coverage = classifyScholarshipCoverage(scholarship.tuitionCoverage, scholarship.livingStipend);
      const matchesCoverage = filterCoverage === 'all' || coverage === filterCoverage || (filterCoverage === 'partial' && coverage !== 'fully-funded');
      return matchesClassification && matchesCoverage;
    });
  }, [searchTerm, filterClassification, filterCoverage]);

  return (
    <div>
      <Section>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Scholarship Finder</h1>
        <p className="mb-8 text-muted-foreground">
          Discover scholarships you may qualify for based on your academic profile and financial need.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input placeholder="Search scholarships..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          <Select
            options={[
              { label: 'All types', value: 'all' },
              { label: 'Merit-based', value: 'merit' },
              { label: 'Need-based', value: 'need-based' },
            ]}
            value={filterClassification}
            onChange={setFilterClassification}
          />
          <Select
            options={[
              { label: 'All coverage', value: 'all' },
              { label: 'Fully funded', value: 'fully-funded' },
              { label: 'Partial', value: 'partial' },
              { label: 'Tuition only', value: 'tuition-only' },
            ]}
            value={filterCoverage}
            onChange={setFilterCoverage}
          />
          <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterClassification('all'); setFilterCoverage('all'); }}>
            Clear
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredScholarships.length === 0 ? (
            <Card>
              <p className="text-muted-foreground">No scholarships found. Try adjusting your filters.</p>
            </Card>
          ) : (
            filteredScholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{scholarship.name}</h3>
                    <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{scholarship.tuitionCoverage}% tuition coverage</p>
                    {scholarship.livingStipend > 0 && (
                      <p className="text-sm text-muted-foreground">Living stipend: {scholarship.livingStipend.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rounded bg-primary/10 px-2 py-1 font-medium text-primary">{scholarship.classification}</span>
                  <span className="rounded bg-muted px-2 py-1 text-muted-foreground">{scholarship.verificationStatus}</span>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>{scholarship.eligibleCitizenship.join(', ')}</p>
                  <p>{scholarship.degreeLevel.join(', ')}</p>
                  <p>{scholarship.eligibleSubjects.join(', ')}</p>
                  <p className="mt-2">{scholarship.academicRequirements}</p>
                  <p className="mt-2 font-medium text-foreground">Deadline: {scholarship.applicationDeadline}</p>
                </div>
                <Button variant="link" className="mt-3" onClick={() => setSelected(scholarship)}>
                  View details
                </Button>
              </Card>
            ))
          )}
        </div>
      </Section>

      {selected && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <Card className="max-h-[90vh] max-w-lg overflow-y-auto">
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-muted-foreground">{selected.provider}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>Duration: {selected.fundingDuration}</p>
              <p>Last verified: {selected.lastVerified}</p>
              <p>
                Source:{' '}
                <a className="text-primary underline" href={selected.sourceUrl} target="_blank" rel="noreferrer">
                  {selected.sourceUrl}
                </a>
              </p>
              <h3 className="pt-2 font-medium">Required documents</h3>
              <ul className="list-disc pl-5">
                {selected.requiredDocuments.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Scholarships;
