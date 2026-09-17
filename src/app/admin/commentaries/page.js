'use client';

import React, { useState } from 'react';
import { useCommentaires } from '@/context/CommentaireContext';
import { commentairesApi } from '@/services/api/commentairesApi';
import RichTextEditor from '@/components/common/RichTextEditor';
import {
  extractHtmlContent,
  extractTitle,
  extractAuthorName,
  extractPlainText,
} from '@/utils/contentHelper';
import {
  MessageSquareText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Star,
  User,
  X,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  MapPin,
  CheckCircle,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Mail,
} from 'lucide-react';

const RATING_OPTIONS = ['All', '5', '4', '3', '2', '1'];
const STATUS_OPTIONS = ['All', 'Published', 'Draft'];

export default function CommentariesPage() {
  const {
    commentaires,
    loading,
    selectedRating,
    setSelectedRating,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    addCommentaire,
    updateCommentaire,
    deleteCommentaire,
    syncWordPress,
  } = useCommentaires();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    title: '',
    content: '',
    rating: 5,
    tour: '',
    status: 'Published',
  });

  const getAuthorName = (author) => extractAuthorName(author, 'Traveler');

  const getAuthorEmail = (author, fallbackEmail) => {
    if (typeof author === 'object' && author?.email) return author.email;
    return fallbackEmail || '';
  };

  const getPlainText = (htmlOrText) => extractPlainText(htmlOrText, 140);

  // Stats calculation
  const totalCount = commentaires.length;
  const publishedCount = commentaires.filter((c) => c.status === 'Published').length;
  const fiveStarCount = commentaires.filter((c) => Number(c.rating) === 5).length;
  const avgRating = totalCount > 0
    ? (commentaires.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const handleOpenPreview = async (item) => {
    setPreviewItem(item);
    setPreviewLoading(true);
    try {
      const slugOrId = item.slug || item.id || item._id;
      if (slugOrId) {
        const res = await commentairesApi.getCommentaireBySlug(slugOrId);
        if (res?.data) {
          const fullData = res.data.data || res.data;
          setPreviewItem((prev) => ({
            ...prev,
            ...fullData,
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch full commentaire detail for preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      author: '',
      email: '',
      title: '',
      content: '',
      rating: 5,
      tour: 'Jodhpur Heritage Walking Tour',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (item) => {
    const initialContent = extractHtmlContent(item);
    setEditingItem(item);
    setFormData({
      author: getAuthorName(item.author),
      email: getAuthorEmail(item.author, item.email),
      title: extractTitle(item.title, ''),
      content: initialContent,
      rating: Number(item.rating) || 5,
      tour: item.tour || item.tourName || '',
      status: item.status || 'Published',
    });
    setIsModalOpen(true);

    if (!initialContent && (item.slug || item.id || item._id)) {
      try {
        const res = await commentairesApi.getCommentaireBySlug(item.slug || item.id || item._id);
        if (res?.data) {
          const fullData = res.data.data || res.data;
          const fullContent = extractHtmlContent(fullData);
          if (fullContent) {
            setFormData((prev) => ({
              ...prev,
              content: fullContent,
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch full commentaire detail for editor:', err);
      }
    }
  };

  const handleSyncWordPress = async () => {
    if (!confirm('Sync latest commentaires from WordPress (/api/v1/commentaires/sync-wordpress)?')) return;
    setSyncing(true);
    await syncWordPress();
    setSyncing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      author: {
        name: formData.author,
        email: formData.email,
      },
      rating: Number(formData.rating),
    };

    if (editingItem) {
      await updateCommentaire(editingItem.id || editingItem._id, payload);
    } else {
      await addCommentaire(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Commentaires & Testimonials</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer commentaries, experience feedback, and travel reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSyncWordPress}
            disabled={syncing || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Sync commentaires from WordPress API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing WP...' : 'WP Sync'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Commentaire</span>
          </button>
        </div>
      </div>

      {/* Mini Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Comments</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Published</p>
          <p className="text-lg font-black text-emerald-700 mt-0.5">{publishedCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">5-Star Reviews</p>
          <p className="text-lg font-black text-amber-600 mt-0.5">{fiveStarCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Average Rating</p>
          <p className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1">
            <span>{avgRating}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by author, tour, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0f172a]"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 md:pb-0">
            {RATING_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRating(r)}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedRating === r
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'All' ? 'All' : `${r}★`}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              title="Table View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Commentaires Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-44" />
          ))}
        </div>
      ) : commentaires.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-2xs min-h-[260px]">
          <MessageSquareText className="w-7 h-7 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-xs">No commentaires found</h3>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
            Try adjusting your search criteria, click "WP Sync" to fetch WordPress comments, or add a new one.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* COMPACT CARD GRID (3 to 4 columns, well-proportioned) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {commentaires.map((item) => {
            const itemId = item.id || item._id;
            const authorName = getAuthorName(item.author);
            const authorEmail = getAuthorEmail(item.author, item.email);
            const ratingNumber = Number(item.rating) || 5;
            const plainContent = getPlainText(item.content || item.comment || '');
            const dateStr = item.createdAt?.slice(0, 10) || item.date?.slice(0, 10) || '2026-09-17';

            return (
              <div
                key={itemId}
                className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  {/* Card Header: Author info & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#0f172a] text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {authorName.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate leading-tight">{authorName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{dateStr}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        item.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status || 'Published'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < ratingNumber ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-slate-600 ml-1">
                      {ratingNumber}.0
                    </span>
                  </div>

                  {/* Title & Tour Tag */}
                  {item.title && (
                    <h3 className="font-bold text-slate-900 text-xs truncate leading-snug">
                      {item.title}
                    </h3>
                  )}

                  {item.tour && (
                    <div className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 max-w-full truncate">
                      <MapPin className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                      <span className="truncate">{item.tour}</span>
                    </div>
                  )}

                  {/* Content snippet */}
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {plainContent || 'No text provided.'}
                  </p>
                </div>

                {/* Card Footer: Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {authorEmail ? (
                      <span className="truncate flex items-center gap-1" title={authorEmail}>
                        <Mail className="w-2.5 h-2.5" />
                        <span className="truncate">{authorEmail}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Verified</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenPreview(item)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Preview Full Commentary"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCommentaire(itemId)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors"
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
      ) : (
        /* COMPACT TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Author</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Comment / Headline</th>
                  <th className="p-3">Tour</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commentaires.map((item) => {
                  const itemId = item.id || item._id;
                  const authorName = getAuthorName(item.author);
                  const ratingNumber = Number(item.rating) || 5;
                  const plainContent = getPlainText(item.content || item.comment || '');
                  const dateStr = item.createdAt?.slice(0, 10) || item.date?.slice(0, 10) || '2026-09-17';

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#0f172a] text-amber-400 font-bold flex items-center justify-center text-[10px]">
                            {authorName.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[120px]">{authorName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700 ml-0.5">{ratingNumber}.0</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-[260px]">
                        <p className="font-semibold text-slate-900 truncate">{item.title || plainContent}</p>
                        <p className="text-[11px] text-slate-500 truncate">{plainContent}</p>
                      </td>
                      <td className="p-3 text-slate-600 max-w-[140px] truncate">
                        {item.tour || '-'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.status || 'Published'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenPreview(item)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCommentaire(itemId)}
                            className="p-1 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Commentaire Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <MessageSquareText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {editingItem ? 'Edit Commentaire' : 'Add Commentaire'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Traveler feedback, reviews, and testimonials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Author Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f172a]"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Associated Tour
                  </label>
                  <input
                    type="text"
                    value={formData.tour}
                    onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                    placeholder="e.g. Royal Rajasthan Tour"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Comment Title / Summary
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Unforgettable experience in Jodhpur!"
                  className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <RichTextEditor
                label="Commentary Body (Rich Text / HTML)"
                required={true}
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Write detailed commentary here..."
                minHeight="180px"
              />

              <div className="flex items-center gap-6 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Published'}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked ? 'Published' : 'Draft' })
                    }
                    className="w-3.5 h-3.5 text-[#0f172a] rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800">Publish Immediately</span>
                </label>
              </div>

              {/* Actions */}
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
                  className="px-4 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-2xs"
                >
                  {editingItem ? 'Save Changes' : 'Add Commentaire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Drawer */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (Number(previewItem.rating) || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              <h2 className="text-base font-black text-slate-900 leading-snug">
                {extractTitle(previewItem.title || previewItem.tour || 'Traveler Commentary')}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-500 py-1.5 border-y border-slate-100">
                <span className="font-bold text-slate-800">By {getAuthorName(previewItem.author)}</span>
                {previewItem.tour && (
                  <>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">{previewItem.tour}</span>
                  </>
                )}
                <span>•</span>
                <span>{previewItem.createdAt?.slice(0, 10) || previewItem.date?.slice(0, 10) || '2026-09-17'}</span>
              </div>

              {previewLoading && !extractHtmlContent(previewItem) ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                  <p className="text-xs font-semibold">Loading commentaire content...</p>
                </div>
              ) : extractHtmlContent(previewItem) ? (
                <div
                  className="blog-html-content"
                  dangerouslySetInnerHTML={{
                    __html: extractHtmlContent(previewItem),
                  }}
                />
              ) : (
                <div className="py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-500">No commentary message or review text found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
