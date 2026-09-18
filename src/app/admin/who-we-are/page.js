'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useWhoWeAreContent } from '@/context/WhoWeAreContentContext';
import OverviewTab from '@/components/admin/whoweare/OverviewTab';
import LandingTab from '@/components/admin/whoweare/LandingTab';
import WhoAreWeTab from '@/components/admin/whoweare/WhoAreWeTab';
import TeamPageTab from '@/components/admin/whoweare/TeamPageTab';
import {
  UsersRound,
  Building2,
  LayoutGrid,
  FileText,
  Star,
  Save,
  RotateCcw,
  CheckCircle2,
  Cloud,
  HardDrive,
  ArrowRight,
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Company Overview', icon: Building2 },
  { id: 'landing', label: 'Landing Cards', icon: LayoutGrid },
  { id: 'whoAreWe', label: 'Who Are We Page', icon: FileText },
  { id: 'teamPage', label: 'Our Team', icon: UsersRound },
  { id: 'reviews', label: 'Reviews & Testimonials', icon: Star },
];

export default function WhoWeArePage() {
  const { content, saveContent, loading, saving, source } = useWhoWeAreContent();

  const [activeTab, setActiveTab] = useState('overview');
  const [draft, setDraft] = useState(content);

  // Keep local draft in sync when content loads/changes from the context.
  useEffect(() => {
    setDraft(content);
  }, [content]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content),
    [draft, content]
  );

  const updateSection = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await saveContent(draft);
  };

  const handleReset = () => {
    if (isDirty && !confirm('Discard unsaved changes?')) return;
    setDraft(content);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900">Who We Are</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Content Manager
            </span>
            {source === 'api' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Cloud className="w-3 h-3" /> Synced
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <HardDrive className="w-3 h-3" /> Saved locally
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage every section of the &quot;Who We Are&quot; area: company overview, landing cards, page content, and the team.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {isDirty && (
            <span className="hidden sm:inline text-[11px] font-semibold text-amber-700">Unsaved changes</span>
          )}
          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors disabled:opacity-40"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs flex flex-wrap gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-slate-200 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <OverviewTab overview={draft.overview} onChange={(v) => updateSection('overview', v)} />
          )}
          {activeTab === 'landing' && (
            <LandingTab landing={draft.landing} onChange={(v) => updateSection('landing', v)} />
          )}
          {activeTab === 'whoAreWe' && (
            <WhoAreWeTab data={draft.whoAreWe} onChange={(v) => updateSection('whoAreWe', v)} />
          )}
          {activeTab === 'teamPage' && (
            <TeamPageTab data={draft.teamPage} onChange={(v) => updateSection('teamPage', v)} />
          )}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Reviews &amp; Testimonials</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Reviews and testimonials are managed in the Commentaries section, which already syncs with the backend.
              </p>
              <Link
                href="/admin/commentaries"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <span>Go to Commentaries</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Sticky-ish save reminder for long tabs */}
      {isDirty && activeTab !== 'reviews' && !loading && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>You have unsaved changes in this section.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
