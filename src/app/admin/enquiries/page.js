'use client';

import React, { useState } from 'react';
import { useEnquiries } from '@/context/EnquiryContext';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Send,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  X,
  FileSpreadsheet,
  AlertCircle,
  Plus,
} from 'lucide-react';

const STATUS_TABS = ['All', 'New', 'Contacted', 'Converted', 'Closed'];

export default function EnquiriesManagementPage() {
  const {
    enquiries,
    loading,
    newCount,
    contactedCount,
    convertedCount,
    addEnquiry,
    updateStatus,
    updateNotes,
    deleteEnquiry,
    exportToCSV,
  } = useEnquiries();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Jodhpur',
    packageInterest: 'Mehrangarh Fort Heritage Walk',
    travelers: 2,
    preferredDate: '',
    budget: '',
    message: '',
    status: 'New',
  });

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.destination || '').toLowerCase().includes(q) ||
      (item.packageInterest || '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const formatStaffNotes = (notes) => {
    if (!notes) return '';
    if (typeof notes === 'string') return notes;
    if (Array.isArray(notes)) {
      return notes
        .map((n) => {
          if (typeof n === 'string') return n;
          if (n && typeof n === 'object') return n.note || n.text || n.message || '';
          return '';
        })
        .filter(Boolean)
        .join(' | ');
    }
    if (typeof notes === 'object') {
      return notes.note || notes.text || notes.message || '';
    }
    return String(notes);
  };

  const handleWhatsAppChat = (lead) => {
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Namaste ${lead.name}! Greetings from Jodhpur Voyage. We received your inquiry regarding "${
        lead.packageInterest || lead.destination || 'Rajasthan Tour'
      }". How may we assist you with your personalized travel itinerary?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleOpenNotes = (item) => {
    setSelectedEnquiry(item);
    setNotesText(formatStaffNotes(item.notes));
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = () => {
    if (selectedEnquiry) {
      updateNotes(selectedEnquiry.id || selectedEnquiry._id, notesText);
      setIsNotesModalOpen(false);
      setSelectedEnquiry(null);
    }
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) {
      alert('Please provide customer name and contact phone number.');
      return;
    }
    addEnquiry(newLeadForm);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      destination: 'Jodhpur',
      packageInterest: 'Mehrangarh Fort Heritage Walk',
      travelers: 2,
      preferredDate: '',
      budget: '',
      message: '',
      status: 'New',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Guest Inquiries & Leads CRM
            </h1>
            {newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                {newCount} New Leads
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, update sales pipeline status, reply via 1-Click WhatsApp / Email, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredEnquiries)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export to CSV / Excel</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black">
            {enquiries.length}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</p>
            <p className="text-sm font-black text-slate-900">All Time Leads</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            {newCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Awaiting</p>
            <p className="text-sm font-black text-slate-900">Need Response</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-black">
            {contactedCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Discussion</p>
            <p className="text-sm font-black text-slate-900">Contacted</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
            {convertedCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Tours</p>
            <p className="text-sm font-black text-slate-900">Converted VIPs</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Enquiries Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Lead ID / Date</th>
                <th className="py-3 px-4">Customer Info</th>
                <th className="py-3 px-4">Tour Request</th>
                <th className="py-3 px-4">Message / Requirements</th>
                <th className="py-3 px-4">Status Pipeline</th>
                <th className="py-3 px-4 text-center">Quick Actions</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((lead) => {
                  const leadId = lead.id || lead._id;
                  const staffNotes = formatStaffNotes(lead.notes);
                  return (
                    <tr key={leadId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono font-bold text-slate-900">{leadId}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-semibold mt-1 inline-block">
                          {lead.source || 'Form'}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.email && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top max-w-[180px]">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {lead.packageInterest || lead.destination}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {lead.travelers} Guests • Date: {lead.preferredDate || 'Flexible'}
                        </div>
                        {lead.budget && (
                          <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                            Budget: {lead.budget}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top max-w-[220px]">
                        <p className="text-slate-600 line-clamp-2 italic">
                          "{lead.message || 'No custom message provided.'}"
                        </p>
                        {staffNotes && (
                          <div className="mt-1.5 p-1.5 bg-amber-50 rounded-lg border border-amber-200/60 text-[10px] text-amber-900 font-medium">
                            <strong>Staff Note:</strong> {staffNotes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(leadId, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            lead.status === 'New'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : lead.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : lead.status === 'Converted'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="New">🟡 New Lead</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="Converted">🟢 Converted / Paid</option>
                          <option value="Closed">⚪ Closed / Archived</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 align-top text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleWhatsAppChat(lead)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                            title="Open WhatsApp Chat"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}?subject=Regarding Your Rajasthan Tour Inquiry - Jodhpur Voyage&body=Dear ${lead.name},%0D%0A%0D%0AThank you for contacting Jodhpur Voyage.`}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Send Direct Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenNotes(lead)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 transition-colors cursor-pointer"
                            title="Edit Staff Notes"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from ${lead.name}?`)) {
                                deleteEnquiry(leadId);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Notes Modal */}
      {isNotesModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Internal Staff Remarks</h3>
                <p className="text-xs text-slate-500">Lead: {selectedEnquiry.name} ({selectedEnquiry.id})</p>
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Notes / Quotation / Follow-up Details
              </label>
              <textarea
                rows={4}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="e.g. Spoke on WhatsApp, customer requested 4-star hotel in Jodhpur and private AC vehicle. Follow up on Friday..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Add Manual Guest Lead</h3>
                <p className="text-xs text-slate-500">Record phone / walk-in / WhatsApp inquiry</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travelers Count</label>
                  <input
                    type="number"
                    value={newLeadForm.travelers}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, travelers: Number(e.target.value) })}
                    placeholder="2"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tour Package / Destination</label>
                  <input
                    type="text"
                    value={newLeadForm.packageInterest}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, packageInterest: e.target.value })}
                    placeholder="Mehrangarh Walk / Osian Safari"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={newLeadForm.preferredDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Message / Notes</label>
                  <textarea
                    rows={2}
                    value={newLeadForm.message}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                    placeholder="Details about request..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
