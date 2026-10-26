import React from 'react';
import { AppProvider, useApp } from './context';
import { MainNav } from './ui/nav';
import { Homepage } from './pages/homepage';
import { Onboarding } from './pages/onboarding';
import { FindUniversities } from './pages/universities';
import { Scholarships } from './pages/scholarships';
import { AICounselor } from './pages/counselor';
import { ApplicationPlanner } from './pages/planner';
import { MyShortlist } from './pages/shortlist';
import { MyProfile } from './pages/profile';
import { Settings } from './pages/settings';

function AppShell() {
  const { page } = useApp();

  const pages = {
    home: <Homepage />,
    onboarding: <Onboarding />,
    universities: <FindUniversities />,
    scholarships: <Scholarships />,
    counselor: <AICounselor />,
    planner: <ApplicationPlanner />,
    shortlist: <MyShortlist />,
    profile: <MyProfile />,
    settings: <Settings />,
  };

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <MainNav />
      <main className="mx-auto max-w-7xl p-4 md:p-6">{pages[page]}</main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
