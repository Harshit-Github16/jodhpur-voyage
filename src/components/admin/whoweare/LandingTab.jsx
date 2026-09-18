'use client';

import React from 'react';
import ImageUploader from '@/components/common/ImageUploader';
import { SectionCard, TextField, RepeatableList } from './Fields';
import { LayoutGrid, Images } from 'lucide-react';

const CARD_PLACEHOLDER =
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80';

/**
 * Editor for the landing hub strip (SS2): a heading + 5 image/title cards.
 * `landing` is content.landing; `onChange` receives the updated landing object.
 */
export default function LandingTab({ landing, onChange }) {
  const set = (patch) => onChange({ ...landing, ...patch });

  return (
    <div className="space-y-4">
      <SectionCard
        title="Hub Heading"
        description="The banner heading shown above the section cards."
        icon={LayoutGrid}
      >
        <TextField
          label="Heading Text"
          value={landing.heading}
          onChange={(v) => set({ heading: v })}
          placeholder="CREATOR OF THE MOST BEAUTIFUL JOURNEYS FOR 20+ YEARS"
        />
      </SectionCard>

      <SectionCard
        title="Section Cards"
        description="The clickable cards linking to each part of the Who We Are area."
        icon={Images}
      >
        <RepeatableList
          items={landing.cards || []}
          onChange={(cards) => set({ cards })}
          itemLabel="Card"
          addLabel="Add Card"
          minItems={1}
          makeNew={(i) => ({ id: `card-${Date.now()}`, title: 'New Card', image: '', link: '' })}
          renderItem={(card, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <ImageUploader
                  label="Card Image"
                  value={card.image}
                  onChange={(val) => update({ image: val })}
                  helperText="Card thumbnail (PNG, JPG, WEBP)"
                />
              </div>
              <div className="sm:col-span-2 space-y-2.5">
                <TextField
                  label="Card Title"
                  value={card.title}
                  onChange={(v) => update({ title: v })}
                  placeholder="e.g. Who are we"
                />
                <TextField
                  label="Link / Anchor"
                  value={card.link}
                  onChange={(v) => update({ link: v })}
                  placeholder="/who-we-are"
                  hint="Where the card navigates on the website."
                />
              </div>
            </div>
          )}
        />

        {/* Live preview of the card strip */}
        <div className="pt-2 mt-1 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Preview</p>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
            {landing.heading && (
              <p className="text-center text-[11px] font-black tracking-wider text-teal-800 mb-3">
                {landing.heading}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {(landing.cards || []).map((c, i) => (
                <div key={c.id || i} className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image || CARD_PLACEHOLDER}
                    alt={c.title}
                    className="w-full h-20 object-cover rounded-lg shadow-2xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CARD_PLACEHOLDER;
                    }}
                  />
                  <p className="text-[10px] font-bold text-slate-800 mt-1.5 leading-tight">{c.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
