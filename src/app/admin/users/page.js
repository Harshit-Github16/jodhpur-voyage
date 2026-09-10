'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  X,
  User,
  Shield,
  Clock,
  Sparkles,
  KeyRound,
} from 'lucide-react';

const ROLE_PERMISSIONS = {
  'Super Admin': {
    description: 'Full unrestricted access to all modules, billing, settings, and staff accounts.',
    color: 'bg-amber-500 text-slate-950',
    permissions: [
      'Dashboard & Revenue Analytics',
      'Destinations & City Builder',
      'Tour Packages & Pricing Control',
      'Guest Inquiries CRM & WhatsApp Reply',
      'Reviews & Testimonials Moderation',
      'Travel Blogs Publishing',
      'Team Directory Management',
      'SEO & Sitemap Settings',
      'User Roles & Staff Administration',
      'General Site Settings & Branding',
    ],
  },
  Admin: {
    description: 'Management access for tours, destinations, inquiries, reviews, and bookings.',
    color: 'bg-blue-500 text-white',
    permissions: [
      'Dashboard & Operational Metrics',
      'Destinations & City Builder',
      'Tour Packages & Day-by-Day Itineraries',
      'Guest Inquiries CRM & WhatsApp Reply',
      'Reviews & Testimonials Moderation',
      'Travel Blogs Publishing',
      'Customer Directory & Orders',
    ],
  },
  Editor: {
    description: 'Content creation for blogs, customer reviews, and guide bios.',
    color: 'bg-purple-500 text-white',
    permissions: [
      'Travel Blogs Management',
      'Customer Testimonials View/Add',
      'Team Guide Bios View/Edit',
    ],
  },
};

export default function UsersAndRolesPage() {
  const {
    user,
    staffUsers,
    switchRole,
    switchActiveUser,
    addStaffUser,
    updateStaffUser,
    deleteStaffUser,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    status: 'Active',
    avatar: '',
  });

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '+91 ',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role || 'Admin',
      status: staff.status || 'Active',
      avatar: staff.avatar || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill staff name and email address.');
      return;
    }

    if (editingStaff) {
      updateStaffUser(editingStaff.id, formData);
    } else {
      addStaffUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Staff Users & Role-Based Access Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {staffUsers.length} Active Staff Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign staff roles (Super Admin, Admin, Editor) with granular permission restrictions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Active User Live Role Card & Quick Switcher */}
      <div className="bg-linear-to-r from-slate-900 via-[#0f172a] to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JV'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{user?.name || 'Admin User'}</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950">
                {user?.role || 'Super Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • {user?.phone || '+91 98290 12345'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Simulate Role:</span>
          <select
            value={user?.role || 'Super Admin'}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value="Super Admin">Super Admin (All Access)</option>
            <option value="Admin">Admin (Operations)</option>
            <option value="Editor">Editor (Content Only)</option>
          </select>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 p-5">
        <h3 className="text-sm font-black text-slate-900">Registered Staff Accounts</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffUsers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={staff.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{staff.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 align-top">
                    <div className="text-slate-800 font-medium">{staff.email}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{staff.phone}</div>
                  </td>

                  <td className="py-3 px-4 align-top">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                        staff.role === 'Super Admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : staff.role === 'Admin'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-purple-100 text-purple-900 border border-purple-300'
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top text-slate-500 text-[11px]">
                    {staff.lastLogin || 'Recent'}
                  </td>

                  <td className="py-3 px-4 align-top">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {staff.status || 'Active'}
                    </span>
                  </td>

                  <td className="py-3 px-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Edit Staff User"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {staff.id !== user?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete staff account for ${staff.name}?`)) {
                              deleteStaffUser(staff.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Reference */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">Role Permissions Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLE_PERMISSIONS).map(([roleName, info]) => (
            <div key={roleName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900">{roleName}</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${info.color}`}>
                  {roleName}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{info.description}</p>
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                {info.permissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {editingStaff ? 'Edit Staff Account' : 'Add New Staff User'}
                </h3>
                <p className="text-xs text-slate-500">Assign role access and contact details</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Rathore"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@jodhpurvoyage.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94141 88990"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                >
                  <option value="Super Admin">Super Admin (All Modules & Settings)</option>
                  <option value="Admin">Admin (Operations & CRM)</option>
                  <option value="Editor">Editor (Blogs & Reviews Content)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
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
                  {editingStaff ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
