'use client';

import React from 'react';
import ImageUploader from '@/components/common/ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import { SectionCard, TextField, TextArea, RepeatableList } from './Fields';
import ExpertsManager from './ExpertsManager';
import { Image as ImageIcon, FileText, UsersRound } from 'lucide-react';

/**
 * Editor for the "Our Team" page (SS4): hero banner + intro block with highlight
 * chips, followed by the experts CRUD (managed via the /team API).
 */
export default function TeamPageTab({ data, onChange }) {
  const setHero = (patch) => onChange({ ...data, hero: { ...data.hero, ...patch } });
  const setIntro = (patch) => onChange({ ...data, intro: { ...data.intro, ...patch } });

  return (
    <div className="space-y-4">
      {/* Hero */}
      <SectionCard title="Team Page Hero" description="Top banner of the team page." icon={ImageIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow / Badge"
            value={data.hero.eyebrow}
            onChange={(v) => setHero({ eyebrow: v })}
            placeholder="LOCAL FRENCH-SPEAKING EXPERTS"
          />
          <TextField
            label="Title"
            value={data.hero.title}
            onChange={(v) => setHero({ title: v })}
            placeholder="The Jodhpur Travel Team:"
          />
        </div>
        <TextArea
          label="Subtitle"
          value={data.hero.subtitle}
          onChange={(v) => setHero({ subtitle: v })}
          rows={2}
          placeholder="A passionate team living and working in India..."
        />
        <ImageUploader
          label="Hero Background Image"
          value={data.hero.backgroundImage}
          onChange={(val) => setHero({ backgroundImage: val })}
          helperText="Wide banner image behind the hero title."
        />
      </SectionCard>

      {/* Intro block */}
      <SectionCard title="Team Intro Block" description="Introductory text above the expert cards." icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow"
            value={data.intro.eyebrow}
            onChange={(v) => setIntro({ eyebrow: v })}
            placeholder="JODHPUR TRAVEL WHVING LIFE LTD"
          />
          <TextField
            label="Title"
            value={data.intro.title}
            onChange={(v) => setIntro({ title: v })}
            placeholder="The Jodhpur Travel Team \u2013 Our local team"
          />
        </div>

        <RichTextEditor
          label="Intro Body (Rich Text)"
          value={data.intro.body}
          onChange={(html) => setIntro({ body: html })}
          placeholder="We are proud to have more than 6 travel experts..."
          minHeight="140px"
        />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Highlight Chips</p>
          <RepeatableList
            items={data.intro.highlights || []}
            onChange={(highlights) => setIntro({ highlights })}
            itemLabel="Highlight"
            addLabel="Add Highlight"
            makeNew={() => ({ id: `hl-${Date.now()}`, title: '', text: '' })}
            renderItem={(hl, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField
                  label="Title"
                  value={hl.title}
                  onChange={(v) => update({ title: v })}
                  placeholder="e.g. +6 Experts on site"
                />
                <TextField
                  label="Subtext"
                  value={hl.text}
                  onChange={(v) => update({ text: v })}
                  placeholder="e.g. Living & working in India"
                />
              </div>
            )}
          />
        </div>
      </SectionCard>

      {/* Experts CRUD */}
      <SectionCard
        title="Team Experts"
        description="Add, edit, preview and remove the experts shown on the team page."
        icon={UsersRound}
      >
        <ExpertsManager />
      </SectionCard>
    </div>
  );
}
