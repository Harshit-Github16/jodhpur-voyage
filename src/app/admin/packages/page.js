'use client';

import React, { useState } from 'react';
import { useTours } from '@/context/TourContext';
import { useCities } from '@/context/CityContext';
import ImageUploader from '@/components/common/ImageUploader';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  Plus,
  Search,
  Clock,
  Users,
  Star,
  Edit2,
  Trash2,
  MapPin,
  Package,
  X,
  Filter,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORY_TAG_OPTIONS = [
  'Rajasthan Tour',
  'Golden Triangle',
  'Desert Safari',
  'Heritage & Royal',
  'Walking Tours',
  'Wildlife & Nature',
  'Luxury Palace Retreat',
];

export default function PackagesManagementPage() {
  const { tours, loading, addTour, updateTour, deleteTour } = useTours();
  const { cities } = useCities();

  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'itinerary' | 'inclusions' | 'media_seo'

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    cityName: 'Jodhpur',
    category: 'Heritage & History',
    categoryTag: 'Rajasthan Tour',
    duration: '4 Hours',
    durationDays: 'Half Day',
    price: '',
    originalPrice: '',
    maxGroupSize: '15',
    location: '',
    description: '',
    inclusions: 'Expert Historian Guide, Entry Tickets, Mineral Water',
    exclusions: 'Airfare, Personal expenses, Camera fees',
    pdfUrl: '',
    image: '',
    galleryText: '',
    status: 'Active',
    featured: false,
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Sightseeing Experience',
        description: 'Guided tour of major landmark highlights and cultural walk.',
        highlights: 'Main palace entrance, Museum, Sunset viewpoint',
      },
    ],
    metaTitle: '',
    metaDescription: '',
  });

  const openAddModal = () => {
    setEditingPackage(null);
    setActiveTab('basic');
    setFormData({
      title: '',
      slug: '',
      cityName: selectedCityFilter !== 'All' ? selectedCityFilter : 'Jodhpur',
      category: 'Heritage & History',
      categoryTag: 'Rajasthan Tour',
      duration: '3 Days / 2 Nights',
      durationDays: '3 Days / 2 Nights',
      price: '',
      originalPrice: '',
      maxGroupSize: '15',
      location: 'Jodhpur, Rajasthan',
      description: '',
      inclusions: 'AC Luxury Transport, Expert Tour Guide, Monument Tickets, Mineral Water',
      exclusions: 'Flight / Train tickets, Personal expenses, Gratuities',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      image: '',
      gallery: [],
      status: 'Active',
      featured: false,
      itinerary: [
        {
          day: 1,
          title: 'Day 1: Arrival & Royal Heritage Walk',
          description: 'Check-in, welcome drinks, guided palace and old town walking trail.',
          highlights: 'Palace entrance, Stepwell visit, Sunset chai',
        },
      ],
      metaTitle: '',
      metaDescription: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setActiveTab('basic');
    setFormData({
      title: pkg.title || '',
      slug: pkg.slug || '',
      cityName: pkg.cityName || 'Jodhpur',
      category: pkg.category || 'Heritage & History',
      categoryTag: pkg.categoryTag || 'Rajasthan Tour',
      duration: pkg.duration || '4 Hours',
      durationDays: pkg.durationDays || '1 Day',
      price: pkg.price || '',
      originalPrice: pkg.originalPrice || '',
      maxGroupSize: pkg.maxGroupSize || '15',
      location: pkg.location || '',
      description: pkg.description || '',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : pkg.inclusions || '',
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : pkg.exclusions || '',
      pdfUrl: pkg.pdfUrl || '',
      image: pkg.image || '',
      gallery: Array.isArray(pkg.gallery) ? pkg.gallery : (pkg.gallery ? [pkg.gallery] : []),
      status: pkg.status || 'Active',
      featured: Boolean(pkg.featured),
      itinerary: pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary : [
        { day: 1, title: 'Day 1 Itinerary', description: pkg.description || '', highlights: 'Guided tour' }
      ],
      metaTitle: pkg.seo?.metaTitle || '',
      metaDescription: pkg.seo?.metaDescription || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleTitleChange = (val) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug ? prev.slug : autoSlug,
      metaTitle: prev.metaTitle ? prev.metaTitle : `${val} | Jodhpur Voyage`,
    }));
  };

  // Itinerary Day Helpers
  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: `Day ${prev.itinerary.length + 1}: `,
          description: '',
          highlights: '',
        },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((dayObj, i) => ({ ...dayObj, day: i + 1 })),
    }));
  };

  const updateItineraryField = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill in required fields (Title and Price).');
      return;
    }

    const inclusionsArray = formData.inclusions
      ? formData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const exclusionsArray = formData.exclusions
      ? formData.exclusions.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const galleryArray = Array.isArray(formData.gallery)
      ? formData.gallery.filter(Boolean)
      : formData.galleryText
      ? formData.galleryText.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cityName: formData.cityName,
      cityId: `city-${formData.cityName.toLowerCase()}`,
      category: formData.category,
      categoryTag: formData.categoryTag,
      duration: formData.duration,
      durationDays: formData.durationDays,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.25,
      maxGroupSize: Number(formData.maxGroupSize) || 15,
      location: formData.location || `${formData.cityName}, Rajasthan`,
      description: formData.description,
      inclusions: inclusionsArray,
      exclusions: exclusionsArray,
      pdfUrl: formData.pdfUrl,
      image: formData.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      gallery: galleryArray,
      status: formData.status,
      featured: formData.featured,
      itinerary: formData.itinerary,
      seo: {
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.description.slice(0, 150),
      },
    };

    if (editingPackage) {
      updateTour(editingPackage.id, payload);
    } else {
      addTour(payload);
    }

    closeModal();
  };

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to delete tour package: "${title}"?`)) {
      deleteTour(id);
    }
  };

  // Filtered packages
  const filteredPackages = tours.filter((pkg) => {
    const matchesCity = selectedCityFilter === 'All' || pkg.cityName === selectedCityFilter;
    const matchesTag = selectedTagFilter === 'All' || pkg.categoryTag === selectedTagFilter || pkg.category === selectedTagFilter;
    const matchesSearch =
      (pkg.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.cityName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Tour Packages & Itineraries</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {tours.length} Live Tours
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build day-by-day itineraries, pricing, inclusions/exclusions, category tags, and downloadable PDF brochures.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Tour Package</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none text-xs"
            >
              <option value="All">All Destination Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Tag Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none text-xs"
            >
              <option value="All">All Categories / Tags</option>
              {CATEGORY_TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tours by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Tour Image with Badges */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={pkg.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                  {pkg.cityName}
                </span>
                {pkg.categoryTag && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                    {pkg.categoryTag}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <StatusBadge status={pkg.status || 'Active'} />
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow-md">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pkg.duration}</span>
                </div>
                {pkg.pdfUrl && (
                  <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold text-[10px]">
                    <FileText className="w-3 h-3" />
                    <span>PDF Itinerary</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tour Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    {pkg.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pkg.rating || 4.9}</span>
                    <span className="text-slate-400">({pkg.reviewsCount || 0})</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {pkg.description}
                </p>

                {/* Day-by-day Itinerary Badge Preview */}
                {pkg.itinerary && pkg.itinerary.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold">
                      {pkg.itinerary.length} {pkg.itinerary.length === 1 ? 'Day Plan' : 'Days Itinerary'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate">{pkg.itinerary[0]?.title}</span>
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Starting Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900">
                      ₹{Number(pkg.price).toLocaleString()}
                    </span>
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(pkg.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id, pkg.title)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {editingPackage ? 'Edit Tour Package & Itinerary' : 'Create New Tour Package'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set package details, day-by-day plan, PDF brochure, pricing, and SEO tags.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 overflow-x-auto bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'basic'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                1. Basic Info & Pricing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('itinerary')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'itinerary'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>2. Day-by-Day Itinerary</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {formData.itinerary.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inclusions')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'inclusions'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                3. Inclusions & Exclusions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media_seo')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'media_seo'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                4. Gallery, PDF & SEO
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: BASIC INFO & PRICING */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Package Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. 3-Day Royal Jodhpur & Osian Desert Glamping"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Destination City *
                      </label>
                      <select
                        value={formData.cityName}
                        onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.categoryName || c.state || 'Destination'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Category Tag *
                      </label>
                      <select
                        value={formData.categoryTag}
                        onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        {CATEGORY_TAG_OPTIONS.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Duration (Display Text)
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 3 Days / 2 Nights or 4 Hours"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Max Group Size
                      </label>
                      <input
                        type="number"
                        value={formData.maxGroupSize}
                        onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                        placeholder="15"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Offer Price (₹ INR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="3499"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-bold text-amber-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Original / Strike Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="4200"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Location / Meeting Point
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Clock Tower & Navchokiya, Jodhpur"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Package Overview / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed highlight of what makes this experience special..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-6 sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-800">Featured Tour on Homepage</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">Status:</span>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold"
                        >
                          <option value="Active">Active / Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAY-BY-DAY ITINERARY BUILDER */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Day-by-Day Schedule Builder
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add structured schedule for each day of the journey.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Day {formData.itinerary.length + 1}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.itinerary.map((dayPlan, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                              {dayPlan.day || idx + 1}
                            </span>
                            <input
                              type="text"
                              value={dayPlan.title}
                              onChange={(e) => updateItineraryField(idx, 'title', e.target.value)}
                              placeholder={`Day ${idx + 1}: Title (e.g. Mehrangarh Fort & Stepwell Walk)`}
                              className="font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 w-72 focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          {formData.itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(idx)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1 rounded hover:bg-rose-50"
                            >
                              Remove Day
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Day Description / Activities
                          </label>
                          <textarea
                            rows={2}
                            value={dayPlan.description}
                            onChange={(e) => updateItineraryField(idx, 'description', e.target.value)}
                            placeholder="Detailed schedule of the day, sightseeing places, dining arrangements..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Key Highlights / Tags
                          </label>
                          <input
                            type="text"
                            value={dayPlan.highlights}
                            onChange={(e) => updateItineraryField(idx, 'highlights', e.target.value)}
                            placeholder="e.g. Sheesh Mahal, Jaswant Thada, Blue city sunset view"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
              {activeTab === 'inclusions' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Package Inclusions (comma-separated)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.inclusions}
                      onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                      placeholder="AC Transport, Historian Guide, Entry Tickets, Mineral Water, Camel Safari"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Separate each included item with a comma. They will be displayed as green check bullet points.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Package Exclusions (comma-separated)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.exclusions}
                      onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                      placeholder="Airfare, Personal shopping, Gratuities, Alcoholic drinks"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Items that travelers must pay for separately.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY, PDF & SEO */}
              {activeTab === 'media_seo' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <ImageUploader
                    label="Primary Tour Cover Image"
                    required={true}
                    value={formData.image}
                    onChange={(val) => setFormData({ ...formData, image: val })}
                    helperText="Upload tour cover image from device (PNG, JPG, WEBP)"
                  />

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Tour Gallery Photos
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {Array.isArray(formData.gallery) &&
                        formData.gallery.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.gallery.filter((_, i) => i !== idx);
                                setFormData({ ...formData, gallery: updated });
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                      <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-amber-50/50 transition-colors p-2 text-center">
                        <UploadCloud className="w-5 h-5 text-amber-600 mb-1" />
                        <span className="text-[10px] font-bold text-slate-700">Add Gallery Photo</span>
                        <span className="text-[9px] text-slate-400">PNG, JPG up to 10MB</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const res = ev.target?.result;
                                if (res) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    gallery: [...(prev.gallery || []), res],
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      <span>Downloadable PDF Itinerary / Brochure Link</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pdfUrl}
                      onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                      placeholder="https://example.com/brochures/jodhpur-voyage-tour.pdf"
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:border-amber-600 focus:outline-none"
                    />
                    <p className="text-[10px] text-amber-800">
                      When guests click "Download Itinerary PDF", this brochure link will be triggered.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      SEO & Slug Settings
                    </h4>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="mehrangarh-fort-heritage-walk"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="Mehrangarh Fort Guided Tour Jodhpur | Jodhpur Voyage"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="Explore the majestic 15th-century Mehrangarh Fort with private audio guides..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'media_seo') setActiveTab('inclusions');
                        else if (activeTab === 'inclusions') setActiveTab('itinerary');
                        else if (activeTab === 'itinerary') setActiveTab('basic');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      ← Previous Tab
                    </button>
                  )}
                  {activeTab !== 'media_seo' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'basic') setActiveTab('itinerary');
                        else if (activeTab === 'itinerary') setActiveTab('inclusions');
                        else if (activeTab === 'inclusions') setActiveTab('media_seo');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Next Tab →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors shadow-sm cursor-pointer"
                  >
                    {editingPackage ? 'Save Changes' : 'Create Package'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
