'use client';

import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Small shared field primitives used across the "Who We Are" content editor tabs.
 */

export function TextField({ label, value, onChange, placeholder, hint, required }) {
  return (
    <div>
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
      />
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, hint }) {
  return (
    <div>
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] leading-relaxed"
      />
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

/**
 * A titled panel that groups a logical block of the page (e.g. "Hero", "Identity").
 */
export function SectionCard({ title, description, icon: Icon, children, right }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-xs truncate">{title}</h3>
            {description && <p className="text-[10px] text-slate-500 truncate">{description}</p>}
          </div>
        </div>
        {right}
      </div>
      <div className="p-4 space-y-3.5">{children}</div>
    </div>
  );
}

/**
 * Reusable editor for a repeatable list of items (cards / pillars / highlights).
 * Each item is rendered via renderItem(item, update, index).
 */
export function RepeatableList({
  items = [],
  onChange,
  renderItem,
  makeNew,
  addLabel = 'Add Item',
  itemLabel = 'Item',
  minItems = 0,
}) {
  const update = (index, patch) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  };

  const remove = (index) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = () => {
    const created = makeNew ? makeNew(items.length) : { id: `item-${Date.now()}` };
    onChange([...items, created]);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {itemLabel} {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                title="Move up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                title="Move down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={items.length <= minItems}
                className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 disabled:opacity-30"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          {renderItem(item, (patch) => update(index, patch), index)}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:border-[#0f172a] hover:text-slate-900 text-xs font-semibold transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}
