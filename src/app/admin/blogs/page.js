'use client';

import React, { useState, useEffect } from 'react';
import { useBlogs } from '@/context/BlogContext';
import { blogsApi } from '@/services/api/blogsApi';
import ImageUploader from '@/components/common/ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import {
  extractHtmlContent,
  extractTitle,
  extractCoverImage,
  extractAuthorName,
  extractPlainText,
  fetchFullWordPressContent,
} from '@/utils/contentHelper';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Tag,
  User,
  Image as ImageIcon,
  Sparkles,
  X,
  FileText,
  Filter,
  RefreshCw,
  MapPin,
  Globe,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Travel Guide',
  'Desert Expeditions',
  'Food & Culture',
  'Heritage & History',
  'Photography',
];

const DEFAULT_DESTINATIONS = ['India', 'Nepal'];

export default function BlogsPage() {
  const {
    blogs,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addBlog,
    updateBlog,
    deleteBlog,
    syncWordPress,
  } = useBlogs();

  const [destinationCategories, setDestinationCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jodhpur_admin_destination_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_DESTINATIONS;
  });

  const [selectedDestination, setSelectedDestination] = useState('All');
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [newDestinationInput, setNewDestinationInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSyncWordPress = async () => {
    if (!confirm('Are you sure you want to sync blogs from WordPress?')) return;
    setSyncing(true);
    await syncWordPress();
    setSyncing(false);
  };

  const handleSaveNewDestination = (e) => {
    if (e) e.preventDefault();
    const trimmed = newDestinationInput.trim();
    if (!trimmed) return;
    if (!destinationCategories.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...destinationCategories, trimmed];
      setDestinationCategories(updated);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('jodhpur_admin_destination_categories', JSON.stringify(updated));
        } catch (err) {}
      }
    }
    setFormData((prev) => ({ ...prev, destinationCategory: trimmed }));
    setNewDestinationInput('');
    setIsAddingDestination(false);
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Travel Guide',
    destinationCategory: 'India',
    excerpt: '',
    content: '',
    author: 'Admin (superadmin)',
    authorRole: 'Travel Guide & Editor',
    coverImage: '',
    readTime: '5 min read',
    tags: '',
    status: 'Published',
    featured: true,
    metaTitle: '',
    metaDescription: '',
  });

  const getAuthorName = (author) => extractAuthorName(author, 'Jodhpur Voyage');

  const getAuthorRole = (author, fallbackRole) => {
    if (typeof author === 'object' && author?.role) return author.role;
    return fallbackRole || 'Travel Specialist';
  };

  const getAuthorAvatar = (author, authorAvatar) => {
    if (typeof author === 'object' && author?.avatar) return author.avatar;
    return authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
  };

  const handleOpenPreview = async (blog) => {
    setPreviewBlog(blog);
    setPreviewLoading(true);
    try {
      let fullBlog = { ...blog };
      const slugOrId = blog.slug || blog.id || blog._id;
      if (slugOrId) {
        const res = await blogsApi.getBlogById(slugOrId);
        if (res?.data) {
          const fetched = res.data.data || res.data;
          fullBlog = { ...fullBlog, ...fetched };
        }
      }

      // If content is empty or short header widget only, fetch full original article
      const currentContent = extractHtmlContent(fullBlog);
      if (!currentContent || currentContent.length < 250) {
        const wpFull = await fetchFullWordPressContent({
          slug: blog.slug,
          url: blog.originalUrl,
          type: 'blog',
        });
        if (wpFull?.content) {
          fullBlog.content = wpFull.content;
          if (wpFull.coverImage) fullBlog.coverImage = wpFull.coverImage;
        }
      }

      setPreviewBlog(fullBlog);
    } catch (err) {
      console.warn('Failed to fetch full blog detail for preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setIsAddingDestination(false);
    setNewDestinationInput('');
    setFormData({
      title: '',
      slug: '',
      category: 'Travel Guide',
      destinationCategory: 'India',
      excerpt: '',
      content: '',
      author: 'Admin (superadmin)',
      authorRole: 'Travel Guide & Editor',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
      readTime: '5 min read',
      tags: 'Jodhpur, Rajasthan, Travel, Guide',
      status: 'Published',
      featured: true,
      metaTitle: '',
      metaDescription: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (blog) => {
    let initialContent = extractHtmlContent(blog);
    let initialCover = extractCoverImage(blog) || '';
    setEditingBlog(blog);
    setIsAddingDestination(false);
    setNewDestinationInput('');
    setFormData({
      title: extractTitle(blog.title || blog),
      slug: blog.slug || '',
      category: blog.category || 'Travel Guide',
      destinationCategory: blog.destinationCategory || blog.destination || 'India',
      excerpt: extractPlainText(blog.excerpt || blog.summary || initialContent, 160),
      content: initialContent,
      author: getAuthorName(blog.author),
      authorRole: getAuthorRole(blog.author, blog.authorRole),
      coverImage: initialCover,
      readTime: blog.readTime || '5 min read',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      status: blog.status || 'Published',
      featured: Boolean(blog.featured),
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
    });
    setIsModalOpen(true);

    try {
      let fullBlog = { ...blog };
      const slugOrId = blog.slug || blog.id || blog._id;
      if (slugOrId) {
        const res = await blogsApi.getBlogById(slugOrId);
        if (res?.data) {
          fullBlog = { ...fullBlog, ...(res.data.data || res.data) };
        }
      }

      let richContent = extractHtmlContent(fullBlog);
      if (!richContent || richContent.length < 250) {
        const wpFull = await fetchFullWordPressContent({
          slug: blog.slug,
          url: blog.originalUrl,
          type: 'blog',
        });
        if (wpFull?.content) {
          richContent = wpFull.content;
          if (wpFull.coverImage) initialCover = wpFull.coverImage;
        }
      }

      if (richContent) {
        setFormData((prev) => ({
          ...prev,
          content: richContent,
          coverImage: prev.coverImage || initialCover,
          excerpt: prev.excerpt || extractPlainText(fullBlog.excerpt || richContent, 160),
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch full blog detail for editor:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authorAvatar =
      (editingBlog && typeof editingBlog.author === 'object' ? editingBlog.author.avatar : null) ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

    const payload = {
      ...formData,
      destinationCategory: formData.destinationCategory || 'India',
      destination: formData.destinationCategory || 'India',
      author: {
        name: formData.author,
        role: formData.authorRole,
        avatar: authorAvatar,
      },
      tags: formData.tags
        ? (Array.isArray(formData.tags)
            ? formData.tags
            : formData.tags.split(',').map((t) => t.trim()).filter(Boolean))
        : [],
    };

    if (editingBlog) {
      await updateBlog(editingBlog.id || editingBlog._id, payload);
    } else {
      await addBlog(payload);
    }

    setIsModalOpen(false);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === 'All' || blog.category === selectedCategory;
    const dest = (blog.destinationCategory || blog.destination || 'India').toLowerCase();
    const matchesDestination =
      selectedDestination === 'All' || dest === selectedDestination.toLowerCase();
    return matchesCategory && matchesDestination;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Travel Articles & Blog Editor</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish experiential travel stories, destination guides, food blogs, and photography tips for travelers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleSyncWordPress}
            disabled={syncing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Sync latest blogs from WordPress"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing WP...' : 'WP Sync'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title, keywords, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Category Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-amber-600" /> Destination:
          </span>
          <button
            onClick={() => setSelectedDestination('All')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedDestination === 'All'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Destinations
          </button>
          {destinationCategories.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDestination(dest)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedDestination.toLowerCase() === dest.toLowerCase()
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-80" />
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No blog articles found</h3>
          <p className="text-xs text-slate-500">Try adjusting your category/destination filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog, idx) => {
            const blogId = blog.id || blog._id;
            const authorName = getAuthorName(blog.author);
            const authorAvatar = getAuthorAvatar(blog.author, blog.authorAvatar);
            const coverImg = extractCoverImage(blog, idx);
            const blogTitle = extractTitle(blog.title || blog);
            const blogExcerpt = extractPlainText(blog.excerpt || blog.content || blog.summary, 140);
            const destCat = blog.destinationCategory || blog.destination || 'India';

            return (
              <div
                key={blogId}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={coverImg}
                    alt={blogTitle}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f172a]/90 text-white shadow-sm">
                      {blog.category || 'Travel Guide'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shadow-2xs flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {destCat}
                    </span>
                    {blog.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-white shadow-2xs">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        blog.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {blog.status || 'Published'}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {blog.publishedAt?.slice(0, 10) || blog.createdAt?.slice(0, 10) || '2026-09-08'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {blog.readTime || '5 min'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                      {blogTitle}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {blogExcerpt || 'No excerpt available.'}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(Array.isArray(blog.tags) ? blog.tags : [blog.tags]).slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200"
                          >
                            #{String(t).trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Author & Actions footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-[11px] font-bold text-slate-800">{authorName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenPreview(blog)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Preview Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(blog)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteBlog(blogId)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingBlog ? 'Edit Travel Article' : 'Write New Travel Blog'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Publish rich editorial stories, photography guides, and travel recommendations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Article Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 7 Hidden Alleys in Jodhpur Every Photographer Must Visit"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] font-medium"
                  >
                    <option value="Travel Guide">Travel Guide</option>
                    <option value="Desert Expeditions">Desert Expeditions</option>
                    <option value="Food & Culture">Food & Culture</option>
                    <option value="Heritage & History">Heritage & History</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>

                {/* Destination Category */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Destination Category
                    </label>
                    {!isAddingDestination && (
                      <button
                        type="button"
                        onClick={() => setIsAddingDestination(true)}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add New
                      </button>
                    )}
                  </div>

                  {isAddingDestination ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        value={newDestinationInput}
                        onChange={(e) => setNewDestinationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveNewDestination();
                          } else if (e.key === 'Escape') {
                            setIsAddingDestination(false);
                            setNewDestinationInput('');
                          }
                        }}
                        placeholder="e.g. Bhutan"
                        className="w-full px-2.5 py-1.5 bg-white text-xs text-slate-900 rounded-lg border border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNewDestination}
                        className="px-2.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-amber-400 text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingDestination(false);
                          setNewDestinationInput('');
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.destinationCategory}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setIsAddingDestination(true);
                        } else {
                          setFormData({ ...formData, destinationCategory: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] font-medium"
                    >
                      {destinationCategories.map((dest) => (
                        <option key={dest} value={dest}>
                          {dest}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="font-bold text-amber-700">
                        + Add New Destination...
                      </option>
                    </select>
                  )}
                </div>

                {/* Estimated Read Time */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Harshit Panigrahi"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    placeholder="Travel Curator"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Article Cover Image"
                required={true}
                value={formData.coverImage}
                onChange={(val) => setFormData({ ...formData, coverImage: val })}
                helperText="Upload image file from device (PNG, JPG, WEBP)"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief 2-sentence summary that appears on the blog cards and social cards..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <RichTextEditor
                label="Full Article Body (Rich Text Editor / HTML)"
                required={true}
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Write full article here. Supports formatting, headings, bold, colors, bullet points, recommendations..."
                minHeight="260px"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Tags / Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="BlueCity, Photography, Heritage, Rajasthan"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="e.g. 7 Best Hidden Blue City Photography Spots in Jodhpur"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Meta description for search engines..."
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

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
                  <span className="text-xs font-semibold text-slate-800">Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800">Feature on Homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {editingBlog ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Preview Drawer */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f172a] text-white">
                  {previewBlog.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {previewBlog.destinationCategory || previewBlog.destination || 'India'}
                </span>
              </div>
              <button
                onClick={() => setPreviewBlog(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {extractCoverImage(previewBlog) && (
                <img
                  src={extractCoverImage(previewBlog)}
                  alt={extractTitle(previewBlog.title)}
                  className="w-full h-64 rounded-xl object-cover"
                />
              )}

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {extractTitle(previewBlog.title)}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 py-2 border-y border-slate-100">
                <span className="font-bold text-slate-800">By {getAuthorName(previewBlog.author)}</span>
                <span>•</span>
                <span>{previewBlog.readTime || '5 min read'}</span>
                <span>•</span>
                <span>{previewBlog.publishedAt?.slice(0, 10) || previewBlog.createdAt?.slice(0, 10) || '2026-09-08'}</span>
              </div>

              {previewLoading && !extractHtmlContent(previewBlog) ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                  <p className="text-xs font-semibold">Loading article content...</p>
                </div>
              ) : extractHtmlContent(previewBlog) ? (
                <div
                  className="blog-html-content"
                  dangerouslySetInnerHTML={{ __html: extractHtmlContent(previewBlog) }}
                />
              ) : (
                <div className="py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-500">No article body content found for this blog post.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
