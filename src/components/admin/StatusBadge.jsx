'use client';

import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'confirmed' || normalized === 'paid' || normalized === 'active') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (normalized === 'pending') {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (normalized === 'cancelled' || normalized === 'refunded' || normalized === 'inactive') {
    style = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${style}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
