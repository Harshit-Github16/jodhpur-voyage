'use client';

import React, { useState } from 'react';
import { useReviews } from '@/context/ReviewContext';
import { useTours } from '@/context/TourContext';
import {
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ThumbsUp,
  MapPin,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function ReviewsManagementPage() {
  const {
    reviews,
    loading,
    pendingCount,
    approvedCount,
    addReview,
    updateReview,
    approveReview,
    rejectReview,
    toggleFeatured,
    deleteReview,
  } = useReviews();

  const { tours } = useTours();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerLocation: '',
    customerAvatar: '',
    packageTitle: 'Mehrangarh Fort & Jaswant Thada Heritage Walk',
    rating: 5,
    title: '',
    comment: '',
    tourDate: 'September 2026',
    status: 'Approved',
    featured: true,
  });

  const filteredReviews = reviews.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.customerName || '').toLowerCase().includes(q) ||
      (item.customerLocation || '').toLowerCase().includes(q) ||
      (item.packageTitle || '').toLowerCase().includes(q) ||
      (item.comment || '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      customerName: '',
      customerLocation: 'Mumbai, India',
      customerAvatar: '',
      packageTitle: tours[0]?.title || 'Mehrangarh Fort & Jaswant Thada Heritage Walk',
      rating: 5,
      title: 'Amazing experience in Rajasthan!',
      comment: '',
      tourDate: 'September 2026',
      status: 'Approved',
      featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rev) => {
    setEditingReview(rev);
    setFormData({
      customerName: rev.customerName || '',
      customerLocation: rev.customerLocation || '',
      customerAvatar: rev.customerAvatar || '',
      packageTitle: rev.packageTitle || '',
      rating: rev.rating || 5,
      title: rev.title || '',
      comment: rev.comment || '',
      tourDate: rev.tourDate || '',
      status: rev.status || 'Approved',
      featured: Boolean(rev.featured),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.comment) {
      alert('Please fill customer name and feedback comment.');
      return;
    }

    if (editingReview) {
      updateReview(editingReview.id, formData);
    } else {
      addReview(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Testimonials & Customer Reviews
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {pendingCount} Pending Moderation
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moderate guest ratings, approve verified reviews, and feature testimonials on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="flex items-center gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} {tab === 'Pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews by guest, city, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-xl border p-4.5 shadow-sm flex flex-col justify-between space-y-3.5 transition-all hover:shadow-md ${
              rev.status === 'Pending'
                ? 'border-amber-300 bg-amber-50/20'
                : rev.status === 'Rejected'
                ? 'border-rose-200 opacity-60'
                : 'border-slate-200/80'
            }`}
          >
            <div className="space-y-3">
              {/* Header with guest info & status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {rev.customerAvatar ? (
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                      {rev.customerName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.customerName}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{rev.customerLocation || 'Verified Guest'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      rev.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'Pending'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                  {rev.featured && (
                    <span className="text-[9px] font-bold text-amber-700 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-700 ml-1">
                  {rev.rating}.0 / 5.0
                </span>
              </div>

              {/* Package Tag */}
              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80 truncate">
                Tour: {rev.packageTitle}
              </div>

              {/* Title & Comment */}
              <div>
                {rev.title && (
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    "{rev.title}"
                  </h5>
                )}
                <p className="text-xs text-slate-600 italic line-clamp-4 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {rev.status !== 'Approved' && (
                  <button
                    onClick={() => approveReview(rev.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status === 'Pending' && (
                  <button
                    onClick={() => rejectReview(rev.id)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-[11px] font-semibold transition-colors"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => toggleFeatured(rev.id)}
                  className={`p-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                    rev.featured
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Toggle Homepage Feature"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(rev)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Edit Review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete review from ${rev.customerName}?`)) {
                      deleteReview(rev.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {editingReview ? 'Edit Guest Review' : 'Add Guest Testimonial'}
                </h3>
                <p className="text-xs text-slate-500">Record customer rating and review comment</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Liam Becker"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location / Country</label>
                  <input
                    type="text"
                    value={formData.customerLocation}
                    onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                    placeholder="e.g. Munich, Germany"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tour Package Taken</label>
                  <select
                    value={formData.packageTitle}
                    onChange={(e) => setFormData({ ...formData, packageTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  >
                    {tours.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title} ({t.cityName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating (1 to 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                    <option value={2}>⭐⭐ (2 Stars - Below Average)</option>
                    <option value={1}>⭐ (1 Star - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travel Date / Month</label>
                  <input
                    type="text"
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Unforgettable desert camping & royal guide"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Feedback Comment *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Describe their experience..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-800">Feature on Homepage</span>
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black"
                >
                  {editingReview ? 'Save Review' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
