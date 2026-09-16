'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { enquiriesApi } from '@/services/api/enquiriesApi';
import { useAuth } from './AuthContext';

const EnquiryContext = createContext();

export function EnquiryProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchEnquiries = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await enquiriesApi.getEnquiries({
        search: searchQuery || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.enquiries || []);
        const normalized = rawList.map((item) => ({
          ...item,
          id: item.id || item._id,
        }));
        setEnquiries(normalized);
      } else {
        setEnquiries([]);
      }
    } catch (e) {
      console.warn('Failed to load enquiries from API:', e);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, statusFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [isAuthenticated, fetchEnquiries]);

  const addEnquiry = async (newEnq) => {
    try {
      const res = await enquiriesApi.createEnquiry(newEnq);
      if (res?.data) {
        const created = res.data.data || res.data;
        const normalized = { ...created, id: created.id || created._id };
        setEnquiries((prev) => [normalized, ...prev]);
        return normalized;
      }
    } catch (err) {
      console.error('Failed to submit enquiry via API:', err);
      throw err;
    }
  };

  const updateStatus = async (id, newStatus, note = '') => {
    try {
      await enquiriesApi.updateEnquiryStatus(id, { status: newStatus, note });
      setEnquiries((prev) =>
        prev.map((item) =>
          (item.id === id || item._id === id)
            ? { ...item, status: newStatus, ...(note ? { notes: note } : {}) }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update enquiry status via API:', err);
      throw err;
    }
  };

  const updateNotes = async (id, notes) => {
    try {
      await enquiriesApi.updateEnquiryStatus(id, { note: notes });
      setEnquiries((prev) =>
        prev.map((item) => ((item.id === id || item._id === id) ? { ...item, notes } : item))
      );
    } catch (err) {
      console.error('Failed to update enquiry note via API:', err);
      throw err;
    }
  };

  const updateEnquiry = (id, patchData) => {
    setEnquiries((prev) =>
      prev.map((item) => ((item.id === id || item._id === id) ? { ...item, ...patchData } : item))
    );
  };

  const deleteEnquiry = async (id) => {
    try {
      await enquiriesApi.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    } catch (err) {
      console.error('Failed to delete enquiry via API:', err);
      throw err;
    }
  };

  // Helper to generate CSV export
  const exportToCSV = (filteredList = enquiries) => {
    const headers = [
      'Enquiry ID',
      'Customer Name',
      'Email',
      'Phone',
      'Destination',
      'Package / Interest',
      'Travelers',
      'Preferred Date',
      'Budget',
      'Status',
      'Source',
      'Created At',
      'Message',
      'Notes',
    ];

    const formatNotesForExport = (notes) => {
      if (!notes) return '';
      if (typeof notes === 'string') return notes;
      if (Array.isArray(notes)) {
        return notes
          .map((n) => (typeof n === 'object' ? n.note || n.text || n.message || '' : String(n)))
          .filter(Boolean)
          .join(' | ');
      }
      if (typeof notes === 'object') {
        return notes.note || notes.text || notes.message || '';
      }
      return String(notes);
    };

    const rows = filteredList.map((e) => [
      `"${e.id}"`,
      `"${e.name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.destination || ''}"`,
      `"${e.packageInterest || ''}"`,
      `"${e.travelers || 1}"`,
      `"${e.preferredDate || ''}"`,
      `"${e.budget || ''}"`,
      `"${e.status || 'New'}"`,
      `"${e.source || 'Website'}"`,
      `"${e.createdAt || ''}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${formatNotesForExport(e.notes).replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jodhpur_voyage_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;
  const convertedCount = enquiries.filter((e) => e.status === 'Converted').length;

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        loading,
        newCount,
        contactedCount,
        convertedCount,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        fetchEnquiries,
        addEnquiry,
        updateStatus,
        updateNotes,
        updateEnquiry,
        deleteEnquiry,
        exportToCSV,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export const useEnquiries = () => useContext(EnquiryContext);
export default EnquiryContext;
