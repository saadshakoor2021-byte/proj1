import React, { useEffect, useState } from 'react';
import { clearAllLocalData, downloadText, exportShortlistCsv, loadProvider, loadShortlist, saveProvider } from '../lib/storage';
import type { AiProvider } from '../lib/types';
import { Button, Card, Section, Select } from '../ui';

export function Settings() {
  const [provider, setProvider] = useState<AiProvider>(loadProvider);
  const [status, setStatus] = useState({ gemini: false, nebius: false });

  useEffect(() => {
    void fetch('/api/ai/status')
      .then((response) => (response.ok ? response.json() : { gemini: false, nebius: false }))
      .then((next: { gemini?: boolean; nebius?: boolean }) => {
        setStatus({ gemini: Boolean(next.gemini), nebius: Boolean(next.nebius) });
      })
      .catch(() => setStatus({ gemini: false, nebius: false }));
  }, []);

  const selectedReady = provider === 'gemini' ? status.gemini : status.nebius;

  return (
    <div className="mx-auto max-w-2xl">
      <Section>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Settings</h1>

        <Card className="mb-6">
          <h2 className="mb-4 font-medium">AI Counselor Provider</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            API keys stay on the server in `.env`. This page only selects which configured provider the counselor should use.
          </p>
          <Select
            options={[
              { label: 'Google Gemini', value: 'gemini' },
              { label: 'Nebius Token Factory', value: 'nebius' },
            ]}
            value={provider}
            onChange={(value) => {
              const next = value as AiProvider;
              setProvider(next);
              saveProvider(next);
            }}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {selectedReady
              ? `${provider === 'gemini' ? 'Gemini' : 'Nebius'} is configured on the server.`
              : `No ${provider === 'gemini' ? 'GOOGLE_GEMINI_API_KEY' : 'NEBIUS_API_KEY'} is set. Copy .env.example to .env and restart the dev server.`}
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 font-medium">Data Persistence</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Your shortlist, application planner tasks, and profile data are stored locally in this browser.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" size="sm" onClick={() => { clearAllLocalData(); window.location.reload(); }}>
              Clear all local data
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadText('unipath-shortlist.csv', exportShortlistCsv(loadShortlist()))}>
              Export shortlist (CSV)
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-medium">About UniPath Pakistan</h2>
          <p className="text-sm text-muted-foreground">Version 1.0.0 | Educational application for Pakistani students</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Data sources: HEC Pakistan, university admissions offices, government databases. Sample data for demonstration purposes.
          </p>
        </Card>
      </Section>
    </div>
  );
}

export default Settings;
