'use client';

import React from 'react';
import ImageUploader from '@/components/common/ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import { SectionCard, TextField } from './Fields';
import { Building2 } from 'lucide-react';

/**
 * Top "what is the company / what we do" block, edited with a full rich text editor.
 */
export default function OverviewTab({ overview, onChange }) {
  const set = (patch) => onChange({ ...overview, ...patch });

  return (
    <div className="space-y-4">
      <SectionCard
        title="Company Overview"
        description="The top section describing the company and what you do."
        icon={Building2}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Eyebrow"
            value={overview.eyebrow}
            onChange={(v) => set({ eyebrow: v })}
            placeholder="ABOUT JODHPUR VOYAGE"
          />
          <TextField
            label="Title"
            value={overview.title}
            onChange={(v) => set({ title: v })}
            placeholder="Who We Are & What We Do"
          />
        </div>

        <RichTextEditor
          label="Description (Rich Text — headings, bold, italic, images, etc.)"
          value={overview.body}
          onChange={(html) => set({ body: html })}
          placeholder="Describe the company, its mission, and what you offer..."
          minHeight="240px"
        />

        <ImageUploader
          label="Overview Image (optional)"
          value={overview.image}
          onChange={(val) => set({ image: val })}
          helperText="An optional feature image for the overview section."
        />
      </SectionCard>
    </div>
  );
}
