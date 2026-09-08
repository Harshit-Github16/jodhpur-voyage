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
} from 'lucide-react';

export default function PackagesManagementPage() {
  const { tours, loading, addTour, updateTour, deleteTour } = useTours();
  const { cities } = useCities();

  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    cityName: 'Jodhpur',
    category: 'Heritage & History',
    duration: '4 Hours',
    price: '',
    originalPrice: '',
    maxGroupSize: '15',
    location: '',
    description: '',
    inclusions: '',
    image: '',
    status: 'Active',
    featured: false,
  });

  const openAddModal = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      cityName: selectedCityFilter !== 'All' ? selectedCityFilter : 'Jodhpur',
      category: 'Heritage & History',
      duration: '4 Hours',
      price: '',
      originalPrice: '',
      maxGroupSize: '15',
      location: 'Jodhpur, Rajasthan',
      description: '',
      inclusions: 'Expert Historian Guide, Entry Tickets, Mineral Water',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      cityName: pkg.cityName || 'Jodhpur',
      category: pkg.category || 'Heritage & History',
      duration: pkg.duration || '4 Hours',
      price: pkg.price || '',
      originalPrice: pkg.originalPrice || '',
      maxGroupSize: pkg.maxGroupSize || '15',
      location: pkg.location || '',
      description: pkg.description || '',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : '',
      image: pkg.image || '',
      status: pkg.status || 'Active',
      featured: Boolean(pkg.featured),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      maxGroupSize: Number(formData.maxGroupSize),
      inclusions: formData.inclusions
        ? formData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (editingPackage) {
      await updateTour(editingPackage.id, payload);
    } else {
      await addTour(payload);
    }

    setIsModalOpen(false);
  };

  // Filter packages by city and search query
  const filteredPackages = tours.filter((pkg) => {
    const matchCity =
      selectedCityFilter === 'All' ||
      (pkg.cityName || pkg.location || '').toLowerCase().includes(selectedCityFilter.toLowerCase());
    const matchSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">City-wise Tour Packages</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {tours.length} Total Packages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and organize experiential packages categorized by destination cities for live customer booking.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Filter by City Strip & Search */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search packages by title, location, highlights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
            />
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>City:</span>
            </div>
            <button
              onClick={() => setSelectedCityFilter('All')}
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCityFilter === 'All'
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Cities
            </button>
            {cities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCityFilter(c.name)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCityFilter === c.name
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-100">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f172a]/90 text-white shadow-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {pkg.cityName || 'Jodhpur'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-900 shadow-sm">
                  {pkg.category}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <StatusBadge status={pkg.status} />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{pkg.rating || 4.9}</span>
                  <span className="text-slate-400 font-normal">({pkg.reviewsCount || 0} reviews)</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight">
                  {pkg.title}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {pkg.description}
                </p>

                <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {pkg.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Max {pkg.maxGroupSize} Guests
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Price per guest</span>
                  <span className="text-base font-extrabold text-slate-900">₹{pkg.price}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Edit Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTour(pkg.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors"
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

      {/* Package Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingPackage ? 'Edit Travel Package' : 'Create New City Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Select City *
                  </label>
                  <select
                    value={formData.cityName}
                    onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  >
                    <option value="Heritage & History">Heritage & History</option>
                    <option value="Walking Tours">Walking Tours</option>
                    <option value="Desert Safari">Desert Safari</option>
                    <option value="Luxury & Royal">Luxury & Royal</option>
                    <option value="Village & Culture">Village & Culture</option>
                    <option value="Culinary & Food">Culinary & Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mehrangarh Sunrise Heritage Trail"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
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
                    placeholder="4 Hours"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Max Group Size
                  </label>
                  <input
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Package Feature Image"
                required={true}
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                helperText="Upload package photo from device or paste image URL"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Package Description & Itinerary
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the tour experience, attractions visited..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Inclusions (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  placeholder="Guide, Mineral Water, Entry Tickets, High Tea"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  {editingPackage ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
