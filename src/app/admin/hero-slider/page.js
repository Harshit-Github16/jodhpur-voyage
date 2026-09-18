'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useHeroSlider } from '@/context/HeroSliderContext';
import ImageUploader from '@/components/common/ImageUploader';
import TagInput from '@/components/admin/heroslider/TagInput';
import {
  GalleryHorizontalEnd,
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  Cloud,
  HardDrive,
  Search,
  Layers,
  Copy,
  CheckCircle2,
} from 'lucide-react';

const SLIDE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80';

const emptySlide = (order) => ({
  id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  eyebrow: '',
  title: '',
  titleHighlight: '',
  image: '',
  description: '',
  tags: [],
  status: 'Active',
  order: order || 1,
});

export default function HeroSliderPage() {
  const { slider, saveSlider, loading, saving, source } = useHeroSlider();

  const [draft, setDraft] = useState(slider);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptySlide(1));
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setDraft(slider);
  }, [slider]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(slider),
    [draft, slider]
  );

  const slides = draft.slides || [];

  // Effective description/tags for a slide, honoring sharedMode.
  const effectiveDescription = (slide) =>
    draft.sharedMode ? draft.shared.description : slide.description;
  const effectiveTags = (slide) => (draft.sharedMode ? draft.shared.tags : slide.tags) || [];

  const setSlides = (next) => setDraft((p) => ({ ...p, slides: next }));

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const removeSlide = (index) => {
    if (!confirm('Remove this slide?')) return;
    setSlides(slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const openAdd = () => {
    setEditingIndex(null);
    setForm(emptySlide(slides.length + 1));
    setIsModalOpen(true);
  };

  const openEdit = (index) => {
    setEditingIndex(index);
    setForm({ ...slides[index] });
    setIsModalOpen(true);
  };

  const submitSlide = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a slide title.');
      return;
    }
    if (editingIndex === null) {
      setSlides([...slides, { ...form, order: slides.length + 1 }]);
    } else {
      setSlides(slides.map((s, i) => (i === editingIndex ? { ...form } : s)));
    }
    setIsModalOpen(false);
  };

  const setSharedMode = (mode) => setDraft((p) => ({ ...p, sharedMode: mode }));
  const setShared = (patch) => setDraft((p) => ({ ...p, shared: { ...p.shared, ...patch } }));

  const handleSave = () => saveSlider(draft);
  const handleReset = () => {
    if (isDirty && !confirm('Discard unsaved changes?')) return;
    setDraft(slider);
  };

  const activeCount = slides.filter((s) => (s.status || 'Active') === 'Active').length;
  const previewSlide = slides[Math.min(previewIndex, Math.max(slides.length - 1, 0))];

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900">Hero Slider</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {slides.length} Slides
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
            Manage the homepage hero slides — images, titles, descriptions and popular search tags.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {isDirty && <span className="hidden sm:inline text-[11px] font-semibold text-amber-700">Unsaved changes</span>}
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

      {/* Content mode toggle: same for all vs different per slide */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Description &amp; Popular Tags</h3>
            <p className="text-[10px] text-slate-500">Choose whether these are shared across all slides or set per slide.</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSharedMode(true)}
              className={`text-left rounded-xl border p-3 transition-all ${
                draft.sharedMode
                  ? 'border-[#0f172a] bg-slate-50 ring-1 ring-[#0f172a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Copy className={`w-4 h-4 ${draft.sharedMode ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900">Same for all slides</span>
                {draft.sharedMode && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">One description and one tag set used on every slide.</p>
            </button>

            <button
              type="button"
              onClick={() => setSharedMode(false)}
              className={`text-left rounded-xl border p-3 transition-all ${
                !draft.sharedMode
                  ? 'border-[#0f172a] bg-slate-50 ring-1 ring-[#0f172a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className={`w-4 h-4 ${!draft.sharedMode ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900">Different for each slide</span>
                {!draft.sharedMode && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Set a unique description and tags on each slide.</p>
            </button>
          </div>

          {/* Shared editor (only when sharedMode) */}
          {draft.sharedMode && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Shared Description
                </label>
                <textarea
                  rows={3}
                  value={draft.shared.description}
                  onChange={(e) => setShared({ description: e.target.value })}
                  placeholder="Description shown on every slide..."
                  className="w-full px-2.5 py-1.5 bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Shared Popular Tags
                </label>
                <TagInput value={draft.shared.tags} onChange={(tags) => setShared({ tags })} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slides list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
              <GalleryHorizontalEnd className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Slides</h3>
              <p className="text-[10px] text-slate-500">{activeCount} active of {slides.length} total</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-xl border border-slate-200 h-56 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : slides.length === 0 ? (
            <div className="p-10 text-center">
              <GalleryHorizontalEnd className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-xs">No slides yet</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Add your first hero slide to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {slides.map((slide, index) => {
                const status = slide.status || 'Active';
                return (
                  <div
                    key={slide.id || index}
                    className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col"
                  >
                    <div className="relative h-32 bg-slate-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image || SLIDE_PLACEHOLDER}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = SLIDE_PLACEHOLDER;
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950/70 text-white">
                        #{index + 1}
                      </span>
                      <span
                        className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                          status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5 flex-1">
                      {slide.eyebrow && (
                        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 line-clamp-1">
                          {slide.eyebrow}
                        </p>
                      )}
                      <h4 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">
                        {slide.title} <span className="text-teal-600">{slide.titleHighlight}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {effectiveDescription(slide) || 'No description.'}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {effectiveTags(slide).slice(0, 4).map((t, i) => (
                          <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => move(index, 1)}
                          disabled={index === slides.length - 1}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewIndex(index)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Preview this slide below"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(index)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSlide(index)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live Preview */}
      {slides.length > 0 && previewSlide && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">Website Preview</h3>
                <p className="text-[10px] text-slate-500">Slide {Math.min(previewIndex, slides.length - 1) + 1} of {slides.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPreviewIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === Math.min(previewIndex, slides.length - 1) ? 'bg-[#0f172a] w-5' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSlide.image || SLIDE_PLACEHOLDER}
                alt={previewSlide.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = SLIDE_PLACEHOLDER;
                }}
              />
              <div className="absolute inset-0 bg-slate-950/45" />
              <div className="relative z-10 px-6 py-10 max-w-2xl mx-auto text-white">
                {previewSlide.eyebrow && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900/60 text-[10px] font-bold tracking-wider uppercase mb-3">
                    {previewSlide.eyebrow}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow">
                  {previewSlide.title}{' '}
                  <span className="text-teal-300 italic">{previewSlide.titleHighlight}</span>
                </h2>
                <p className="mt-3 text-sm text-white/90 drop-shadow max-w-xl mx-auto">
                  {effectiveDescription(previewSlide)}
                </p>

                {/* Search bar (rendered by the website itself; shown here for context) */}
                <div className="mt-5 mx-auto max-w-lg flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400 flex-1 text-left truncate">
                    Laissez-vous inspirer (ex: Rajasthan, Taj Mahal, Népal...)
                  </span>
                  <span className="text-[11px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full">Rechercher</span>
                </div>

                {effectiveTags(previewSlide).length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Populaire:</span>
                    {effectiveTags(previewSlide).map((t, i) => (
                      <span key={i} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/60 text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              The search bar is provided by the website automatically — you only manage images, text and tags here.
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit slide modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <GalleryHorizontalEnd className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {editingIndex === null ? 'Add Slide' : 'Edit Slide'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Hero slide shown on the homepage.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitSlide} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              <ImageUploader
                label="Slide Background Image"
                value={form.image}
                onChange={(val) => setForm({ ...form, image: val })}
                helperText="Wide banner image (recommended 1920x900, PNG/JPG/WEBP)."
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Eyebrow / Badge
                </label>
                <input
                  type="text"
                  value={form.eyebrow}
                  onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                  placeholder="e.g. TOUR OPÉRATEUR SPÉCIALISÉ"
                  className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Jodhpur Voyage"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Highlighted Title Part
                  </label>
                  <input
                    type="text"
                    value={form.titleHighlight}
                    onChange={(e) => setForm({ ...form, titleHighlight: e.target.value })}
                    placeholder="e.g. Inde & Népal"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Shown in the accent color.</p>
                </div>
              </div>

              {/* Per-slide description & tags only when NOT shared */}
              {!draft.sharedMode ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Slide description..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                      Popular Tags
                    </label>
                    <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
                  </div>
                </>
              ) : (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Description &amp; tags are set to <strong>same for all slides</strong>. Edit them in the section above,
                    or switch to &quot;Different for each slide&quot; to customize per slide.
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f172a]"
                >
                  <option value="Active">Active (visible)</option>
                  <option value="Inactive">Inactive (hidden)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold"
                >
                  {editingIndex === null ? 'Add Slide' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsaved reminder */}
      {isDirty && !loading && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>You have unsaved changes.</span>
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
