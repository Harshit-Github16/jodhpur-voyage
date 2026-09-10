'use client';

import React, { useState } from 'react';
import { useTeam } from '@/context/TeamContext';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Send,
  Share2,
  Globe,
  UserCheck,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function TeamManagementPage() {
  const { team, loading, addMember, updateMember, deleteMember } = useTeam();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo: '',
    email: '',
    phone: '',
    whatsapp: '',
    linkedin: '',
    instagram: '',
    status: 'Active',
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: 'Tour Curator & Heritage Guide',
      bio: '',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: '',
      phone: '+91 ',
      whatsapp: '',
      linkedin: '',
      instagram: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      photo: member.photo || '',
      email: member.email || '',
      phone: member.phone || '',
      whatsapp: member.whatsapp || '',
      linkedin: member.linkedin || '',
      instagram: member.instagram || '',
      status: member.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      alert('Please fill member name and designation/role.');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, formData);
    } else {
      addMember(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Team Members & Guides</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {team.length} Active Guides
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage local storytellers, desert safari leaders, guest curators, and leadership bios.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Member Photo */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={member.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                      member.status === 'Active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{member.name}</h3>
                  <p className="text-[11px] font-bold text-amber-700 mt-0.5">{member.role}</p>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {member.bio || 'Experienced guide with passion for authentic Rajasthani heritage.'}
                </p>

                {/* Direct Contact Links */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  {member.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[140px]">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="WhatsApp"
                  >
                    <Send className="w-3 h-3" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                    title="Social Link"
                  >
                    <Share2 className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove team member ${member.name}?`)) {
                      deleteMember(member.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                  title="Delete Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {editingMember ? 'Edit Team Member Profile' : 'Add New Team Member'}
                </h3>
                <p className="text-xs text-slate-500">Guide details, biography, and contact info</p>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Harshit Panigrahi"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Desert Safari Leader"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bio / Profile Summary</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief background and expertise in Rajasthan tours..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guide@jodhpurvoyage.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+919829012345"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-semibold"
                  >
                    <option value="Active">Active Guide</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
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
                  {editingMember ? 'Save Profile' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
