import React from 'react';
import { useApp } from '../context';
import type { PageId } from '../lib/types';

const navigationItems: Array<{ key: PageId; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'universities', label: 'Find Universities' },
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'counselor', label: 'AI Counselor' },
  { key: 'planner', label: 'Application Planner' },
  { key: 'shortlist', label: 'My Shortlist' },
  { key: 'profile', label: 'My Profile' },
  { key: 'settings', label: 'Settings' },
];

export function MainNav() {
  const { page, navigate } = useApp();

  return (
    <nav className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="shrink-0 text-lg font-semibold tracking-tight"
          onClick={() => navigate('home')}
        >
          UniPath Pakistan
        </button>
        <ul className="flex flex-1 list-none items-center justify-end gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const active = page === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => navigate(item.key)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'bg-primary text-white' : 'text-foreground hover:bg-accent'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
