'use client';

import React from 'react';
import ImageUploader from '@/components/common/ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import { SectionCard, TextField, TextArea, RepeatableList } from './Fields';
import { Image as ImageIcon, FileText, Quote, ShieldCheck } from 'lucide-react';

/**
 * Editor for the "Who Are We" page (SS3). This single page holds three sub-sections:
 *  - Identity (rich text + image)  ["Who we are" + "Our added value"]
 *  - Founder / Philosophy block
 *  - The Pillars of Our Commitment  ["Our responsible commitment"]
 * plus the page hero banner.
 */
export default function WhoAreWeTab({ data, onChange }) {
  const setHero = (patch) => onChange({ ...data, hero: { ...data.hero, ...patch } });
  const setIdentity = (patch) => onChange({ ...data, identity: { ...data.identity, ...patch } });
  const setFounder = (patch) => onChange({ ...data, founder: { ...data.founder, ...patch } });
  const setPillars = (patch) => onChange({ ...data, pillars: { ...data.pillars, ...patch } });

  return (
    <div className="space-y-4">
      {/* Hero */}
      <SectionCard title="Page Hero Banner" description="Top banner of the Who Are We page." icon={ImageIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow / Badge"
            value={data.hero.eyebrow}
            onChange={(v) => setHero({ eyebrow: v })}
            placeholder="OUR HISTORY & OUR COMMITMENTS"
          />
          <TextField
            label="Title"
            value={data.hero.title}
            onChange={(v) => setHero({ title: v })}
            placeholder="Who are we ?"
          />
        </div>
        <TextArea
          label="Subtitle"
          value={data.hero.subtitle}
          onChange={(v) => setHero({ subtitle: v })}
          rows={2}
          placeholder="A local, French-speaking travel agency..."
        />
        <ImageUploader
          label="Hero Background Image"
          value={data.hero.backgroundImage}
          onChange={(val) => setHero({ backgroundImage: val })}
          helperText="Wide banner image behind the hero title."
        />
      </SectionCard>

      {/* Identity (rich text + image) */}
      <SectionCard
        title="Identity Section"
        description='"Who we are" + "Our added value" — full rich text with image.'
        icon={FileText}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow"
            value={data.identity.eyebrow}
            onChange={(v) => setIdentity({ eyebrow: v })}
            placeholder="OUR IDENTITY"
          />
          <TextField
            label="Section Title"
            value={data.identity.title}
            onChange={(v) => setIdentity({ title: v })}
            placeholder="A Passionate, French-Speaking Local Agency"
          />
        </div>

        <RichTextEditor
          label="Body Content (Rich Text)"
          value={data.identity.body}
          onChange={(html) => setIdentity({ body: html })}
          placeholder="Describe the company and what you do..."
          minHeight="200px"
        />

        <ImageUploader
          label="Identity Image"
          value={data.identity.image}
          onChange={(val) => setIdentity({ image: val })}
          helperText="Image shown beside the identity text."
        />
      </SectionCard>

      {/* Founder / Philosophy */}
      <SectionCard title="Founder / Philosophy" description='"A word from the founder" block.' icon={Quote}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow"
            value={data.founder.eyebrow}
            onChange={(v) => setFounder({ eyebrow: v })}
            placeholder="A WORD FROM THE FOUNDER"
          />
          <TextField
            label="Section Title"
            value={data.founder.title}
            onChange={(v) => setFounder({ title: v })}
            placeholder="Our Philosophy"
          />
          <TextField
            label="Founder Name"
            value={data.founder.name}
            onChange={(v) => setFounder({ name: v })}
            placeholder="Mr Singh"
          />
          <TextField
            label="Founder Role"
            value={data.founder.role}
            onChange={(v) => setFounder({ role: v })}
            placeholder="Founder & Main Contact Person"
          />
        </div>

        <ImageUploader
          label="Founder Photo"
          value={data.founder.photo}
          onChange={(val) => setFounder({ photo: val })}
          helperText="Circular founder portrait."
        />

        <TextArea
          label="Pull Quote"
          value={data.founder.quote}
          onChange={(v) => setFounder({ quote: v })}
          rows={3}
          placeholder="Passionate about my country and its culture..."
        />

        <RichTextEditor
          label="Philosophy Body (Rich Text)"
          value={data.founder.body}
          onChange={(html) => setFounder({ body: html })}
          placeholder="The project was born from a desire to..."
          minHeight="140px"
        />
      </SectionCard>

      {/* Commitment pillars */}
      <SectionCard
        title="Pillars of Our Commitment"
        description='"Our responsible commitment" — grid of pillar cards.'
        icon={ShieldCheck}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow"
            value={data.pillars.eyebrow}
            onChange={(v) => setPillars({ eyebrow: v })}
            placeholder="WHY CHOOSE US"
          />
          <TextField
            label="Section Title"
            value={data.pillars.title}
            onChange={(v) => setPillars({ title: v })}
            placeholder="The Pillars of Our Commitment"
          />
        </div>
        <TextField
          label="Subtitle"
          value={data.pillars.subtitle}
          onChange={(v) => setPillars({ subtitle: v })}
          placeholder="Exceptional service for a worry-free journey."
        />

        <RepeatableList
          items={data.pillars.items || []}
          onChange={(items) => setPillars({ items })}
          itemLabel="Pillar"
          addLabel="Add Pillar"
          makeNew={() => ({ id: `pillar-${Date.now()}`, title: '', text: '' })}
          renderItem={(pillar, update) => (
            <div className="space-y-2.5">
              <TextField
                label="Pillar Title"
                value={pillar.title}
                onChange={(v) => update({ title: v })}
                placeholder="e.g. Direct & Without Intermediaries"
              />
              <TextArea
                label="Pillar Description"
                value={pillar.text}
                onChange={(v) => update({ text: v })}
                rows={2}
                placeholder="Short description of this commitment..."
              />
            </div>
          )}
        />
      </SectionCard>
    </div>
  );
}
