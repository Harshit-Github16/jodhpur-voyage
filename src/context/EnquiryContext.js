'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ENQUIRIES } from '@/data/mockData';

const EnquiryContext = createContext();

const STORAGE_KEY = 'jodhpur_voyage_enquiries_v1';

export function EnquiryProvider({ children }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage or mock data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEnquiries(JSON.parse(saved));
      } else {
        setEnquiries(INITIAL_ENQUIRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENQUIRIES));
      }
    } catch (e) {
      console.error('Failed to load enquiries from localStorage:', e);
      setEnquiries(INITIAL_ENQUIRIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (updated) => {
    setEnquiries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save enquiries to localStorage:', e);
    }
  };

  const addEnquiry = (newEnq) => {
    const enqWithId = {
      ...newEnq,
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      status: newEnq.status || 'New',
      createdAt: new Date().toISOString(),
      notes: newEnq.notes || '',
    };
    const updated = [enqWithId, ...enquiries];
    saveToStorage(updated);
    return enqWithId;
  };

  const updateStatus = (id, newStatus) => {
    const updated = enquiries.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveToStorage(updated);
  };

  const updateNotes = (id, notes) => {
    const updated = enquiries.map((item) =>
      item.id === id ? { ...item, notes } : item
    );
    saveToStorage(updated);
  };

  const updateEnquiry = (id, patchData) => {
    const updated = enquiries.map((item) =>
      item.id === id ? { ...item, ...patchData } : item
    );
    saveToStorage(updated);
  };

  const deleteEnquiry = (id) => {
    const updated = enquiries.filter((item) => item.id !== id);
    saveToStorage(updated);
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
      `"${(e.notes || '').replace(/"/g, '""')}"`,
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
