import React, { createContext, useContext, useMemo, useState } from 'react';
import { loadCountryFilter, saveCountryFilter } from './lib/storage';
import type { PageId } from './lib/types';

interface AppContextValue {
  page: PageId;
  navigate: (page: PageId, options?: { country?: string }) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<PageId>('home');
  const [countryFilter, setCountryFilterState] = useState(loadCountryFilter);

  const value = useMemo<AppContextValue>(
    () => ({
      page,
      countryFilter,
      setCountryFilter: (next) => {
        setCountryFilterState(next);
        saveCountryFilter(next);
      },
      navigate: (next, options) => {
        if (options?.country) {
          setCountryFilterState(options.country);
          saveCountryFilter(options.country);
        }
        setPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [page, countryFilter],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
