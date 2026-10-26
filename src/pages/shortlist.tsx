import React, { useMemo, useState } from 'react';
import { downloadText, exportShortlistCsv, loadShortlist, saveShortlist } from '../lib/storage';
import type { Eligibility, SavedProgram } from '../lib/types';
import { Button, Card, Input, Section, Select } from '../ui';

export function MyShortlist() {
  const [shortlist, setShortlist] = useState<SavedProgram[]>(loadShortlist);
  const [filterEligibility, setFilterEligibility] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'cost' | 'name'>('relevance');
  const [draft, setDraft] = useState({
    university: '',
    program: '',
    degreeLevel: "Bachelor's",
    country: 'Pakistan',
    city: '',
  });
  const [compare, setCompare] = useState(false);

  const persist = (next: SavedProgram[]) => {
    setShortlist(next);
    saveShortlist(next);
  };

  const sortedPrograms = useMemo(() => {
    const filtered = shortlist.filter((program) => filterEligibility === 'all' || program.eligibility === filterEligibility);
    return [...filtered].sort((a, b) => {
      if (sortBy === 'cost') return a.annualCost - b.annualCost;
      if (sortBy === 'name') return a.university.localeCompare(b.university);
      return 0;
    });
  }, [shortlist, filterEligibility, sortBy]);

  const addProgram = () => {
    if (!draft.university.trim() || !draft.program.trim()) return;
    persist([
      ...shortlist,
      {
        id: Date.now().toString(),
        university: draft.university,
        program: draft.program,
        country: draft.country,
        city: draft.city || 'Not specified',
        degreeLevel: draft.degreeLevel,
        eligibility: 'unknown',
        annualCost: 0,
        totalCost: 0,
        scholarships: false,
        matchingReason: 'Manually added to shortlist',
      },
    ]);
    setDraft({ university: '', program: '', degreeLevel: "Bachelor's", country: 'Pakistan', city: '' });
  };

  return (
    <div>
      <Section>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">My Shortlist</h1>
        <p className="mb-6 text-muted-foreground">Save universities and compare your options.</p>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
              { label: 'Cost (low to high)', value: 'cost' },
              { label: 'Name', value: 'name' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as 'relevance' | 'cost' | 'name')}
          />
          <Button variant="outline" onClick={() => persist([])}>Clear shortlist</Button>
          <Button variant="outline" onClick={() => downloadText('unipath-shortlist.csv', exportShortlistCsv(shortlist))}>
            Export CSV
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input placeholder="University name" value={draft.university} onChange={(event) => setDraft({ ...draft, university: event.target.value })} />
          <Input placeholder="Program name" value={draft.program} onChange={(event) => setDraft({ ...draft, program: event.target.value })} />
          <Select
            options={[{ label: "Bachelor's", value: "Bachelor's" }, { label: "Master's", value: "Master's" }]}
            value={draft.degreeLevel}
            onChange={(value) => setDraft({ ...draft, degreeLevel: value })}
          />
          <Select
            options={[{ label: 'Pakistan', value: 'Pakistan' }, { label: 'Germany', value: 'Germany' }, { label: 'Italy', value: 'Italy' }]}
            value={draft.country}
            onChange={(value) => setDraft({ ...draft, country: value })}
          />
          <Input placeholder="City" value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} />
          <Button variant="primary" onClick={addProgram}>Add to shortlist</Button>
        </div>

        {sortedPrograms.length === 0 ? (
          <Card>
            <p className="text-muted-foreground">No programs saved. Search universities and save your favorites.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedPrograms.map((program) => (
              <Card key={program.id}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{program.university} — {program.program}</h3>
                    <p className="text-sm text-muted-foreground">{program.city}, {program.country}</p>
                    <p className="text-xs text-muted-foreground">Degree: {program.degreeLevel}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{program.annualCost.toLocaleString()} PKR/year</p>
                    <p className="text-xs text-muted-foreground">{program.totalCost.toLocaleString()} PKR total</p>
                  </div>
                </div>
                <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${program.eligibility === 'meets' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {program.eligibility as Eligibility}
                </span>
                <p className="mb-3 mt-2 text-xs text-muted-foreground">{program.matchingReason}</p>
                <Button variant="link" className="text-destructive" onClick={() => persist(shortlist.filter((item) => item.id !== program.id))}>
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        )}

        {shortlist.length > 0 && shortlist.length <= 4 && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-medium">Comparison ready</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              You have {shortlist.length} program(s) saved. Compare eligibility, costs, and scholarships side-by-side.
            </p>
            <Button variant="primary" onClick={() => setCompare(true)}>Compare programs</Button>
          </div>
        )}

        {shortlist.length > 4 && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            You have {shortlist.length} programs saved. Remove some to enable comparison view (maximum 4).
          </div>
        )}
      </Section>

      {compare && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-black/30 p-4">
          <Card className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-xl font-semibold">Program comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="p-2">Field</th>
                    {shortlist.slice(0, 4).map((program) => (
                      <th key={program.id} className="p-2">{program.university}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Program', (p: SavedProgram) => p.program],
                    ['Country', (p: SavedProgram) => `${p.city}, ${p.country}`],
                    ['Degree', (p: SavedProgram) => p.degreeLevel],
                    ['Eligibility', (p: SavedProgram) => p.eligibility],
                    ['Annual cost', (p: SavedProgram) => `${p.annualCost.toLocaleString()} PKR`],
                    ['Total cost', (p: SavedProgram) => `${p.totalCost.toLocaleString()} PKR`],
                    ['Scholarships', (p: SavedProgram) => (p.scholarships ? 'Yes' : 'No')],
                  ].map(([label, getter]) => (
                    <tr key={String(label)} className="border-t border-border">
                      <td className="p-2 font-medium">{label as string}</td>
                      {shortlist.slice(0, 4).map((program) => (
                        <td key={program.id} className="p-2">{(getter as (p: SavedProgram) => string)(program)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setCompare(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MyShortlist;
