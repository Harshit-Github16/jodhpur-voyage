'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * Simple chip-style tag editor used for the "popular searches" tags.
 * value: string[]; onChange(nextArray)
 */
export default function TagInput({ value = [], onChange, placeholder = 'Add a tag and press Enter' }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const t = draft.trim();
    if (!t) return;
    if (value.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...value, t]);
    setDraft('');
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 min-h-[38px]">
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0f172a] text-white text-[11px] font-semibold"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-slate-300 hover:text-white"
              title="Remove tag"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length ? '' : placeholder}
            className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-none px-1 py-0.5"
          />
          {draft.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
              title="Add tag"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-slate-400">Press Enter or comma to add. These appear as the &quot;Populaire&quot; quick-search chips.</p>
    </div>
  );
}
