'use client';

import React, { useState } from 'react';
import { usePosts } from '@/context/PostContext';
import { postsApi } from '@/services/api/postsApi';
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
  Newspaper,
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
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Rajasthan',
  'Desert Expeditions',
  'Heritage & Culture',
  'Travel Tips',
  'News & Updates',
];

const STATUS_OPTIONS = ['All', 'Published', 'Draft', 'Archived'];

export default function PostsPage() {
  const {
    posts,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    addPost,
    updatePost,
    deletePost,
    syncWordPress,
  } = usePosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Rajasthan',
    excerpt: '',
    content: '',
    author: 'Admin',
    authorRole: 'Editorial Team',
    coverImage: '',
    readTime: '4 min read',
    tags: '',
    status: 'Published',
    featured: false,
  });

  const getAuthorName = (author) => extractAuthorName(author, 'Admin');

  const getAuthorRole = (author, fallbackRole) => {
    if (typeof author === 'object' && author?.role) return author.role;
    return fallbackRole || 'Editor';
  };

  const getAuthorAvatar = (author, authorAvatar) => {
    if (typeof author === 'object' && author?.avatar) return author.avatar;
    return (
      authorAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    );
  };

  const handleOpenPreview = async (post) => {
    setPreviewPost(post);
    setPreviewLoading(true);
    try {
      let fullPost = { ...post };
      const slugOrId = post.slug || post.id || post._id;
      if (slugOrId) {
        const res = await postsApi.getPostBySlug(slugOrId);
        if (res?.data) {
          const fetched = res.data.data || res.data;
          fullPost = { ...fullPost, ...fetched };
        }
      }

      // If content is empty or short header widget only, fetch full original article
      const currentContent = extractHtmlContent(fullPost);
      if (!currentContent || currentContent.length < 250) {
        const wpFull = await fetchFullWordPressContent({
          slug: post.slug,
          url: post.originalUrl,
          type: 'post',
        });
        if (wpFull?.content) {
          fullPost.content = wpFull.content;
          if (wpFull.coverImage) fullPost.coverImage = wpFull.coverImage;
        }
      }

      setPreviewPost(fullPost);
    } catch (err) {
      console.warn('Failed to fetch full post detail for preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Rajasthan',
      excerpt: '',
      content: '',
      author: 'Admin',
      authorRole: 'Editorial Team',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
      readTime: '4 min read',
      tags: 'Rajasthan, Jodhpur, Travel, News',
      status: 'Published',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (post) => {
    let initialContent = extractHtmlContent(post);
    let initialCover = extractCoverImage(post) || '';
    setEditingPost(post);
    setFormData({
      title: extractTitle(post.title || post),
      slug: post.slug || '',
      category: post.category || 'Rajasthan',
      excerpt: extractPlainText(post.excerpt || post.summary || initialContent, 160),
      content: initialContent,
      author: getAuthorName(post.author),
      authorRole: getAuthorRole(post.author, post.authorRole),
      coverImage: initialCover,
      readTime: post.readTime || '4 min read',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      status: post.status || 'Published',
      featured: Boolean(post.featured),
    });
    setIsModalOpen(true);

    try {
      let fullPost = { ...post };
      const slugOrId = post.slug || post.id || post._id;
      if (slugOrId) {
        const res = await postsApi.getPostBySlug(slugOrId);
        if (res?.data) {
          fullPost = { ...fullPost, ...(res.data.data || res.data) };
        }
      }

      let richContent = extractHtmlContent(fullPost);
      if (!richContent || richContent.length < 250) {
        const wpFull = await fetchFullWordPressContent({
          slug: post.slug,
          url: post.originalUrl,
          type: 'post',
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
          excerpt: prev.excerpt || extractPlainText(fullPost.excerpt || richContent, 160),
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch full post detail for editor:', err);
    }
  };

  const handleSyncWordPress = async () => {
    if (!confirm('Sync latest posts from WordPress (/api/v1/posts/sync-wordpress)?')) return;
    setSyncing(true);
    await syncWordPress();
    setSyncing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authorAvatar =
      (editingPost && typeof editingPost.author === 'object' ? editingPost.author.avatar : null) ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

    const payload = {
      ...formData,
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

    if (editingPost) {
      await updatePost(editingPost.id || editingPost._id, payload);
    } else {
      await addPost(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Posts Management</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {posts.length} Posts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish social feeds, regional travel announcements, news, and editorial posts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleSyncWordPress}
            disabled={syncing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Sync posts from WordPress API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing WP...' : 'WP Sync'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Post</span>
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
              placeholder="Search posts by title, excerpt, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0f172a]"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
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
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-80" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-2">
          <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No posts found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria, click "WP Sync", or click "Create New Post".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, idx) => {
            const postId = post.id || post._id;
            const authorName = getAuthorName(post.author);
            const authorAvatar = getAuthorAvatar(post.author, post.authorAvatar);
            const coverImg = extractCoverImage(post, idx);
            const postTitle = extractTitle(post.title || post);
            const postExcerpt = extractPlainText(post.excerpt || post.content || post.summary, 140);

            return (
              <div
                key={postId}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={coverImg}
                    alt={postTitle}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f172a]/90 text-white shadow-sm">
                      {post.category || 'General'}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-white shadow-2xs">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        post.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status || 'Published'}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {post.publishedAt?.slice(0, 10) || post.createdAt?.slice(0, 10) || '2026-09-17'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.readTime || '4 min'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                      {postTitle}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {postExcerpt || 'No excerpt available.'}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(Array.isArray(post.tags) ? post.tags : [post.tags]).slice(0, 3).map((t, i) => (
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
                        onClick={() => handleOpenPreview(post)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Preview Post"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePost(postId)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors"
                        title="Delete Post"
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

      {/* Add / Edit Post Modal */}
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
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Publish rich HTML content, updates, and articles.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Traditional Fairs & Festivals of Jodhpur"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
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
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="News & Updates">News & Updates</option>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Culture & Heritage">Culture & Heritage</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Announcements">Announcements</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
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
                    placeholder="Admin"
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
                    placeholder="Editor"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Cover Image"
                required={false}
                value={formData.coverImage}
                onChange={(val) => setFormData({ ...formData, coverImage: val })}
                helperText="Upload image file from device (PNG, JPG, WEBP)"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <RichTextEditor
                label="Full Post Content (Rich Text Editor / HTML)"
                required={true}
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Write full post content here..."
                minHeight="260px"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Rajasthan, Jodhpur, Culture"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
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
                  <span className="text-xs font-semibold text-slate-800">Feature Post</span>
                </label>
              </div>

              {/* Actions */}
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
                  {editingPost ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Preview Drawer */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f172a] text-white">
                {previewPost.category || 'Post'}
              </span>
              <button
                onClick={() => setPreviewPost(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {extractCoverImage(previewPost) && (
                <img
                  src={extractCoverImage(previewPost)}
                  alt={extractTitle(previewPost.title)}
                  className="w-full h-64 rounded-xl object-cover"
                />
              )}

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {extractTitle(previewPost.title)}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 py-2 border-y border-slate-100">
                <span className="font-bold text-slate-800">By {getAuthorName(previewPost.author)}</span>
                <span>•</span>
                <span>{previewPost.readTime || '4 min'}</span>
                <span>•</span>
                <span>{previewPost.publishedAt?.slice(0, 10) || previewPost.createdAt?.slice(0, 10) || '2026-09-17'}</span>
              </div>

              {previewLoading && !extractHtmlContent(previewPost) ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                  <p className="text-xs font-semibold">Loading post content...</p>
                </div>
              ) : extractHtmlContent(previewPost) ? (
                <div
                  className="blog-html-content"
                  dangerouslySetInnerHTML={{ __html: extractHtmlContent(previewPost) }}
                />
              ) : (
                <div className="py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-500">No article body content found for this post.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
