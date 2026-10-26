import React from 'react';

export interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

export function Section({ className = '', children }: SectionProps) {
  return <section className={`space-y-4 ${className}`}>{children}</section>;
}
