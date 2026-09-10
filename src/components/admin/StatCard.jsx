'use client';

import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  growth,
  isPositive = true,
  icon: Icon,
}) {
  return (
    <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
        {growth && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {growth}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;
