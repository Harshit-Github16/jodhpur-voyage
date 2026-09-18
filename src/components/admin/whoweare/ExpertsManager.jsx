'use client';

import React, { useState, useMemo } from 'react';
import { useWhoWeAre } from '@/context/WhoWeAreContext';
import ImageUploader from '@/components/common/ImageUploader';
import {
  UsersRound,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  LayoutGrid,
  List as ListIcon,
  Award,
  MapPin,
  User,
} from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  role: '',
  expertise: '',
  bio: '',
  image: '',
  experienceYears: '',
  order: 0,
  status: 'Active',
};

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

export default function ExpertsManager() {
  const {
    members,
    loading,
    searchQuery,
    setSearchQuery,
    addMember,
    updateMember,
    deleteMember,
  } = useWhoWeAre();

  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const getId = (m) => m.id || m._id;

  const filtered = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.role, m.expertise, m.bio]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [members, searchQuery]);

  const totalCount = members.length;
  const activeCount = members.filter((m) => (m.status || 'Active') === 'Active').length;

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      ...EMPTY_FORM,
      role: 'Experte voyage Inde du Nord',
      image: PLACEHOLDER_IMG,
      order: members.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      expertise: item.expertise || '',
      bio: item.bio || '',
      image: item.image || item.photo || '',
      experienceYears: item.experienceYears ?? '',
      order: item.order ?? 0,
      status: item.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Please fill in the expert name and title/role.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      expertise: formData.expertise.trim(),
      bio: formData.bio.trim(),
      image: formData.image,
      experienceYears:
        formData.experienceYears === '' ? undefined : Number(formData.experienceYears),
      order: Number(formData.order) || 0,
      status: formData.status,
    };

    setSubmitting(true);
    let res;
    if (editingItem) {
      res = await updateMember(getId(editingItem), payload);
    } else {
      res = await addMember(payload);
    }
    setSubmitting(false);

    if (res?.success !== false) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (item) => {
    if (confirm(`Remove "${item.name}" from the team?`)) {
      await deleteMember(getId(item));
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experts</span>
            <span className="ml-2 text-sm font-black text-slate-900">{totalCount}</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</span>
            <span className="ml-2 text-sm font-black text-emerald-700">{activeCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
            />
          </div>
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
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Expert</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-64" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-2xs min-h-[240px]">
          <UsersRound className="w-7 h-7 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-xs">No experts found</h3>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
            Add local experts to populate the team on your website.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filtered.map((item) => {
            const id = getId(item);
            const status = item.status || 'Active';
            return (
              <div
                key={id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || item.photo || PLACEHOLDER_IMG}
                      alt={item.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <span
                      className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                        status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    {item.expertise && (
                      <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">{item.expertise}</p>
                    )}
                    <h3 className="text-sm font-black text-slate-900 leading-tight">{item.name}</h3>
                    <p className="text-[11px] font-bold text-amber-700 leading-snug line-clamp-1">{item.role}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {item.bio || 'No biography provided yet.'}
                    </p>
                    {item.experienceYears ? (
                      <div className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        <Award className="w-2.5 h-2.5 text-amber-600" />
                        <span>{item.experienceYears} yrs experience</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Order #{item.order ?? 0}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Preview"
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
                      onClick={() => handleDelete(item)}
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Expert</th>
                  <th className="p-3">Title / Role</th>
                  <th className="p-3">Expertise</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const id = getId(item);
                  const status = item.status || 'Active';
                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || item.photo || PLACEHOLDER_IMG}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover object-top shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PLACEHOLDER_IMG;
                            }}
                          />
                          <span className="font-semibold text-slate-900 truncate max-w-[140px]">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-amber-700 font-semibold max-w-[200px] truncate">{item.role}</td>
                      <td className="p-3 text-slate-500 max-w-[220px] truncate">{item.expertise || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">#{item.order ?? 0}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewItem(item)}
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
                            onClick={() => handleDelete(item)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <UsersRound className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {editingItem ? 'Edit Expert' : 'Add Expert'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Local expert profile for the team page.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Expert Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikey"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. North India & Himalayan Travel Expert"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Expertise Line
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="e.g. Rajasthan, Banaras, Ladakh, Spiti"
                  className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <ImageUploader
                label="Expert Photo"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                helperText="Upload expert photo (PNG, JPG, WEBP) - shown as a circular avatar."
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Biography
                </label>
                <textarea
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Namast\u00e9, I am Vikey, a certified French-speaking guide..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Experience (yrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    placeholder="e.g. 6"
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f172a]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Expert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-amber-400 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Website Preview</h3>
                  <p className="text-[10px] text-slate-500">How this expert appears on the team page.</p>
                </div>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0 mx-auto sm:mx-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewItem.image || previewItem.photo || PLACEHOLDER_IMG}
                    alt={previewItem.name}
                    className="w-32 h-32 rounded-full object-cover object-top border border-slate-200 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {previewItem.expertise && (
                    <p className="text-xs text-slate-400 mb-1">{previewItem.expertise}</p>
                  )}
                  <h2 className="text-xl font-black text-slate-800 leading-tight">
                    {previewItem.name}
                    {previewItem.role ? <span className="text-slate-800"> \u2013 {previewItem.role}</span> : null}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {previewItem.bio || 'No biography provided yet.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                        (previewItem.status || 'Active') === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      {previewItem.status || 'Active'}
                    </span>
                    {previewItem.experienceYears ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-bold">
                        <Award className="w-3 h-3" />
                        {previewItem.experienceYears} yrs
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200 font-bold">
                      <MapPin className="w-3 h-3" />
                      Order #{previewItem.order ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                onClick={() => {
                  const item = previewItem;
                  setPreviewItem(null);
                  openEditModal(item);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                Edit
              </button>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
