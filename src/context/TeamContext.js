'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TEAM } from '@/data/mockData';

const TeamContext = createContext();

const STORAGE_KEY = 'jodhpur_voyage_team_v1';

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTeam(JSON.parse(saved));
      } else {
        setTeam(INITIAL_TEAM);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEAM));
      }
    } catch (e) {
      console.error('Failed to load team from localStorage:', e);
      setTeam(INITIAL_TEAM);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (updated) => {
    setTeam(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save team to localStorage:', e);
    }
  };

  const addMember = (memberData) => {
    const newMember = {
      ...memberData,
      id: `team-${Date.now().toString().slice(-4)}`,
      order: team.length + 1,
      status: memberData.status || 'Active',
    };
    const updated = [...team, newMember];
    saveToStorage(updated);
    return newMember;
  };

  const updateMember = (id, patchData) => {
    const updated = team.map((item) =>
      item.id === id ? { ...item, ...patchData } : item
    );
    saveToStorage(updated);
  };

  const deleteMember = (id) => {
    const updated = team.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        loading,
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
