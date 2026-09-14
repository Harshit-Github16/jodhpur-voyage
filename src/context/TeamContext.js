'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { teamApi } from '@/services/api/teamApi';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teamApi.getTeamAdmin();
      if (res?.data) {
        setTeam(Array.isArray(res.data) ? res.data : res.data.data || []);
      } else {
        setTeam([]);
      }
    } catch (e) {
      console.warn('Failed to load team from API:', e);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const addMember = async (memberData) => {
    try {
      const res = await teamApi.createTeamMember(memberData);
      if (res?.data) {
        const created = res.data.data || res.data;
        setTeam((prev) => [...prev, created]);
        return created;
      }
    } catch (err) {
      console.error('Failed to add team member via API:', err);
      throw err;
    }
  };

  const updateMember = async (id, patchData) => {
    try {
      const res = await teamApi.updateTeamMember(id, patchData);
      if (res?.data) {
        const updated = res.data.data || res.data;
        setTeam((prev) => prev.map((item) => (item.id === id ? updated : item)));
        return updated;
      }
    } catch (err) {
      console.error('Failed to update team member via API:', err);
      throw err;
    }
  };

  const deleteMember = async (id) => {
    try {
      await teamApi.deleteTeamMember(id);
      setTeam((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete team member via API:', err);
      throw err;
    }
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        loading,
        fetchTeam,
        addMember,
        updateMember,
        deleteMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
export default TeamContext;
