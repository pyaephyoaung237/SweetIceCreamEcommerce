'use client';

import { ReactNode, useState } from 'react';

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  action?: ReactNode; // e.g. "Forgot?" link shown next to the label
}

export default function AuthField({ id, label, type = 'text', placeholder, autoComplete, error, action }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
        {action}
      </div>
      <div className="relative">
        {/* text-base keeps iPhones from zooming into the field */}
        <input
          id={id}
          name={id}
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`block w-full rounded-xl border bg-gray-50/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
            isPassword ? 'pr-16' : ''
          } ${error ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-pink-500 focus:ring-pink-500/20'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-pink-600 hover:text-pink-700"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}