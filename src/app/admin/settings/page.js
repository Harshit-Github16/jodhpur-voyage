'use client';

import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import {
  Settings,
  Globe,
  Phone,
  Mail,
  Send,
  MapPin,
  Share2,
  Link,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  IndianRupee,
} from 'lucide-react';

const TABS = [
  { id: 'branding', label: '1. Brand & Identity' },
  { id: 'contact', label: '2. Contact & Office' },
  { id: 'social', label: '3. Social Media Handles' },
  { id: 'header_footer', label: '4. Header & Footer Bar' },
  { id: 'booking', label: '5. Currency & Bookings' },
];

export default function GeneralSettingsPage() {
  const { settings, isSavedRecently, saveSettings, resetToDefaults } = useSettings();
  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState(settings);

  // Sync state if settings change
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNestedChange = (parent, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: val,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Website General Settings
            </h1>
            {isSavedRecently && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 animate-bounce">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Saved to Live System!</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure site logo, phone numbers, WhatsApp, social links, announcement bar, and footer details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all website settings to original factory defaults?')) {
                resetToDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 flex gap-2 overflow-x-auto shadow-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {/* TAB 1: BRANDING & IDENTITY */}
        {activeTab === 'branding' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Site Branding & Meta Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Website Title / Brand Name
                </label>
                <input
                  type="text"
                  value={formData.siteTitle}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brand Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Site Logo Path / URL
                </label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Favicon Path / URL
                </label>
                <input
                  type="text"
                  value={formData.faviconUrl}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#f59e0b'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#f59e0b'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-32 px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & OFFICE */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Official Communication & Office Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Primary Customer Support Phone</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Emergency / Secondary Phone</span>
                </label>
                <input
                  type="text"
                  value={formData.altPhone}
                  onChange={(e) => handleChange('altPhone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official WhatsApp Business Number (with country code)</span>
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="919829012345"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Support Email Address</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Physical Office Address</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Google Maps Location URL
                </label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOCIAL MEDIA */}
        {activeTab === 'social' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Social Media Handles & Review Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formData.social?.instagram || ''}
                  onChange={(e) => handleNestedChange('social', 'instagram', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="text"
                  value={formData.social?.facebook || ''}
                  onChange={(e) => handleNestedChange('social', 'facebook', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-red-600" />
                  <span>YouTube Channel URL</span>
                </label>
                <input
                  type="text"
                  value={formData.social?.youtube || ''}
                  onChange={(e) => handleNestedChange('social', 'youtube', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>TripAdvisor Page URL</span>
                </label>
                <input
                  type="text"
                  value={formData.social?.tripadvisor || ''}
                  onChange={(e) => handleNestedChange('social', 'tripadvisor', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Twitter / X Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formData.social?.twitter || ''}
                  onChange={(e) => handleNestedChange('social', 'twitter', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HEADER & FOOTER */}
        {activeTab === 'header_footer' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Header Announcement Bar & Footer Information
            </h3>

            <div className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Top Header Announcement Bar Text</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.header?.announcementActive}
                      onChange={(e) => handleNestedChange('header', 'announcementActive', e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Active on site</span>
                  </label>
                </div>

                <textarea
                  rows={2}
                  value={formData.header?.announcementText || ''}
                  onChange={(e) => handleNestedChange('header', 'announcementText', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Footer "About Jodhpur Voyage" Blurb
                </label>
                <textarea
                  rows={3}
                  value={formData.footer?.aboutText || ''}
                  onChange={(e) => handleNestedChange('footer', 'aboutText', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Footer Copyright Notice
                </label>
                <input
                  type="text"
                  value={formData.footer?.copyrightText || ''}
                  onChange={(e) => handleNestedChange('footer', 'copyrightText', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CURRENCY & BOOKINGS */}
        {activeTab === 'booking' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Currency, Taxes & Booking Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.booking?.currencySymbol || '₹'}
                  onChange={(e) => handleNestedChange('booking', 'currencySymbol', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={formData.booking?.currencyCode || 'INR'}
                  onChange={(e) => handleNestedChange('booking', 'currencyCode', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  GST / Tourism Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.booking?.taxRatePercentage || 5}
                  onChange={(e) => handleNestedChange('booking', 'taxRatePercentage', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.booking?.autoConfirmBookings}
                    onChange={(e) => handleNestedChange('booking', 'autoConfirmBookings', e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Auto-Confirm Bookings upon Successful Payment Gateway Callback
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Form Footer Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Changes will immediately reflect across live application and storage.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-sm cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
