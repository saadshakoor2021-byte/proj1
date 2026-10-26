import React from 'react';

export function Select({
  options,
  value,
  onChange,
  placeholder,
  className = '',
}: {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      className={`w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
