'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { teamApi } from '@/services/api/teamApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const WhoWeAreContext = createContext(null);

/**
 * "Who We Are" section — the local experts / team members shown on the
 * frontend "Notre équipe locale" block. Wired to the existing /team backend API.
 */
export function WhoWeAreProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  const normalize = (m) => ({
    ...m,
    id: m.id || m._id,
  });

  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await teamApi.getTeamAdmin();
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.team || []);
        setMembers(rawList.map(normalize));
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error('Error fetching Who We Are members:', err);
      setError(err?.message || 'Failed to load team experts');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated, fetchMembers]);

  const addMember = useCallback(
    async (data) => {
      try {
        const res = await teamApi.createTeamMember(data);
        if (res?.data) {
          const created = normalize(res.data.data || res.data);
          setMembers((prev) => [...prev, created]);
          adminContext?.addToast('Expert added successfully!', 'success');
          return { success: true, data: created };
        }
        return { success: false, message: res?.message || 'Failed to add expert' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to add expert', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateMember = useCallback(
    async (id, updateFields) => {
      try {
        const res = await teamApi.updateTeamMember(id, updateFields);
        if (res?.data) {
          const updated = normalize(res.data.data || res.data);
          setMembers((prev) => prev.map((m) => ((m.id || m._id) === id ? updated : m)));
          adminContext?.addToast('Expert updated successfully', 'success');
          return { success: true, data: updated };
        }
        return { success: false, message: res?.message || 'Update failed' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update expert', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const deleteMember = useCallback(
    async (id) => {
      try {
        const res = await teamApi.deleteTeamMember(id);
        setMembers((prev) => prev.filter((m) => (m.id || m._id) !== id));
        adminContext?.addToast('Expert removed', 'info');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete expert', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  return (
    <WhoWeAreContext.Provider
      value={{
        members,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        fetchMembers,
        addMember,
        updateMember,
        deleteMember,
      }}
    >
      {children}
    </WhoWeAreContext.Provider>
  );
}

export function useWhoWeAre() {
  const context = useContext(WhoWeAreContext);
  if (!context) {
    throw new Error('useWhoWeAre must be used within a WhoWeAreProvider');
  }
  return context;
}

export default WhoWeAreContext;
