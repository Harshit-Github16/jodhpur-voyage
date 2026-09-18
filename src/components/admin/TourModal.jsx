'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/common/ImageUploader';
import { X, MapPin, Clock, Users, IndianRupee } from 'lucide-react';

export function TourModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Heritage & History',
    duration: '3 Hours',
    price: '',
    maxGroupSize: '15',
    location: '',
    description: '',
    inclusions: '',
    image: '',
    status: 'Active',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Heritage & History',
        duration: initialData.duration || '3 Hours',
        price: initialData.price || '',
        maxGroupSize: initialData.maxGroupSize || '15',
        location: initialData.location || '',
        description: initialData.description || '',
        inclusions: Array.isArray(initialData.inclusions) ? initialData.inclusions.join(', ') : '',
        image: initialData.image || '',
        status: initialData.status || 'Active',
      });
    } else {
      setFormData({
        title: '',
        category: 'Heritage & History',
        duration: '3 Hours',
        price: '',
        maxGroupSize: '15',
        location: 'Jodhpur, Rajasthan',
        description: '',
        inclusions: 'Expert Guide, Water, Tickets',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      maxGroupSize: Number(formData.maxGroupSize),
      inclusions: formData.inclusions
        ? formData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    await onSave(payload);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            {initialData ? 'Edit Tour Package' : 'New Tour Package'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
              Tour Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mehrangarh Heritage Trail"
              className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
              >
                <option value="Heritage & History">Heritage & History</option>
                <option value="Walking Tours">Walking Tours</option>
                <option value="Desert Safari">Desert Safari</option>
                <option value="Luxury & Royal">Luxury & Royal</option>
                <option value="Village & Culture">Village & Culture</option>
                <option value="Culinary & Food">Culinary & Food</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Clock Tower"
                className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1499"
                className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3 Hours"
                className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                Max Guests
              </label>
              <input
                type="number"
                value={formData.maxGroupSize}
                onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                placeholder="15"
                className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <ImageUploader
            label="Tour Image"
            required={true}
            value={formData.image}
            onChange={(val) => setFormData({ ...formData, image: val })}
            helperText="Upload tour image from device (PNG, JPG, WEBP)"
          />

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-black"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-black hover:bg-slate-800 text-xs font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : initialData ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TourModal;
