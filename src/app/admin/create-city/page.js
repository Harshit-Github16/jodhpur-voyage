'use client';

import React, { useState } from 'react';
import { useCities } from '@/context/CityContext';
import ImageUploader from '@/components/common/ImageUploader';
import {
  MapPin,
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  HelpCircle,
  Sparkles,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Globe,
} from 'lucide-react';

export default function CreateCityPage() {
  const { cities, loading, addCity, updateCity, deleteCity } = useCities();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqAccordion, setActiveFaqAccordion] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    state: 'Rajasthan',
    tagline: '',
    heroTitle: '',
    metaDescription: '',
    bannerImage: '',
    galleryUrls: '',
    highlights: '',
    status: 'Published',
    featured: false,
    faqs: [{ question: '', answer: '' }],
  });

  const openAddModal = () => {
    setEditingCity(null);
    setFormData({
      name: '',
      state: 'Rajasthan',
      tagline: '',
      heroTitle: '',
      metaDescription: '',
      bannerImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      galleryUrls: '',
      highlights: 'Heritage Forts, Desert Safaris, Royal Stepwells',
      status: 'Published',
      featured: true,
      faqs: [{ question: 'What is the best time to visit?', answer: 'October to March is the best season.' }],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name || '',
      state: city.state || 'Rajasthan',
      tagline: city.tagline || '',
      heroTitle: city.heroTitle || '',
      metaDescription: city.metaDescription || '',
      bannerImage: city.bannerImage || '',
      galleryUrls: Array.isArray(city.gallery) ? city.gallery.join('\n') : '',
      highlights: Array.isArray(city.highlights) ? city.highlights.join(', ') : '',
      status: city.status || 'Published',
      featured: Boolean(city.featured),
      faqs: city.faqs && city.faqs.length > 0 ? city.faqs : [{ question: '', answer: '' }],
    });
    setIsModalOpen(true);
  };

  // FAQ Dynamic Handlers
  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index][field] = value;
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      highlights: formData.highlights
        ? formData.highlights.split(',').map((h) => h.trim()).filter(Boolean)
        : [],
      gallery: formData.galleryUrls
        ? formData.galleryUrls.split('\n').map((u) => u.trim()).filter(Boolean)
        : [],
      faqs: formData.faqs.filter((f) => f.question.trim() !== ''),
    };

    if (editingCity) {
      await updateCity(editingCity.id, payload);
    } else {
      await addCity(payload);
    }

    setIsModalOpen(false);
  };

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">City & Destination Builder</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {cities.length} Destinations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and edit destination landing pages, hero titles, descriptions, image galleries, and FAQs for website visitors.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New City</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cities by name, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
          />
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            {/* Banner preview */}
            <div className="relative h-48 w-full bg-slate-100">
              <img
                src={city.bannerImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'}
                alt={city.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded bg-[#0f172a]/90 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {city.name}, {city.state}
                </span>
                {city.featured && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold uppercase shadow-2xs">
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    city.status === 'Published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {city.status}
                </span>
              </div>
            </div>

            {/* City Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {city.heroTitle || `${city.name} Travel & Tour Experiences`}
                </h3>
                <p className="text-xs text-amber-700 font-semibold">{city.tagline}</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {city.metaDescription}
                </p>

                {/* Highlights tags */}
                {city.highlights && city.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {city.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* FAQs preview count */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    {city.faqs?.length || 0} FAQs Configured
                  </span>
                  <span className="font-medium text-slate-700">
                    Slug: <code className="text-slate-900 font-mono">/{city.slug}</code>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(city)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit City Page</span>
                </button>
                <button
                  onClick={() => deleteCity(city.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete City"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* City Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingCity ? `Edit ${editingCity.name} Content` : 'Create New City Destination'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure titles, SEO meta, gallery, and website FAQ questions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jodhpur"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Rajasthan"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  City Tagline (Subtitle)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. The Legendary Sun City & Blue Heritage Capital"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Hero Page Title (H1) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="e.g. Discover Royal Jodhpur: Forts, Palaces & Desert Safaris"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Page Meta Description (SEO)
                </label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Meta description for search engines and social sharing..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <ImageUploader
                label="City Banner Image"
                required={true}
                value={formData.bannerImage}
                onChange={(val) => setFormData({ ...formData, bannerImage: val })}
                helperText="Upload banner image from device or paste image URL"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Key Highlights / Landmarks (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Mehrangarh Fort, Umaid Bhawan, Blue City Walk, Osian Dunes"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              {/* Dynamic FAQ Builder Section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <label className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                      City FAQ Builder
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ Question</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          FAQ #{index + 1}
                        </span>
                        {formData.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-slate-400 hover:text-rose-600 text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Question: e.g. What is the best season to visit?"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white text-xs text-slate-900 rounded border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer: Detailed travel advice for guests..."
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white text-xs text-slate-900 rounded border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Featured Toggle */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Published'}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked ? 'Published' : 'Draft' })
                    }
                    className="w-4 h-4 text-[#0f172a] rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800">Publish on Live Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800">Featured Destination</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  {editingCity ? 'Save City Changes' : 'Publish City'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
