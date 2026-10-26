import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', type = 'text', ...props }: InputProps) {
  if (type === 'checkbox') {
    return (
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
        {...props}
      />
    );
  }

  return (
    <input
      className={`w-full rounded-xl border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      type={type}
      {...props}
    />
  );
}
